"use client";

import Image from "next/image";
import { useSyncExternalStore } from "react";
import type { Project } from "@/content/projects";

/**
 * The poster ships in the static HTML and is the LCP candidate, so a card is
 * never empty and the tour never blocks first paint. The video sits on top of
 * the poster rather than replacing it: if it fails, the poster is already there
 * and there is no error state to design.
 *
 * Under reduced motion no video is rendered at all — not a shorter one.
 */
export function AppMedia({ project, active }: { project: Project; active: boolean }) {
  const reducedMotion = usePrefersReducedMotion();
  const showTour = active && Boolean(project.tour) && !reducedMotion;

  return (
    <div className="relative aspect-[16/10] w-full overflow-hidden bg-canvas">
      <Image
        src={project.poster ?? ""}
        alt={project.posterAlt ?? ""}
        width={1440}
        height={900}
        priority={active}
        // Every card's poster sits in the DOM at once (see AppCard), and
        // inactive ones are shifted out of the viewport by the carousel's
        // transform rather than removed — so browsers never consider them
        // close enough to trigger native lazy loading, and a slide beyond
        // the second could go undecoded until the visitor navigates to it.
        // Every poster needs to load regardless of position; only the
        // active card also gets `priority`, which additionally preloads it
        // as the LCP candidate.
        loading="eager"
        className="h-full w-full object-cover object-top"
      />
      {showTour && (
        <video
          key={project.tour}
          src={project.tour}
          autoPlay
          loop
          muted
          playsInline
          preload="none"
          aria-hidden
          className="absolute inset-0 h-full w-full object-cover object-top"
        />
      )}
    </div>
  );
}

function usePrefersReducedMotion() {
  // The server has no way to know the visitor's OS preference, and this value
  // is what the very first painted frame (the prerendered HTML, and the
  // just-hydrated DOM before this hook's client subscription kicks in) is
  // built from. Defaulting to "not reduced" would mean every visitor with
  // reduced motion enabled briefly gets a <video> in that first frame — a
  // real violation of "no video is rendered at all," not a theoretical one,
  // since Task 5's carousel starts with slide 0 active. Defaulting to
  // "reduced" instead means the cost lands on non-reduced-motion users, who
  // see the tour appear a beat after hydration rather than in the first
  // frame — acceptable, and it keeps the poster the LCP element. Do not
  // change this back to `() => false`.
  return useSyncExternalStore(subscribeToReducedMotion, getReducedMotionSnapshot, () => true);
}

function subscribeToReducedMotion(onChange: () => void) {
  const query = matchMedia("(prefers-reduced-motion: reduce)");
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

function getReducedMotionSnapshot() {
  return matchMedia("(prefers-reduced-motion: reduce)").matches;
}

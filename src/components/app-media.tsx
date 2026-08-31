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
  return useSyncExternalStore(subscribeToReducedMotion, getReducedMotionSnapshot, () => false);
}

function subscribeToReducedMotion(onChange: () => void) {
  const query = matchMedia("(prefers-reduced-motion: reduce)");
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

function getReducedMotionSnapshot() {
  return matchMedia("(prefers-reduced-motion: reduce)").matches;
}

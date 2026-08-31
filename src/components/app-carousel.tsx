"use client";

import { useRef, useState } from "react";
import { AppCard } from "./app-card";
import type { Project } from "@/content/projects";

/** Minimum horizontal travel, in pixels, before a touch counts as a swipe
 *  rather than a tap or scroll wobble. */
const SWIPE_THRESHOLD_PX = 40;

/**
 * Deliberately does not auto-advance. Motion already comes from the active
 * card's tour looping, and a carousel that moves on its own takes control away
 * from the person this page is trying to impress.
 */
export function AppCarousel({ projects }: { projects: Project[] }) {
  const [index, setIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const move = (delta: number) =>
    setIndex((current) => (current + delta + projects.length) % projects.length);

  const handleTouchStart = (event: React.TouchEvent) => {
    touchStartX.current = event.touches[0]?.clientX ?? null;
  };

  const handleTouchEnd = (event: React.TouchEvent) => {
    const startX = touchStartX.current;
    touchStartX.current = null;
    if (startX === null) return;

    const endX = event.changedTouches[0]?.clientX ?? startX;
    const delta = endX - startX;
    if (delta <= -SWIPE_THRESHOLD_PX) move(1);
    else if (delta >= SWIPE_THRESHOLD_PX) move(-1);
  };

  return (
    <section aria-label="Deployed applications">
      <div className="relative">
        <div
          role="group"
          aria-roledescription="carousel"
          aria-label="Deployed applications"
          className="overflow-hidden"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div
            className="flex transition-transform duration-500 ease-out motion-reduce:transition-none"
            style={{ transform: `translateX(-${index * 100}%)` }}
          >
            {projects.map((project, position) => (
              <div
                key={project.slug}
                className={`w-full shrink-0 px-2 transition-opacity duration-500 motion-reduce:transition-none ${
                  position === index ? "opacity-100" : "opacity-35"
                }`}
              >
                <AppCard project={project} active={position === index} />
              </div>
            ))}
          </div>
        </div>

        <CarouselButton label="Previous app" onClick={() => move(-1)} className="left-0">
          ‹
        </CarouselButton>
        <CarouselButton label="Next app" onClick={() => move(1)} className="right-0">
          ›
        </CarouselButton>
      </div>

      <div
        role="tablist"
        aria-label="Choose an application"
        className="mt-3 flex gap-1 overflow-x-auto rounded-lg border border-line-soft bg-raised p-1"
        onKeyDown={(event) => {
          if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
          // Roving tabindex: only one tab is ever tab-stoppable, so DOM focus
          // has to move with the selection, not just the aria-selected state.
          const delta = event.key === "ArrowRight" ? 1 : -1;
          const next = (index + delta + projects.length) % projects.length;
          setIndex(next);
          const tabs = event.currentTarget.querySelectorAll<HTMLButtonElement>('[role="tab"]');
          tabs[next]?.focus();
        }}
      >
        {projects.map((project, position) => (
          <button
            key={project.slug}
            role="tab"
            type="button"
            aria-selected={position === index}
            tabIndex={position === index ? 0 : -1}
            onClick={() => setIndex(position)}
            className={`flex min-w-28 flex-1 items-center justify-center gap-1.5 whitespace-nowrap rounded-md px-2 py-2 text-xs transition-colors ${
              position === index
                ? "bg-surface font-medium text-text"
                : "text-muted hover:text-text"
            }`}
          >
            <span className="size-1 rounded-full bg-live" aria-hidden />
            {project.title}
          </button>
        ))}
      </div>
    </section>
  );
}

function CarouselButton({
  label,
  onClick,
  className,
  children,
}: {
  label: string;
  onClick: () => void;
  className: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={`absolute top-1/2 z-10 flex size-9 -translate-y-1/2 items-center justify-center rounded-full border border-line bg-raised/90 text-muted backdrop-blur transition-colors hover:border-accent hover:text-accent ${className}`}
    >
      {children}
    </button>
  );
}

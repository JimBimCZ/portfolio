import type { Metadata } from "next";
import { SpecBlock } from "@/components/spec-block";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "About",
  description: site.intro,
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-20">
      <h1 className="font-display text-[clamp(2rem,5vw,3.25rem)] font-semibold tracking-[-0.03em]">
        About
      </h1>

      <div className="mt-10 grid gap-6 text-lg leading-relaxed">
        <p>{site.intro}</p>
        <p className="text-muted">
          Replace this with the real story: how you got here, the kind of problem
          you want next, and what a team gets when they hire you. Two or three
          short paragraphs beat one long one.
        </p>
        <p className="text-muted">
          Keep it concrete. Systems you have run, decisions you would make
          differently, and the parts of the job you actually enjoy tell a reader
          more than a list of adjectives.
        </p>
      </div>

      <div className="mt-14">
        <SpecBlock rows={site.manifest} />
      </div>
    </div>
  );
}

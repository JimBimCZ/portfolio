import { NotFoundPage } from "@/components/pages/not-found";
import { getCopy } from "@/content/copy";

/** Sits on the /cs segment rather than the (cs) group root: unmatched URLs are
 *  `global-not-found.tsx`'s job, and this only catches `notFound()` thrown
 *  under /cs — an unknown slug on /cs/work/[slug]. */
export default function CzechNotFound() {
  return <NotFoundPage copy={getCopy("cs")} home="/cs" />;
}

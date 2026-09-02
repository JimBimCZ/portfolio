import { NotFoundPage } from "@/components/pages/not-found";
import { getCopy } from "@/content/copy";

export default function NotFound() {
  return <NotFoundPage copy={getCopy("en")} home="/" />;
}

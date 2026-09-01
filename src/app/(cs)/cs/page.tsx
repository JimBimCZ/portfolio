import { HomePage } from "@/components/pages/home";
import { getCopy } from "@/content/copy";

export default function CzechHome() {
  return <HomePage copy={getCopy("cs")} locale="cs" />;
}

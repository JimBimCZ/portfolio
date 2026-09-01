import { HomePage } from "@/components/pages/home";
import { getCopy } from "@/content/copy";

export default function Home() {
  return <HomePage copy={getCopy("en")} locale="en" />;
}

import Spot from "@/src/view/spot/index";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Spot Trading",
  description: "Biggest Exchange in Asia",
};

export default function SpotPage() {
  return (
    <Spot/>
  );
}

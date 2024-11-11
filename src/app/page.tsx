import Home from "@/src/view/index";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Armani Exchange",
  description: "Biggest Exchange in Asia",
};

export default function HomePage() {
  return (
    <Home/>
  );
}

import type { Metadata } from "next";

const title = "about studio pill - cg artist and visualization practice";
const description =
  "learn about studio pill, the cg visualization practice led by pilu in cluj-napoca, romania, focusing on emotive architectural storytelling.";

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
    url: "https://studiopill.com/about",
    type: "profile",
  },
  alternates: {
    canonical: "https://studiopill.com/about",
  },
};

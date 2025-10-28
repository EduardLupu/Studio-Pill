import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { GoogleAnalytics } from "@next/third-parties/google";

const grotesk = Space_Grotesk({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-grotesk",
  weight: ["300", "400", "500", "600"],
});

const baseTitle = "studio pill - cg artist - 3d visualization";
const description =
  "studio pill crafts emotive cg and 3d visualization experiences from cluj-napoca, romania. interior, exterior, and visual arts projects.";

export const metadata: Metadata = {
  metadataBase: new URL("https://studiopill.com"),
  title: {
    default: baseTitle,
    template: "%s - studio pill",
  },
  description,
  openGraph: {
    title: baseTitle,
    description,
    url: "https://studiopill.com",
    siteName: "studio pill",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "https://studiopill.com/apple-touch-icon.png",
        width: 180,
        height: 180,
        alt: "studio pill monogram",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: baseTitle,
    description,
    images: ["https://studiopill.com/apple-touch-icon.png"],
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  keywords: [
    "studio pill",
    "cg artist",
    "3d visualization",
    "architectural renders",
    "visualization studio",
    "interior renders",
    "exterior renders",
    "visual storytelling",
  ],
  alternates: {
    canonical: "https://studiopill.com",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>): JSX.Element {
  return (
    <html lang="en" className="bg-white text-ink">
      <body
        className={[
          grotesk.variable,
          "min-h-screen bg-white text-ink antialiased",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        <Navbar />
        <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 pb-20 pt-16 sm:px-6 lg:px-8">
          {children}
        </main>
        <Footer />
        <GoogleAnalytics gaId={`${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}`} />
      </body>
    </html>
  );
}

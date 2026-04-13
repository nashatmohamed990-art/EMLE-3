import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "EMLE QBank – Egypt's #1 Medical Licensing Exam Prep",
  description:
    "4,000+ EMLE-level clinical vignettes, AI question generator, smart flashcards, and performance analytics to help every Egyptian doctor pass EMLE on the first attempt.",
  keywords: "EMLE, Egyptian Medical Licensing Exam, QBank, medical exam prep, Egypt",
  authors: [{ name: "EMLE QBank" }],
  openGraph: {
    title: "EMLE QBank",
    description: "Egypt's #1 EMLE preparation platform",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}

import type { Metadata, Viewport } from "next";
import { Amiri, Bricolage_Grotesque, DM_Mono, Instrument_Serif, Space_Grotesk } from "next/font/google";
import "./globals.css";

const body = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const display = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage",
  display: "swap",
});

const serif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-instrument",
  display: "swap",
});

const mono = DM_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-dm-mono",
  display: "swap",
});

const amiri = Amiri({
  subsets: ["arabic"],
  weight: "400",
  variable: "--font-amiri",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Darija Wordle — Daily Moroccan Arabic Word Puzzle",
  description:
    "Guess a five-character Darija word in six tries. A fresh Moroccan Arabic puzzle every day, with meanings sourced from darija.io.",
  applicationName: "Darija Wordle",
  openGraph: {
    title: "Darija Wordle",
    description: "Five characters. Six tries. One Moroccan word a day.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#f2efe7",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${body.variable} ${display.variable} ${serif.variable} ${mono.variable} ${amiri.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}

import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import Footer from "@/components/layout/Footer";
import { Suspense } from "react";
import { Toaster } from "@/components/shared/toaster";
import NavbarWapper from "@/components/layout/Navbar/NavbarWrapper";
import { Open_Sans, Changa_One } from "next/font/google";
import cx from "classnames";
import "./globals.css";

const openSans = Open_Sans({
  variable: "--font-openSans",
  weight: ["400", "600", "800"],
  subsets: ["latin"],
});
const changaOne = Changa_One({
  variable: "--font-changaOne",
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TapInsight",
  description: "Add One-Tap Surveys To Your Website",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${cx(openSans.variable, changaOne.variable)}`}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}

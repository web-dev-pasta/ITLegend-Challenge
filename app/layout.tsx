import type { Metadata } from "next";
import { League_Spartan, Poppins } from "next/font/google";
import "./globals.css";
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
config.autoAddCss = false;
const leagueSpartan = League_Spartan({
  preload: true,
  weight: ["400", "500", "600", "700"],
  variable: "--font-spartan",
  subsets: ["latin"],
});

const poppins = Poppins({
  preload: true,
  weight: ["400", "500", "600"],
  variable: "--font-poppins-family",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ITLegend FE Challenge",
  description: "Learn new skills with practical online courses.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${leagueSpartan.variable} ${poppins.variable}`}>
      <body className={leagueSpartan.className}>{children}</body>
    </html>
  );
}

import type { Metadata } from "next";
import { Onest } from "next/font/google";
import "./globals.css";

const onest = Onest({
  variable: "--font-onest",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Design Code Templates",
    template: "%s · Design Code",
  },
  description:
    "Reusable UI templates starting with an adjustable glassmorphism workspace.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${onest.variable} h-full antialiased`}>
      <body className={`${onest.className} min-h-full flex flex-col`}>
        {children}
      </body>
    </html>
  );
}

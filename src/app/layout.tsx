import type { Metadata } from "next";
import { Roboto_Condensed } from "next/font/google";
import "./globals.css";
import { ReduxProvider } from "@/store/provider";
import { Toaster } from "sonner";

const robotoCondensed = Roboto_Condensed({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-roboto-condensed",
});

export const metadata: Metadata = {
  title: "Salamat Innovation Admin",
  description: "Admin Panel for Salamat Innovation",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${robotoCondensed.variable} font-sans`}>
        <ReduxProvider>
          {children}
          <Toaster position="top-center" richColors theme="light" />
        </ReduxProvider>
      </body>
    </html>
  );
}
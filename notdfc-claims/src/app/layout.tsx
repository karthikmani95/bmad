import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";

import { MainLayout } from "@/components/layout/MainLayout";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: "NotDFC | Digital Claims Management",
  description: "Secure standalone portal for NotDFC banking claims.",
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  display: "swap",
  subsets: ["latin"],
});

import { ToastContainer } from "@/components/ui/ToastContainer";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.className} antialiased selection:bg-notdfc-navy-light selection:text-white`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light" // Force light for the premium bank look
          enableSystem={false}
          disableTransitionOnChange
        >
          <MainLayout>
            {children}
          </MainLayout>
          <ToastContainer />
        </ThemeProvider>
      </body>
    </html>
  );
}

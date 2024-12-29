import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "@/components/ThemeProvider";
import ClientProvider from "./ClientProvider";
import MigrationNotice from "@/components/PaymentRequest";
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Marketplace Dashboard",
  description:"A dashboard for managing your marketplace",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
<body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <MigrationNotice/>
      </body>
      
    </html>
  );
}

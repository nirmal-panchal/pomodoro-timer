import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Pomodoro Timer",
  description: "A beautiful and functional Pomodoro timer application",
  icons: {
    icon: "/pomodoro-logo.png",
    apple: "/pomodoro-logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <title>Pomodoro Timer</title>
        <link rel="icon" type="image/x-icon" href="/pomodoro-logo.png" />
      </head>
      <body className={inter.variable}>
        <ThemeProvider defaultTheme="system" storageKey="pomodoro-theme">
          {children}
          <Toaster position="bottom-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}

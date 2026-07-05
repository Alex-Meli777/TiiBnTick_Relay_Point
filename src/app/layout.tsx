import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Suspense } from "react";
import Navbar from "@/components/layout/Navbar";
import { ToastProvider } from "@/components/ui/Toast";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Points Relais TiiBnTick",
  description:
    "Module point relais — parcourir, gérer et suivre les livraisons TiiBnTick",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        <ToastProvider>
          <Navbar />
          <main className="min-h-[calc(100vh-4rem)]">{children}</main>
          <footer className="border-t border-gray-200 bg-white py-6 text-center text-sm text-gray-500">
            © 2026 TiiBnTick
          </footer>
        </ToastProvider>
      </body>
    </html>
  );
}

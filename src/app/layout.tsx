import Providers from "@/src/provider/Provider";
import "./globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import { headers } from "next/headers";
import type { Metadata } from "next";

import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "FluxFolio",
  description:
    "FluxFolio is a user-friendly dApp that allows users to seamlessly check their wallet balances and perform transactions with ease. Empowering you with real-time insights into your digital assets, FluxFolio simplifies managing your crypto portfolio with intuitive tools and secure transaction capabilities.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookie = headers().get("cookie");

  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers cookie={cookie}>{children}</Providers>
      </body>
    </html>
  );
}

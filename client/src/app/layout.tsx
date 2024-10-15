"use client"
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import Navabar from "@/components/navbar";
import { AptosWalletAdapterProvider } from "@aptos-labs/wallet-adapter-react";
import { WalletSelector } from "@aptos-labs/wallet-adapter-ant-design";
import "@aptos-labs/wallet-adapter-ant-design/dist/index.css";

import { Network } from "@aptos-labs/ts-sdk";
import { PropsWithChildren } from "react";
import { PetraWallet } from "petra-plugin-wallet-adapter";
const inter = Inter({ subsets: ["latin"] });



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const wallets = [new PetraWallet()];
  return (
       <AptosWalletAdapterProvider plugins={wallets} autoConnect={true}>
  

    <html lang="en">
      <body className={inter.className}>
        <Navabar />
  
        <main>{children}</main>
        <Toaster />
      </body>
      </html>
          </AptosWalletAdapterProvider>
  );
}

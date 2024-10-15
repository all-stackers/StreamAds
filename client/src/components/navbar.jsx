"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { WalletSelector } from "@aptos-labs/wallet-adapter-ant-design";
import "@aptos-labs/wallet-adapter-ant-design/dist/index.css";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Blocks, Zap, Shield, Users, ArrowRight, CheckCircle, Twitter } from "lucide-react"

const Navabar = () => {
  const { account } = useWallet();
  const router = useRouter();

  useEffect(() => {
    if (account?.address) {
      fetch(`https://streamads-python-backend.onrender.com/twitter_status?wallet_address=${account.address}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      })
        .then(response => response.json())
        .then(data => {
          if (data.new) {
            router.push("/onboarding/user");
          } else {
            if (router.pathname === "/onboarding/user") {
              router.push("/user/campaign");
            }
          }
        })
        .catch(error => {
          console.error("Error fetching Twitter status:", error);
        });
    }
  }, [account])

  return (
      <div>
      <header className="px-4 lg:px-6 h-16 flex items-center border-b border-gray-200 bg-white sticky top-0 z-50">
      <div className="flex items-center justify-center cursor-pointer">
        <Blocks className="h-6 w-6 text-blue-600" />
        <span className="ml-2 text-2xl font-bold text-gray-900" onClick={() => router.push("/")}>StreamAD</span>
      </div>
      <nav className="ml-auto flex gap-4 sm:gap-6 mr-[60px]">
        <Link className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors" href="/#features">
          Features
        </Link>
        <Link className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors" href="/#how-it-works">
          How It Works
        </Link>
        <Link className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors" href="/#faqs">
          FAQs
        </Link>
      </nav>
      <div className="ml-4" variant="default">
       <WalletSelector />
      </div>
      </header>
      </div>
  );
};

export default Navabar;

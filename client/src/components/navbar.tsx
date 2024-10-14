"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { PetraWallet } from "petra-plugin-wallet-adapter";
import { AptosWalletAdapterProvider } from "@aptos-labs/wallet-adapter-react";
import { WalletSelector } from "@aptos-labs/wallet-adapter-ant-design";
import "@aptos-labs/wallet-adapter-ant-design/dist/index.css";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { AptosConfig, Aptos, Network } from "@aptos-labs/ts-sdk";

const Navabar = () => {
  const { account } = useWallet();
  console.log(account?.address)
  const router = useRouter();
  return (
    <div className="flex px-[50px] py-[20px] justify-center">
      <div className="w-[90%] flex justify-between">
        <div className="flex gap-x-[20px] items-center">
          <div className="flex items-center gap-x-[10px]">
            <img
              className="h-[35px] rounded-full"
              src="/assets/images/logo.png"
              alt="logo"
            />
            <h1 className="font-[800] text-[20px] tracking-[.1em] text-[#273339]">
              StreamAds
            </h1>
          </div>
          <div className="flex gap-x-[15px]">
            <span className="font-[600] text-gray-400 cursor-pointer">
              Home
            </span>
            <span
              className="font-[600] text-gray-400 cursor-pointer"
              onClick={() => router.push("/campaign")}
            >
              Discover
            </span>
          </div>
        </div>
        <div className="flex items-center gap-x-[15px]">
          <img
            src="/assets/images/user.png"
            alt="avatar"
            className="h-[40px] rounded-full"
          />
         
        
  <WalletSelector />

      
        </div>
      </div>
    </div>
  );
};

export default Navabar;

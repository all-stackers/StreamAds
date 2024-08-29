"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { Account, Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";

const Navabar = () => {
  const [userAddress, setUserAddress] = React.useState("");
  const [publicKey, setPublicKey] = React.useState("null");
    const getAptosWallet = async() => {
      const isPetraInstalled =await  window?.aptos;
      if ('aptos' in window) {
        console.log(window.aptos)
        const wallet = window.aptos;
 
        try {
            // await wallet.disconnect(); //disconnect
  const response = await wallet.connect();
  console.log(response); // { address: string, address: string }
          setUserAddress(response.address);
          setPublicKey(response.publicKey);
  const account = await wallet.account();
  console.log(account); // { address: string, address: string }
} catch (error) {
  // { code: 4001, message: "User rejected the request."}
}

  } else {
    window.open('https://petra.app/', `_blank`);
  }
    };
  
  const createCampaign = async () => {
    const config = new AptosConfig({ network: Network.TESTNET });
    const aptos = new Aptos(config);
    const modules = await aptos.getAccountModules({ accountAddress: "0xe4b14261dcfdc02456b31d0a216a1de2a706efcabc817efdd6f3f42f0480db79" });
    console.log(modules);
    const transaction = await aptos.transaction.build.simple({
  sender: "0xe4b14261dcfdc02456b31d0a216a1de2a706efcabc817efdd6f3f42f0480db79",
  data: {
    function: "0xe4b14261dcfdc02456b31d0a216a1de2a706efcabc817efdd6f3f42f0480db79::stream::create_campaign",
    functionArguments: ["hey",0.1]
  },
    });
    const pendingTransaction = await aptos.signAndSubmitTransaction({
  signer: publicKey,
  transaction,
});
    console.log(transaction);
  }

  
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
          <button onClick={()=> createCampaign()}> here </button>
          <button onClick={() => getAptosWallet()} className="font-[500] text-gray-600"> {`${userAddress.slice(0, 3)}...${userAddress.slice(-3)}`}</button>
        </div>
      </div>
    </div>
  );
};

export default Navabar;

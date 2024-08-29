"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { useWallet , WalletName} from "@aptos-labs/wallet-adapter-react";
const Navabar = () => {

  const { connect, disconnect, account, connected } = useWallet();
  const [userAddress, setUserAddress] = React.useState("");
  const [publicKey, setPublicKey] = React.useState("null");
  const getAptosWallet = async () => {
    try {
      
      // Change below to the desired wallet name instead of "Petra"
       await connect("Petra" as WalletName<"Petra">); 
      console.log('Connected to wallet:', account);
    } catch (error) {
      console.error('Failed to connect to wallet:', error);
    }

    console.log("account", account);
  }
  
  const createCampaign = async () => {
  //   const config = new AptosConfig({ network: Network.TESTNET });
  //   const aptos = new Aptos(config);
  //   const modules = await aptos.getAccountModules({ accountAddress: "0xf0c37761c0d644014c98bec8255d5836f13b4120b9059a0dab21a49355dded53" });
  //   console.log(modules);
  //   const transaction = await aptos.transaction.build.simple({
  // sender: "0xf0c37761c0d644014c98bec8255d5836f13b4120b9059a0dab21a49355dded53",
  // data: {
  //   function: "0xf0c37761c0d644014c98bec8255d5836f13b4120b9059a0dab21a49355dded53::stream::create_campaign",
  //   typeArguments: ["0x1::aptios_coin::AptosCoin"],
  //   functionArguments: [10000000]
  // },
  //   });
//     const pendingTransaction = await aptos.signAndSubmitTransaction({
//   signer: publicKey,
//   transaction,
// });
    // console.log(transaction);
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
          <button onClick={getAptosWallet} className="font-[500] text-gray-600"> {`${userAddress.slice(0, 3)}...${userAddress.slice(-3)}`}</button>
        </div>
      </div>
    </div>
  );
};

export default Navabar;

"use client";
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { useState } from "react";

import { Checkbox } from "@/components/ui/checkbox";

const Onboarding = () => {
  const [checkedWallet, setCheckedWallet] = useState("");
  const [step, setStep] = useState(1);
  return (
    <div className="min-h-[calc(100vh-100px)] bg-[#f5f7f7] flex flex-col justify-center items-center">
      <div className="flex flex-col py-[20px] max-w-[500px] gap-y-[30px] justify-center items-center">
        <div className="flex items-center min-w-[80%] gap-x-[15px]">
          <span className="flex items-center justify-center font-[500] text-white rounded-full bg-blue-500 min-w-[30px] min-h-[30px]">
            {step == 1 ? "1" : "✓"}
          </span>
          <span className="w-full h-[1px] border-[1px]"></span>
          <span className="flex items-center justify-center font-[500] text-white rounded-full bg-blue-500 min-w-[30px] min-h-[30px]">
            {step <= 2 ? "2" : "✓"}
          </span>
        </div>
        {step == 1 ? (
          <Card className="w-[450px]">
            <CardHeader>
              <CardTitle>Connect your wallet</CardTitle>
              <CardDescription>
                Select what network and wallet your want to connect below
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-y-[15px]">
              <h1 className="text-[18px] font-[600]">Choose Wallet</h1>
              <div className="grid grid-cols-3 gap-4">
                <div
                  className={`flex flex-col cursor-pointer items-center justify-center gap-y-[5px] p-2 bg-white border border-gray-200 rounded-lg hover:shadow-md ${
                    checkedWallet == "petra" ? "shadow-md" : "shadow-sm"
                  }`}
                  onClick={() => setCheckedWallet("petra")}
                >
                  <img
                    src="/assets/images/petra.png"
                    alt="Petra"
                    className="h-[45px] rounded-[10px]"
                  />
                  <span className="text-gray-800 font-medium">Petra</span>
                </div>
                <div
                  className={`flex flex-col cursor-pointer items-center justify-center gap-y-[5px] p-2 bg-white border border-gray-200 rounded-lg hover:shadow-md ${
                    checkedWallet == "aptos" ? "shadow-md" : "shadow-sm"
                  }`}
                  onClick={() => setCheckedWallet("aptos")}
                >
                  <img
                    src="/assets/images/aptos_wallet.png"
                    alt="Aptos"
                    className="h-[45px] rounded-[10px]"
                  />
                  <span className="text-gray-800 font-medium">Atos Wallet</span>
                </div>
                <div
                  className={`flex flex-col cursor-pointer items-center justify-center gap-y-[5px] p-2 bg-white border border-gray-200 rounded-lg hover:shadow-md ${
                    checkedWallet == "fewcha" ? "shadow-md" : "shadow-sm"
                  }`}
                  onClick={() => setCheckedWallet("fewcha")}
                >
                  <img
                    src="/assets/images/fewcha.png"
                    alt="fewcha"
                    className="h-[45px] rounded-[10px]"
                  />
                  <span className="text-gray-800 font-medium">Fewcha</span>
                </div>
                <div
                  className={`flex flex-col cursor-pointer items-center justify-center gap-y-[5px] p-2 bg-white border border-gray-200 rounded-lg hover:shadow-md ${
                    checkedWallet == "pontem" ? "shadow-md" : "shadow-sm"
                  }`}
                  onClick={() => setCheckedWallet("pontem")}
                >
                  <img
                    src="/assets/images/pontem.png"
                    alt="Pontem"
                    className="h-[45px] rounded-[10px]"
                  />
                  <span className="text-gray-800 font-medium">Pontem</span>
                </div>
                <div
                  className={`flex flex-col cursor-pointer items-center justify-center gap-y-[5px] p-2 bg-white border border-gray-200 rounded-lg hover:shadow-md ${
                    checkedWallet == "rise" ? "shadow-md" : "shadow-sm"
                  }`}
                  onClick={() => setCheckedWallet("rise")}
                >
                  <img
                    src="/assets/images/rise.png"
                    alt="Rise"
                    className="h-[45px] rounded-[10px]"
                  />
                  <span className="text-gray-800 font-medium">Rise</span>
                </div>
                <div
                  className={`flex flex-col cursor-pointer items-center justify-center gap-y-[5px] p-2 bg-white border border-gray-200 rounded-lg hover:shadow-md ${
                    checkedWallet == "martian" ? "shadow-md" : "shadow-sm"
                  }`}
                  onClick={() => setCheckedWallet("martian")}
                >
                  <img
                    src="/assets/images/martian.png"
                    alt="Ledger"
                    className="h-[45px] rounded-[10px]"
                  />
                  <span className="text-gray-800 font-medium">Martian</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <div className="flex flex-col space-[10px] w-full">
                <div className="font-[600] text-[15px] flex flex-col space-y-[5px]">
                  <p>
                    Accept{" "}
                    <span className="text-blue-800">Terms of Services</span> and{" "}
                    <span className="text-blue-800">Privacy Policy</span>
                  </p>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="terms" />
                    <label className="text-[13px]" htmlFor="terms">
                      I read and accept
                    </label>
                  </div>
                </div>
                <div className="flex justify-center w-full">
                  <button
                    className="bg-blue-600 hover:bg-blue-700 w-[200px] text-white font-[600] py-2 rounded-lg w-full mt-4"
                    onClick={() => setStep(2)}
                  >
                    Connect Wallet
                  </button>
                </div>
              </div>
            </CardFooter>
          </Card>
        ) : (
          <Card className="w-[450px]">
            <CardHeader>
              <CardTitle>Connect social media account</CardTitle>
              <CardDescription>
                Connect to manage your accout from this app
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-y-[20px]">
                <div className="flex items-center gap-x-[20px]">
                  <div className="p-[5px] bg-white border border-gray-200 rounded-lg hover:shadow-md">
                    <img
                      src="/assets/images/twitter1.png"
                      alt="Petra"
                      className="h-[45px] rounded-[10px]"
                    />
                  </div>
                  <button className="h-[30px]  text-white bg-blue-500 rounded-full px-[15px] border border-blue-500">
                    Connect
                  </button>
                </div>
                <div className="flex items-center gap-x-[20px]">
                  <div className="p-[5px] bg-white border border-gray-200 rounded-lg hover:shadow-md">
                    <img
                      src="/assets/images/instagram1.png"
                      alt="Instagram"
                      className="h-[45px] rounded-[10px]"
                    />
                  </div>
                  <button className="h-[30px]  text-white bg-blue-500 rounded-full px-[15px] border border-blue-500">
                    Connect
                  </button>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-center">
              <button
                className="bg-blue-600 hover:bg-blue-700 w-[150px] text-white font-[600] py-2 rounded-lg w-full mt-4"
                onClick={() => setStep(3)}
              >
                Next
              </button>
            </CardFooter>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Onboarding;

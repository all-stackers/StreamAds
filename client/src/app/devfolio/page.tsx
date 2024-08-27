"use client";
import Head from "next/head";
import { FaLink, FaTwitter } from "react-icons/fa";
import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface CampaignDetails {
  campaign_id: string;
  campaign_name: string;
  campaign_description: string;
  company_name: string;
  company_logo?: string;
  company_twitter?: string;
  company_website?: string;
  media_url: string;
  start_time: string;
  end_time: string;
  payout_time: string;
  prize_pool: number;
  post: string;
  likes: string;
  minimum_likes?: number;
  followers: string;
  minimum_followers?: number;
  participants?: string[];
}


const devfolio = () => {
  const calculateTimeLeft = (
    endTime: number
  ): { hours: number; minutes: number; seconds: number } => {
    const now = new Date().getTime();
    const distance = endTime - now;

    if (distance < 0) {
      return { hours: 0, minutes: 0, seconds: 0 };
    }

    const hours = Math.floor(
      (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    return { hours, minutes, seconds };
  };

  // Set endTime to 2 days (48 hours) from now
  const [endTime, setEndTime] = useState(
    new Date().getTime() + 1000 * 60 * 60 * 48
  ); // 2 days from now
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(endTime));
  const [campaignDetails, setCampaignDetails] = useState<CampaignDetails | undefined>(undefined);

  const getCampaignDetails = async (): Promise<void> => {
    const requestOptions: RequestInit = {
        method: "GET",
        redirect: "follow"
    };

    try {
        const response = await fetch("http://127.0.0.1:5000/campaign?campaign_id=0001", requestOptions);
        const result = await response.json();
        const parsedResult = JSON.parse(result.data)
        console.log(parsedResult)
        setCampaignDetails(parsedResult)
    } catch (error) {
        console.error(error);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft(endTime));
    }, 1000);

    return () => clearInterval(interval);
  }, [endTime]);

  useEffect(() => {
    getCampaignDetails();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      {
        !campaignDetails ?
          <div className="flex justify-center items-center h-screen">
            <div className="text-2xl font-semibold">Loading...</div>
          </div>
        :
        <main className="max-w-[75%] mx-auto">
          <h2 className="text-xl font-semibold mb-4">
            {campaignDetails?.campaign_name}
          </h2>
          <h2 className="text-xl font-semibold mb-4">
          {campaignDetails?.company_name}
          </h2>

          <div className="flex justify-between mb-8 h-[340px] gap-x-[30px]">
            <Card className="w-[60%]">
                <div className="flex justify-between items-center pr-[20px]">
                  <CardHeader>
                    <CardTitle className="text-[#273339] text-[24px] font-[600]">
                      Campaign Title
                    </CardTitle>
                    <CardDescription>Company name</CardDescription>
                  </CardHeader>
                  <div className="flex space-x-4 ml-3 mt-[-30px]">
                  <a href={campaignDetails?.company_website} target="_blank" rel="noopener noreferrer">
                    <div className="bg-blue-100 text-blue-500 p-2 rounded-full border border-transparent hover:border-blue-700 transition">
                      <FaLink size={15} />
                    </div>
                  </a>

                  <a href={campaignDetails?.company_twitter}  target="_blank" rel="noopener noreferrer">
                    <div className="bg-blue-100 text-blue-500 p-2 rounded-full border border-transparent hover:border-blue-700 transition">
                      <FaTwitter size={15} />
                    </div>
                  </a>
                  </div>
                </div>

                <div className="bg-white-100 border h-20 border-white rounded-lg p-2 flex items-center">
                <div className="border-l-4 border-blue-500 rounded-lg h-full mr-3"></div>
                <div>
                  <div className="text-xs text-gray-400 font-bold mb-1 tracking-wide">
                    RUNS FROM
                  </div>
                  <div className="text-sm font-semibold">Aug 5 - 13, 2022</div>
                </div>
              </div>

                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="rounded-full border-[2px] px-[10px]">
                      <span className="text-[#8e989c] font-[600] text-[12px]">
                        NO RESTRICTION
                      </span>
                    </div>
                    <p className="text-[#0fa38d] text-[16px] font-[500]">
                      + 250 participating
                    </p>
                  </div>
                </CardContent>
                <CardFooter>
                  <div className="flex justify-between w-full">
                    <div className="flex gap-x-[10px]">
                      <div className="bg-[#f5f7f7] rounded-[15px] px-[10px] flex items-center">
                        <p className="text-[#38474e] p-0 m-0 text-[12px] font-[600] tracking-widest">
                          PRIZE 100000 APT
                        </p>
                      </div>
                      <div className="bg-[#f5f7f7] rounded-[15px] px-[10px] flex items-center">
                        <p className="text-[#38474e] p-0 m-0 text-[12px] font-[600] tracking-widest">
                          ENDS 29/08/24
                        </p>
                      </div>
                    </div>

                    <Button className="bg-[#3770ff] hover:bg-[#2368fb] rounded-[10px]">
                      See More
                    </Button>
                  </div>
                </CardFooter>
              </Card>

            <div className="flex w-[40%] bg-yellow-200 rounded-md">
        hii
            </div>

          </div>




          <div className="flex justify-between mb-8 h-auto">
            <div className="flex-1 flex items-stretch w-[70%] h-[290px]">
              <div className="bg-black text-white p-6 rounded-lg flex-grow mr-8 flex justify-center items-center">
                <img
                  src="web3.jpg"
                  alt="ETH Seoul"
                  className="h-full rounded-lg"
                />
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-md w-[30%] flex flex-col justify-between">
              <div className="flex space-x-4 ml-3">
              <a href={campaignDetails?.company_website} target="_blank" rel="noopener noreferrer">
                <div className="bg-blue-100 text-blue-500 p-2 rounded-full border border-transparent hover:border-blue-700 transition">
                  <FaLink size={15} />
                </div>
              </a>

              <a href={campaignDetails?.company_twitter}  target="_blank" rel="noopener noreferrer">
                <div className="bg-blue-100 text-blue-500 p-2 rounded-full border border-transparent hover:border-blue-700 transition">
                  <FaTwitter size={15} />
                </div>
              </a>
              </div>
              <div className="bg-white-100 border h-20 border-white rounded-lg py-3 p-4 flex items-center">
                <div className="border-l-4 border-blue-500 rounded-lg h-full mr-3"></div>
                <div>
                  <div className="text-xs text-gray-400 font-bold mb-1 tracking-wide">
                    RUNS FROM
                  </div>
                  <div className="text-sm font-semibold">Aug 5 - 13, 2022</div>
                </div>
              </div>

              <div className="mt-2 bg-gray-200 border h-20 border-gray-300 rounded-lg p-4">
                <div className="text-xs text-gray-400 font-bold mb-2">
                  APPLICATIONS CLOSES IN
                </div>
                <div className="text-md font-semibold mt-3">
                  {`${timeLeft.hours
                    .toString()
                    .padStart(2, "0")}:${timeLeft.minutes
                    .toString()
                    .padStart(2, "0")}:${timeLeft.seconds
                    .toString()
                    .padStart(2, "0")}`}
                </div>
              </div>

              <div className="mt-4">
                <button className="bg-blue-500 text-white rounded px-4 py-2 w-full">
                  Participate
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md mt-5 mb-5">
            <div className="text-center">
              <h2 className="text-[48px] text-[#273339] font-[800] p-3">
                $ {campaignDetails?.prize_pool}.00
              </h2>
              <h3 className="text-[22px] text-[#8e989c] font-[400]">
                Total Prize Pool
              </h3>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">
              Campaign Description
            </h2>

            <h3 className="font-semibold mt-4 mb-2">
              Join us in {campaignDetails?.campaign_name} campaign
            </h3>

            <h3 className="font-semibold mt-4 mb-2">Tasks:</h3>
            <ul className="list-disc list-inside mb-4">
              {campaignDetails.post == 'yes' && <li>Post about the campaign on Instagram.</li>}
              {campaignDetails.likes == 'yes' && <li>Get minimum {campaignDetails.minimum_likes} on your post.</li>}
            </ul>

            <h3 className="font-semibold mt-4 mb-2">Eligibility:</h3>
            <ul className="list-disc list-inside mb-4">
              <li>Should have an Instagram account</li>
              {campaignDetails.followers && <li>Should have minimum {campaignDetails.minimum_followers} followers.</li>}
            </ul>

          </div>

        </main>
      }
    </div>
  );
};

export default devfolio;

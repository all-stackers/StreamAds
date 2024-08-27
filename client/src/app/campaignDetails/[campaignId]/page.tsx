"use client";
import Head from "next/head";
import { FaLink, FaTwitter } from "react-icons/fa";
import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { ScaleLoader } from "react-spinners";

import { CheckCircleIcon } from "@heroicons/react/24/solid";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { set } from "date-fns";
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

const devfolio = ({ params }: { params: { campaignId: string } }) => {
  const router = useRouter();
  const [steps, setSteps] = useState<number>(0);
  const post = {
    type: "image",
    caption: "This is a sample caption for the post.",
    file: "/web3.jpg",
  };

  const highlightHashtags = (text: string) => {
    const regex = /#\w+/g;
    return text.split(regex).map((part, index) => {
      const match = text.match(regex)?.[index];
      return (
        <React.Fragment key={index}>
          {part}
          {match && <span className="text-blue-500">{match}</span>}
        </React.Fragment>
      );
    });
  };

  const calculateTimeLeft = (
    endTime: number
  ): { days: number; hours: number; minutes: number; seconds: number } => {
    const now = new Date().getTime();
    const distance = endTime - now;

    if (distance < 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    return { days, hours, minutes, seconds };
  };

  const [endTime, setEndTime] = useState(
    new Date().getTime() + 1000 * 60 * 60 * 48
  ); // 2 days from now
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(endTime));
  const [campaignDetails, setCampaignDetails] = useState<
    CampaignDetails | undefined
  >(undefined);

  const getCampaignDetails = async (campaignId: string): Promise<void> => {
    const requestOptions: RequestInit = {
      method: "GET",
      redirect: "follow",
    };

    try {
      const response = await fetch(
        `http://127.0.0.1:5000/campaign?campaign_id=${campaignId}`,
        requestOptions
      );
      const result = await response.json();
      const parsedResult = JSON.parse(result.data);
      console.log(parsedResult);
      setCampaignDetails(parsedResult);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (campaignDetails && campaignDetails.end_time) {
      const endTime = new Date(campaignDetails.end_time).getTime();
      setEndTime(endTime);
    }
  }, [campaignDetails]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft(endTime));
    }, 1000);

    return () => clearInterval(interval);
  }, [endTime]);

  const dialogContent = [
    {
      title: "Preview",
      description: "",
      content: (
        <div className="flex flex-col justify-center items-center mb-[15px]">
          <div className="p-[10px] border-[1px] max-w-[320px] shadow-md rounded-[10px]">
            <div className="flex items-center gap-x-[20px] px-[10px] py-[5px] border-b-[1px]">
              <img className="h-[30px]" src="/assets/images/user.png"></img>
              <p className="font-bold">allstackers</p>
            </div>
            <div className="flex flex-col items-center justify-center bg-gray-200 h-[300px]">
              {post.file && (
                <>
                  {post.type.includes("video") ? (
                    <video
                      className="w-[100%]"
                      src={post.file}
                      autoPlay={true}
                      loop={true}
                    ></video>
                  ) : (
                    <img
                      className="w-[100%] object-cover"
                      src={post.file}
                      alt="Selected"
                    ></img>
                  )}
                </>
              )}
            </div>
            <div className="mt-[10px]">
              <div className="flex gap-x-[10px]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                  />
                </svg>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 0 1-.923 1.785A5.969 5.969 0 0 0 6 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337Z"
                  />
                </svg>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
                  />
                </svg>
              </div>
              <div className="py-[10px]">
                <p>
                  {post.caption.length > 0 ? (
                    highlightHashtags(post.caption)
                  ) : (
                    <em className="font-light">No Caption Added</em>
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      ),
      footer: (
        <div className="flex justify-center w-full gap-x-[10px]">
          <Button
            type="submit"
            className="px-[40px] bg-blue-500 text-[16px] font-[400] hover:bg-blue-600"
            onClick={() => {
              setSteps(1);
            }}
          >
            Next
          </Button>
        </div>
      ),
    },
    {
      title: "",
      description: "",
      content: (
        <div className=" text-green-800 rounded-lg p-8 flex flex-col items-center max-w-[600px] max-h-[400px] w-full h-auto">
          <CheckCircleIcon className="h-16 w-16" />
          <p className="mt-4 text-xl font-semibold">Post Successful!</p>
        </div>
      ),

      footer: "",
    },
  ];

  useEffect(() => {
    if (params.campaignId) {
      getCampaignDetails(params.campaignId);
    }
  }, [params.campaignId]);

  return (
    <div className="min-h-[calc(100vh-100px)] bg-gray-100 p-8">
      {!campaignDetails ? (
        <div className="flex justify-center items-center min-h-[calc(100vh-100px)]">
          <div className="text-2xl font-semibold">
            <ScaleLoader color="#3770ff" />
          </div>
        </div>
      ) : (
        <main className="max-w-[75%] mx-auto">
          <div className="flex justify-between mb-6 h-[360px] gap-x-[30px]">
            <Card className="w-[60%]">
              <div className="flex justify-between items-center pr-[20px] mb-[-15px]">
                <CardHeader>
                  <CardTitle className="text-[#273339] text-[24px] font-[600]">
                    {campaignDetails?.campaign_name}
                  </CardTitle>
                  <CardDescription className="text-[18px]">
                    {campaignDetails?.company_name}
                  </CardDescription>
                </CardHeader>
                <div className="flex space-x-[30px] ml-auto mr-[30px] mt-[-15px]">
                  <a
                    href={campaignDetails?.company_website}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <div className="bg-blue-100 text-blue-500 p-3 rounded-full border border-transparent hover:border-blue-700 transition">
                      <FaLink size={30} />
                    </div>
                  </a>

                  <a
                    href={campaignDetails?.company_twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <div className="bg-blue-100 text-blue-500 p-3 rounded-full border border-transparent hover:border-blue-700 transition">
                      <FaTwitter size={30} />
                    </div>
                  </a>
                </div>
              </div>

              <div className="bg-white-100 border h-20 border-white rounded-lg p-2 flex items-center ml-[16px]">
                <div className="border-l-4 border-blue-500 rounded-lg h-full mr-3"></div>
                <div>
                  <div className="text-xs text-gray-400 font-bold mb-1 tracking-wide">
                    RUNS FROM
                  </div>
                  <div className="text-sm font-semibold">
                    {format(
                      new Date(campaignDetails.start_time),
                      "MMM d, yyyy"
                    )}{" "}
                    -{" "}
                    {format(
                      new Date(campaignDetails.payout_time),
                      "MMM d, yyyy"
                    )}
                  </div>
                </div>

                <p className="text-[#0fa38d] text-[16px] font-[500] ml-auto mr-[40px]">
                  250+ participating
                </p>
              </div>

              <div className="mt-2 bg-gray-100 border w-[60%] ml-[25px] h-20 border-gray-200 rounded-lg p-4 mb-[25px]">
                <div className="text-xs text-gray-400 font-bold mb-2">
                  APPLICATIONS CLOSES IN
                </div>
                <div className="text-md font-semibold mt-3">
                  {`${timeLeft.days}d ${timeLeft.hours}h ${timeLeft.minutes}m ${timeLeft.seconds}s left`}
                </div>
              </div>

              <CardFooter>
                <div className="flex justify-between w-full">
                  <div className="flex gap-x-[10px]">
                    <div className="bg-[#f5f7f7] rounded-[15px] px-[10px] flex items-center">
                      <p className="text-[#38474e] p-0 m-0 text-[12px] font-[600] tracking-widest">
                        PAYOUT :{" "}
                        {format(
                          new Date(campaignDetails.payout_time),
                          "MMM d, yyyy, hh:mm a"
                        )}
                      </p>
                    </div>
                  </div>

                  <Button className="bg-[#3770ff] hover:bg-[#2368fb] rounded-[10px] mr-[10px] px-[40px] font-bold text-[16px]">
                    Participate
                  </Button>
                </div>
              </CardFooter>
            </Card>

            <div className="flex w-[40%] bg-black rounded-[10px] justify-center items-center">
              <img
                src={campaignDetails.media_url}
                alt="ETH Seoul"
                className="h-full rounded-lg"
              />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md mt-5 mb-5">
            <div className="text-center">
              <h2 className="text-[48px] text-[#273339] font-[800] p-2">
                $ {campaignDetails?.prize_pool}.00
              </h2>
              <h3 className="text-[22px] text-[#8e989c] font-[400]">
                Total Prize Pool
              </h3>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">
              {" "}
              📣 Campaign Description
            </h2>

            <div className="h-[2px] bg-gray-100"></div>

            <h3 className="font-semibold mt-4 mb-2">
              Join us in {campaignDetails?.campaign_name} campaign
            </h3>

            <h4>{campaignDetails.campaign_description}</h4>

            <h3 className="font-semibold mt-4 mb-2">Tasks:</h3>
            <ul className="list-disc list-inside mb-4">
              {campaignDetails.post == "yes" && (
                <li>Post about the campaign on Instagram.</li>
              )}
              {campaignDetails.likes == "yes" && (
                <li>
                  Get minimum {campaignDetails.minimum_likes} likes on your post.
                </li>
              )}
            </ul>

            <h3 className="font-semibold mt-4 mb-2">Eligibility:</h3>
            <ul className="list-disc list-inside mb-4">
              <li>Should have an Instagram account</li>
              {campaignDetails.followers && (
                <li>
                  Should have minimum {campaignDetails.minimum_followers}{" "}
                  followers.
                </li>
              )}
            </ul>
            <div className="flex flex-row items-center justify-center">
              <Button className="bg-[#3770ff] hover:bg-[#2368fb] rounded-[10px] px-[40px] font-bold text-[16px]">
                Participate
              </Button>
            </div>
          </div>
        </main>
      )}
    </div>
  );
};

export default devfolio;

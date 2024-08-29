"use client";
import React, { useState, useEffect, use } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
  
const data = [
{
    wallet_address: "0x1234567890",
    instagram_id: "allstackers",
    post_id: "82712627129",
    likes: "1",
},
{
    wallet_address: "0x123948392",
    instagram_id: "johndoe",
    post_id: "236939221",
    likes: "2",
}
]
  
  export function TableDemo() {
    return (
      <Table>
        {/* <TableCaption>A list of your recent invoices.</TableCaption> */}
        <TableHeader>
          <TableRow>
            <TableHead className="w-[200px]">Wallet Address</TableHead>
            <TableHead>Instagram Id</TableHead>
            <TableHead>Post ID</TableHead>
            <TableHead className="text-right">Likes</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((d) => (
            <TableRow key={d.wallet_address}>
              <TableCell className="font-medium">{d.wallet_address}</TableCell>
              <TableCell>{d.instagram_id}</TableCell>
              <TableCell>{d.post_id}</TableCell>
              <TableCell className="text-right">{d.likes}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    )
  }

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
    media_type: string;
    caption: string;
}
  

const Participants = ({ params }: { params: { campaignId: string } }) => {
    const [campaignDetails, setCampaignDetails] = useState<CampaignDetails | undefined>(undefined);

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

    console.log(campaignDetails);

    useEffect(() => {
        getCampaignDetails(params.campaignId);
    }, []);

    return (
        <div className="flex flex-col w-[100%] justify-center items-center">
            <span>Campaign Participants</span>
            <div className="w-[70%] mt-[50px]">
            <TableDemo />
            </div>
        </div>
    )
}

export default Participants;
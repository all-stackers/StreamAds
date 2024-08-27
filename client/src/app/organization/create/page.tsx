"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FileUploader } from "react-drag-drop-files";
import { useToast } from "@/components/ui/use-toast";

import { addDays, format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

const hashtags = ["#hash1", "#hash2", "#hash3", "#hash4"];
const Create = () => {
  const { toast } = useToast();

  const [file, setFile] = useState<any>(null);
  const [campaignName, setCampaignName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [caption, setCaption] = useState<string>("");
  const [steps, setSteps] = useState<number>(0);
  const [campaignDate, setCampaignDate] = React.useState<Date>();
  const [payoutDate, setPayoutDate] = React.useState<Date>();
  const [prizePool, setPrizePool] = React.useState<number>();
  const [likes, setLikes] = React.useState<boolean>(false);
  const [likesCount, setLikesCount] = React.useState<number>(0);
  const [followers, setFollowers] = React.useState<boolean>(false);
  const [followersCount, setFollowersCount] = React.useState<number>(0);

  const handleChange = (uploadedFile: any) => {
    if (uploadedFile) {
      setFile(uploadedFile);
    }
  };
  const handleAddHashtag = () => {
    let captions = caption;
    captions += hashtags.join(" ");
    setCaption(captions);
  };

  const highlightHashtags = (text: string) => {
    // Regex to match hashtags
    const regex = /#\w+/g;
    // Replace hashtags with styled span
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

  const handleFinish = () => {
    console.log({
      file,
      campaignName,
      description,
      caption,
      campaignDate,
      payoutDate,
      prizePool,
      likes,
      likesCount,
      followers,
      followersCount,
    });
  };

  const dialogContent = [
    {
      title: (
        <h1 className="text-[#273339] text-[36px] font-[800]">
          Let's get you started
        </h1>
      ),
      description: "Input Campaign name. Click next when you're done.",
      content: (
        <div className="flex flex-col my-4 gap-y-4">
          <div className="flex flex-col gap-y-2">
            <Label htmlFor="name" className="text-[#5c686d] text-[12px]">
              CAMPAIGN NAME
            </Label>
            <Input
              id="name"
              value={campaignName}
              onChange={(e) => setCampaignName(e.target.value)}
              placeholder="What are you calling this campaign?"
            />
          </div>
          <div className="flex flex-col gap-y-2">
            <Label htmlFor="description" className="text-[#5c686d] text-[12px]">
              DESCRIPTION
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your campaign in a few words"
            />
          </div>
        </div>
      ),
      footer: (
        <Button
          type="submit"
          className="px-[40px]"
          onClick={() => {
            if (campaignName) {
              setSteps(1);
            } else {
              toast({
                variant: "destructive",
                description: "Campaign Name required.",
              });
            }
          }}
        >
          Begin
        </Button>
      ),
    },
    {
      title: (
        <h1 className="text-[#273339] text-[36px] font-[800]">Add your post</h1>
      ),
      description:
        "Add media and caption for the post. Boost engagement with strategic hashtags! 📸✨",
      content: (
        <div className="flex flex-col my-4 gap-y-[25px]">
          <FileUploader
            handleChange={handleChange}
            name="file"
            types={["JPG", "PNG", "MP4", "MOV", "GIF"]}
            multiple={false}
            label="Upload or drop a photo / videos right here"
          />
          {file && (
            <div className="flex flex-col items-start p-2 bg-gray-100 border-[1px] rounded-lg shadow-sm">
              <div className="flex items-center space-x-2">
                <h1 className="text-sm">{file.name}</h1>
              </div>
            </div>
          )}
          <div className="flex flex-col gap-y-[10px]">
            <div className="flex justify-between items-end">
              <Label htmlFor="caption" className="text-[#5c686d] text-[12px]">
                CAPTION
              </Label>
              <button
                className="text-[12px] rounded-full font-[400] bg-red-100 rounded-[5px] border-[1px] border-red-400 px-2 py-[2px]"
                onClick={handleAddHashtag}
              >
                Generate hashtags
              </button>
            </div>

            <Textarea
              id="caption"
              value={caption}
              onChange={(e) => {
                setCaption(e.target.value);
              }}
              placeholder="Write a caption for your post"
            />
          </div>
        </div>
      ),
      footer: (
        <div className="flex justify-between w-full gap-x-[10px] mt-[30px]">
          <Button
            type="submit"
            className="px-[40px] bg-white text-black border-[1px] border-gray-500 text-[16px] font-[400] hover:bg-gray-900 hover:text-white"
            onClick={() => setSteps(0)}
          >
            Back
          </Button>
          <Button
            type="submit"
            className="px-[40px] bg-blue-500 text-[16px] font-[400] hover:bg-blue-600"
            onClick={() => {
              if (file) {
                setSteps(2);
              } else {
                toast({
                  variant: "destructive",
                  description: "Photo or Video is required for post.",
                });
              }
            }}
          >
            Preview
          </Button>
        </div>
      ),
    },
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
              {file && (
                <>
                  {file.type.includes("video") ? (
                    <video
                      className="w-[100%]"
                      src={URL.createObjectURL(file)}
                      autoPlay={true}
                      loop={true}
                    ></video>
                  ) : (
                    <img
                      className="w-[100%] object-cover"
                      src={URL.createObjectURL(file)}
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
                  {caption.length > 0 ? (
                    highlightHashtags(caption)
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
        <div className="flex justify-between w-full gap-x-[10px]">
          <Button
            type="submit"
            className="px-[40px] bg-white text-black border-[1px] border-gray-500 text-[16px] font-[400] hover:bg-gray-600 hover:text-white"
            onClick={() => setSteps(1)}
          >
            Back
          </Button>
          <Button
            type="submit"
            className="px-[40px] bg-blue-500 text-[16px] font-[400] hover:bg-blue-600"
            onClick={() => setSteps(3)}
          >
            Next
          </Button>
        </div>
      ),
    },
    {
      title: (
        <h1 className="text-[#273339] text-[36px] font-[800]">
          Campaign Details.
        </h1>
      ),
      description: "Add details about this campaign.",
      content: (
        <div className="flex flex-col my-4 gap-y-4">
          <div className="flex flex-col gap-y-2">
            <Label htmlFor="endTime" className="text-[#5c686d] text-[12px]">
              When will this campaign end?
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-[280px] justify-start text-left font-normal",
                    !campaignDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {campaignDate ? (
                    format(campaignDate, "PPP")
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="flex w-auto flex-col space-y-2 p-2">
                <Select
                  onValueChange={(value) =>
                    setCampaignDate(addDays(new Date(), parseInt(value)))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent position="popper">
                    <SelectItem value="0">Today</SelectItem>
                    <SelectItem value="1">Tomorrow</SelectItem>
                    <SelectItem value="3">In 3 days</SelectItem>
                    <SelectItem value="7">In a week</SelectItem>
                  </SelectContent>
                </Select>
                <div className="rounded-md border">
                  <Calendar
                    mode="single"
                    selected={campaignDate}
                    onSelect={setCampaignDate}
                  />
                </div>
              </PopoverContent>
            </Popover>
          </div>
          <div className="flex flex-col gap-y-2">
            <Label htmlFor="endTime" className="text-[#5c686d] text-[12px]">
              When is the payout date?
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-[280px] justify-start text-left font-normal",
                    !payoutDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {payoutDate ? (
                    format(payoutDate, "PPP")
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="flex w-auto flex-col space-y-2 p-2">
                <Select
                  onValueChange={(value) =>
                    setPayoutDate(addDays(new Date(), parseInt(value)))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent position="popper">
                    <SelectItem value="0">Today</SelectItem>
                    <SelectItem value="1">Tomorrow</SelectItem>
                    <SelectItem value="3">In 3 days</SelectItem>
                    <SelectItem value="7">In a week</SelectItem>
                  </SelectContent>
                </Select>
                <div className="rounded-md border">
                  <Calendar
                    mode="single"
                    selected={payoutDate}
                    onSelect={setPayoutDate}
                  />
                </div>
              </PopoverContent>
            </Popover>
          </div>
          <div className="flex flex-col gap-y-2">
            <Label htmlFor="description" className="text-[#5c686d] text-[12px]">
              Pool Size (APT)
            </Label>
            <div className="flex items-center gap-x-[10px]">
              <Input
                id="poolSize"
                type="number"
                placeholder="Enter the prize pool"
                value={prizePool}
                onChange={(e) => setPrizePool(parseInt(e.target.value))}
              />
              <img
                className="rounded-full h-[35px]"
                src="/assets/images/aptos.png"
              />
            </div>
          </div>
        </div>
      ),
      footer: (
        <div className="flex mt-[30px] justify-between w-full gap-x-[10px] mt-[30px]">
          <Button
            type="submit"
            className="px-[40px] bg-white text-black border-[1px] border-gray-500 text-[16px] font-[400] hover:bg-gray-900 hover:text-white"
            onClick={() => setSteps(2)}
          >
            Back
          </Button>
          <Button
            type="submit"
            className="px-[40px] bg-blue-500 text-[16px] font-[400] hover:bg-blue-600"
            onClick={() => {
              if (campaignDate && payoutDate && campaignDate < payoutDate) {
                if (prizePool && prizePool > 0) {
                  setSteps(4);
                } else {
                  toast({
                    variant: "destructive",
                    description: "Prize pool must be greater than 0",
                  });
                }
              } else {
                toast({
                  variant: "destructive",
                  description: "Payout date or campaign date is invalid",
                });
              }
            }}
          >
            Next
          </Button>
        </div>
      ),
    },
    {
      title: (
        <h1 className="text-[#273339] text-[36px] font-[800]">
          Campaign Details.
        </h1>
      ),
      description: "Add details about this campaign.",
      content: (
        <div className="flex flex-col mt-2 gap-y-4">
          <div className="flex flex-col gap-y-4">
            <Label htmlFor="endTime" className="text-[#273339] text-[14px]">
              What is the campaign payout criteria?
            </Label>
            <div className="flex items-center space-x-2">
              <Switch
                id="likes"
                onCheckedChange={(e) => {
                  setLikes(e);
                  console.log(likes);
                }}
              />
              <Label htmlFor="likes">Likes</Label>
            </div>
            {likes && (
              <div className="flex flex-col gap-y-[5px]">
                <Label
                  htmlFor="likesCount"
                  className="text-[#5c686d] text-[12px]"
                >
                  Minimum number of likes required for payout
                </Label>
                <Input
                  id="likesCount"
                  type="number"
                  value={likesCount}
                  onChange={(e) => setLikesCount(parseInt(e.target.value))}
                />
              </div>
            )}
            <div className="flex items-center space-x-2">
              <Switch id="followers" onCheckedChange={(e) => setFollowers(e)} />
              <Label htmlFor="followers">Followers</Label>
            </div>
            {followers && (
              <div className="flex flex-col gap-y-[5px]">
                <Label
                  htmlFor="followersCount"
                  className="text-[#5c686d] text-[12px]"
                >
                  Minimum followers required to participate
                </Label>
                <Input
                  id="followersCount"
                  type="number"
                  value={followersCount}
                  onChange={(e) => setFollowersCount(parseInt(e.target.value))}
                />
              </div>
            )}
          </div>
        </div>
      ),
      footer: (
        <div className="flex justify-between w-full gap-x-[10px] mt-[30px]">
          <Button
            type="submit"
            className="px-[40px] bg-white text-black border-[1px] border-gray-500 text-[16px] font-[400] hover:bg-gray-900 hover:text-white"
            onClick={() => setSteps(3)}
          >
            Back
          </Button>
          <Button
            type="submit"
            className="px-[40px] bg-blue-500 text-[16px] font-[400] hover:bg-blue-600"
            onClick={handleFinish}
          >
            Finish
          </Button>
        </div>
      ),
    },
  ];

  return (
    <Dialog>
      <div className="flex flex-col justify-center items-center bg-[#f0f5f5] min-h-[calc(100vh-100px)]">
        <div className="flex flex-col justify-center items-center max-w-[600px]">
          <h1 className="font-[800] text-[#273339] text-[48px] leading-[55px]">
            Create a campaign!
          </h1>
          <p className="mt-[25px] text-center text-[20px] text-[#5c686d] leading-[30px] font-[400]">
            The only thing that can match the thrill of attending a hackathon is
            the exhilaration of organizing one yourself! Join 100s of other
            hackathons on Devfolio and manage your applications, submissions,
            comms, reimbursements, and judging, all on our platform.
          </p>
          <DialogTrigger asChild>
            <button className="mt-[40px] bg-[#5768FF] text-white font-[500] text-[24px] py-[10px] px-[40px] rounded-[5px]">
              Create your campaign on StreamAd
            </button>
          </DialogTrigger>
        </div>
      </div>
      <DialogContent className="max-w-[576px] w-fit max-h-[90vh] scrollbar-hide overflow-y-auto p-[64px] py-[48px]">
        <DialogHeader>
          <DialogTitle>{dialogContent[steps].title}</DialogTitle>
          <DialogDescription>
            {dialogContent[steps].description}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">{dialogContent[steps].content}</div>
        <DialogFooter>{dialogContent[steps].footer}</DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default Create;

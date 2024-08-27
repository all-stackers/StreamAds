
"use client";
import Head from 'next/head';
import { FaLink, FaTwitter } from 'react-icons/fa';
import React, { useState, useEffect } from 'react';


 
const devfolio = () => {
  const calculateTimeLeft = (endTime: number): { hours: number; minutes: number; seconds: number } => {
    const now = new Date().getTime();
    const distance = endTime - now;

    if (distance < 0) {
      return { hours: 0, minutes: 0, seconds: 0 };
    }

    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    return { hours, minutes, seconds };
  };

  // Set endTime to 2 days (48 hours) from now
  const [endTime, setEndTime] = useState(new Date().getTime() + 1000 * 60 * 60 * 48); // 2 days from now
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(endTime));

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft(endTime));
    }, 1000);

    return () => clearInterval(interval);
  }, [endTime]);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      {/* <Head>
        <title>ETH Seoul 2022 Hackathon</title>
        <link rel="icon" href="/favicon.ico" />
      </Head> */}

      <main className="max-w-4xl mx-auto">
      <div className="flex justify-between mb-8 h-auto">
  <div className="flex-1 flex items-stretch">
    <div className="bg-black text-white p-6 rounded-lg flex-grow mr-3 max-w-[600px] h-[250px]">
      <img src="web3.jpg" alt="ETH Seoul" className="w-full h-full object-cover rounded-lg" />
    </div>

    {/* Uncomment this section if needed */}
    {/* <div className="bg-black text-white mr-3 p-6 rounded-lg flex-grow w-[500px]">
     
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-4xl font-bold">ETH Seoul</h1>
          <div className="flex items-center">
            <span className="text-2xl mr-2">2022 Hackathon //</span>
            <span className="text-yellow-400">August 5-7 IRL</span>
          </div>
          <div className="text-yellow-400">August 8-13 Virtual</div>
        </div>
        <div className="text-6xl">🌺</div>
      </div>
      <div className="mt-4 text-sm">
        Brought To You By
        <div className="text-white rounded px-2 py-1 inline-block mt-1">
          krypto.seoul
        </div>
      </div>
    </div> */}
   
  </div>

  <div className="bg-white p-4 rounded-lg shadow-md w-64 flex flex-col justify-between">
    <div className="flex space-x-4 ml-3">
      <div className="bg-blue-100 text-blue-500 p-2 rounded-full border border-transparent hover:border-blue-700 transition">
        <FaLink size={15} />
      </div>
      <div className="bg-blue-100 text-blue-500 p-2 rounded-full border border-transparent hover:border-blue-700 transition">
        <FaTwitter size={15} />
      </div>
    </div>
    <div className="bg-white-100 border h-20 border-white rounded-lg py-3 p-4 flex items-center">
      <div className="border-l-4 border-blue-500 rounded-lg h-full mr-3"></div>
      <div>
        <div className="text-xs text-gray-400 font-bold mb-1 tracking-wide">RUNS FROM</div>
        <div className="text-sm font-semibold">Aug 5 - 13, 2022</div>
      </div>
    </div>

    <div className="mt-2 bg-gray-200 border h-20 border-gray-300 rounded-lg p-4">
      <div className="text-xs text-gray-400 font-bold mb-2">
        APPLICATIONS CLOSES IN
      </div>
      <div className="text-md font-semibold mt-3">
        {`${timeLeft.hours.toString().padStart(2, '0')}:${timeLeft.minutes.toString().padStart(2, '0')}:${timeLeft.seconds.toString().padStart(2, '0')}`}
      </div>
    </div>
    
    <div className='mt-4'>
      <button className="bg-blue-500 text-white rounded px-4 py-2 w-full">
        See projects
      </button>
    </div>
  </div>
</div>


        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">
            Join us for ETH Seoul August 5-7 IRL & 8-13 Virtually!
          </h2>

          <h3 className="font-semibold mt-4 mb-2">ETHSeoul Hackathon Pre-registration</h3>
          <ul className="list-disc list-inside mb-4">
            <li>Please note that every hackathon participant should register via Devfolio. This registration is different with the conference ticket.</li>
          </ul>

          <h3 className="font-semibold mt-4 mb-2">Hackathon Day 1</h3>
          <ul className="list-disc list-inside mb-4">
            <li>Venue: Maru 180, 180 Yeoksam-ro, Gangnam-gu, Seoul</li>
            <li>Date: 2022/08/05 18:00 KST</li>
            <li>Schedule:
              <ul className="list-disc list-inside ml-4">
                <li>18:00 - 19:00: Registration</li>
                <li>19:00 - 19:15: Opening Ceremony</li>
                <li>19:15 - 19:45: Ice-breaking & networking</li>
                <li>20:00 - 20:30: 1 min lightning talks</li>
                <li>20:30 - 21:00: Team formation</li>
              </ul>
            </li>
          </ul>

        </div>
        <div className='bg-white p-6 rounded-lg shadow-md mt-5 '>
          <div className="text-center">
            <h2 className="text-[48px] text-[#273339] font-[800] p-3">
              $ 123,234.45
            </h2>
            <h3 className="text-[22px] text-[#8e989c] font-[400]">
              Available Prizes
            </h3>
          </div>

        </div>

      </main>

    </div>
  )
}

export default devfolio
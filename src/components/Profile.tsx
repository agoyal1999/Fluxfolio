"use client";
import React from "react";
import { useAccount, useBalance, useReadContract } from "wagmi";
import { formatUnits } from "viem";
import { middleEllipsis } from "@/src/lib/utils";
import { CardBody, CardContainer, CardItem } from "./ui/3d-card";
import { useMemo, useState, useEffect } from "react";
import { abi as ERC20_ABI } from "@/src/lib/abi"; // Import the ABI for ERC20 tokens
import { SendTransaction } from "./Transaction";
import Link from "next/link";

export default function Profile() {
  const { address, chain, isDisconnected } = useAccount();
  const { data: ethBalance } = useBalance({ address });

  // State to hold balance data
  const [usdcBalance, setUsdcBalance] = useState<bigint | undefined>(undefined);
  const [usdtBalance, setUsdtBalance] = useState<bigint | undefined>(undefined);

  // Fetch USDC balance
  const usdcContractRead = useReadContract({
    abi: ERC20_ABI,
    address: process.env.NEXT_PUBLIC_USDC_ADDRESS as `0x${string}`,
    functionName: "balanceOf",
    args: address ? [address as `0x${string}`] : undefined,
  });

  // Fetch USDT balance
  const usdtContractRead = useReadContract({
    abi: ERC20_ABI,
    address: process.env.NEXT_PUBLIC_USDT_ADDRESS as `0x${string}`,
    functionName: "balanceOf",
    args: address ? [address as `0x${string}`] : undefined,
  });

  // Update state when balances are fetched
  useEffect(() => {
    if (usdcContractRead.data !== undefined) {
      setUsdcBalance(usdcContractRead.data);
    }
    if (isDisconnected) {
      setUsdcBalance(undefined);
    }
  }, [usdcContractRead.data, isDisconnected]);

  useEffect(() => {
    if (usdtContractRead.data !== undefined) {
      setUsdtBalance(usdtContractRead.data);
    }
    if (isDisconnected) {
      setUsdtBalance(undefined);
    }
  }, [usdtContractRead.data, isDisconnected]);

  const cardData = useMemo(
    () => [
      {
        title: "Wallet address",
        content: middleEllipsis(address as string, 12) || "",
      },
      {
        title: "Network",
        content: chain?.name || "",
      },
      {
        title: "ETH Balance",
        content: ethBalance
          ? `${Number(
              formatUnits(ethBalance.value, ethBalance.decimals)
            ).toFixed(4)} ETH`
          : "—",
      },
      {
        title: "USDC Balance",
        content:
          usdcBalance !== undefined
            ? `${Number(formatUnits(usdcBalance, 6)).toFixed(4)} USDC`
            : "—",
      },
      {
        title: "USDT Balance",
        content:
          usdtBalance !== undefined
            ? `${Number(formatUnits(usdtBalance, 6)).toFixed(4)} USDT`
            : "—",
      },
    ],
    [address, chain, ethBalance, usdcBalance, usdtBalance, isDisconnected]
  );

  return (
    <React.Fragment>
      <div className="flex flex-col lg:flex-row lg:items-start gap-6 lg:max-w-5xl w-full">
        {/* Cards Section */}
        <div className="flex-1">
          {cardData.map((item, index) => (
            <CardContainer key={index} className="inter-var w-[100%]">
              <CardBody className="bg-gray-50 relative group/card dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] sm:w-[100%] h-auto rounded-xl p-6 border">
                <CardItem
                  translateZ="50"
                  className="text-xl font-bold text-neutral-600 dark:text-white"
                >
                  {item.title}
                </CardItem>
                <CardItem
                  as="p"
                  translateZ="60"
                  className="text-neutral-500 text-sm max-w-sm mt-2 dark:text-neutral-300"
                >
                  {item.content}
                </CardItem>
              </CardBody>
            </CardContainer>
          ))}
        </div>

        {/* Transaction Box */}
        <div className="flex-1">
          {address && <SendTransaction address={address as string} />}
        </div>
      </div>
    </React.Fragment>
  );
}

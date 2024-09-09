// pages/TokenInfo.tsx
"use client";
import React from "react";
import { useAccount } from "wagmi";
import { useRouter } from "next/navigation";

const TOKENS = [
  {
    name: "USDC",
    symbol: "USDC",
    decimals: 6,
    address: process.env.NEXT_PUBLIC_USDC_ADDRESS as `0x${string}`,
  },
  {
    name: "USDT",
    symbol: "USDT",
    decimals: 6,
    address: process.env.NEXT_PUBLIC_USDT_ADDRESS as `0x${string}`,
  },
];

export default function TokenInfo() {
  const { address, isDisconnected } = useAccount();
  const router = useRouter();

  const handleAddToken = async (token: {
    name: string;
    symbol: string;
    decimals: number;
    address: string;
  }) => {
    if (!window.ethereum) {
      alert("MetaMask is not installed");
      return;
    }

    try {
      await window.ethereum.request({
        method: "wallet_watchAsset",
        params: {
          type: "ERC20",
          options: {
            address: token.address,
            symbol: token.symbol,
            decimals: token.decimals,
          },
        },
      });
      alert(`${token.name} has been added to your wallet!`);
    } catch (error) {
      console.error("Failed to add token to wallet", error);
      alert("Failed to add token to wallet. Please try again.");
    }
  };

  if (isDisconnected) {
    return <p>Please connect your wallet to view token information.</p>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Token Information</h1>
      <button
        className="text-blue-500 underline mb-4"
        onClick={() => router.back()}
      >
        Back to Profile
      </button>
      <div className="grid gap-6">
        {TOKENS.map((token, index) => (
          <div
            key={index}
            className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg shadow"
          >
            <h2 className="text-xl font-semibold">{token.name}</h2>
            <p>Symbol: {token.symbol}</p>
            <p>Decimals: {token.decimals}</p>
            <p>
              Contract Address:{" "}
              <span className="text-blue-500">{token.address}</span>
            </p>
            <button
              className="mt-2 bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600"
              onClick={() => handleAddToken(token)}
            >
              Add {token.symbol} to Wallet
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

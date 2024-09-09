"use client";

import { ConnectBtn } from "@/src/components/ConnectButton";
import Profile from "@/src/components/Profile";
import { useAccount } from "wagmi";

export default function Home() {
  const { isConnected } = useAccount();

  return (
    <main className="flex min-h-screen flex-col items-center gap-5 p-[20px] py-10">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <ConnectBtn />
      </div>
      {isConnected && <Profile />}
    </main>
  );
}

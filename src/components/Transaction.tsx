"use client";
import * as React from "react";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { parseUnits } from "viem"; // For parsing token amounts
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { cn } from "@/src/lib/utils";
import { config } from "@/src/lib/config";

import { USDC_ADDRESS, USDT_ADDRESS } from "./Profile";
import { abi } from "../lib/abi";

export function SendTransaction({ address }: { address: string }) {
  const [started, setStarted] = React.useState(false);
  const [errors, setErrors] = React.useState<string | null>(null);
  const [completed, setCompleted] = React.useState(false);
  const [transactionHash, setTransactionHash] = React.useState<string | null>(
    null
  );
  const [selectedToken, setSelectedToken] =
    React.useState<string>(USDC_ADDRESS); // Default token address
  const [tokenOptions, setTokenOptions] = React.useState([
    { address: USDC_ADDRESS, symbol: "USDC" },
    { address: USDT_ADDRESS, symbol: "USDT" },
  ]);

  const { writeContractAsync } = useWriteContract();

  // const { isLoading, isSuccess, isError, error } = useWaitForTransactionReceipt(
  //   {
  //     hash: transactionHash || "",
  //     config,
  //   }
  // );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const to = formData.get("recipientAddress") as string;
    const amount = formData.get("amount");

    try {
      setStarted(true);
      setErrors(null);
      const amountInUnits = parseUnits(amount as string, 6);

      const tx = await writeContractAsync({
        address: selectedToken as `0x${string}`,
        functionName: "transferFrom",
        abi: abi,
        args: [address as `0x${string}`, to as `0x${string}`, amountInUnits],
      });

      console.log(tx);

      setStarted(false);
      setCompleted(true);
    } catch (err) {
      console.error("Transaction failed:", err);
      setStarted(false);
      setErrors(
        "Transaction Failed, Please make sure all the details are correct."
      );
    }
  };

  return (
    <div className="max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-white dark:bg-black">
      <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200">
        Make A Transaction
      </h2>
      <form className="my-8" onSubmit={handleSubmit}>
        <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-4">
          <LabelInputContainer>
            <Label htmlFor="recipientAddress">To</Label>
            <Input
              id="recipientAddress"
              name="recipientAddress"
              placeholder="0x..."
              type="text"
              required
            />
          </LabelInputContainer>
          <LabelInputContainer>
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              name="amount"
              placeholder="0.05"
              type="text"
              required
            />
          </LabelInputContainer>
          <LabelInputContainer>
            <Label htmlFor="tokenSelect">Token</Label>
            <select
              id="tokenSelect"
              name="tokenSelect"
              value={selectedToken}
              onChange={(e) => setSelectedToken(e.target.value)}
              style={{ color: "#000" }}
              required
            >
              {tokenOptions.map((token) => (
                <option key={token.address} value={token.address}>
                  {token.symbol}
                </option>
              ))}
            </select>
          </LabelInputContainer>
        </div>
        <div className="flex flex-col space-y-4">
          <button
            className="relative group/btn flex space-x-2 items-center justify-start px-4 w-full text-white rounded-md h-10 font-medium shadow-input bg-gray-50 dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_var(--neutral-800)]"
            type="submit"
            disabled={started}
          >
            {started ? "Confirming..." : "Send"}
          </button>
        </div>
      </form>
      {/* {transactionHash && (
        <div>
          Transaction Hash:{" "}
          <a
            href={`https://etherscan.io/tx/${transactionHash}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {transactionHash}
          </a>
        </div>
      )}
      {isLoading && <div>Waiting for confirmation...</div>}
      {isSuccess && <div>Transaction confirmed.</div>}
      {isError && <div>Error: {error?.message}</div>} */}
      {errors && <div>Error: {errors}</div>}
    </div>
  );
}

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex flex-col space-y-2 w-full", className)}>
      {children}
    </div>
  );
};

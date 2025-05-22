"use client";
import { useEffect, useState } from "react";
import { NextPage } from "next";
import { useAccount, useReadContract, useWriteContract } from "wagmi";
import { IS_THIS_COIN_DEAD_CONTRACT } from "@/constants";
import { hashMessage, parseAbi, parseEther } from "viem";
import { ToastContainer, toast } from "react-toastify";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import Image from "next/image";

interface CoinInfoPageProps {
  name: string;
  symbol: string;
  description: string;
  logo: string;
  slug: string;
}

const CoinInfoPage: NextPage<CoinInfoPageProps> = ({
  name,
  symbol,
  description,
  logo,
  slug,
}: CoinInfoPageProps) => {
  const coinHash = hashMessage(slug);

  const { isConnected } = useAccount();
  const { openConnectModal } = useConnectModal();

  const { writeContractAsync, isError, error } = useWriteContract();
  const { data } = useReadContract({
    address: IS_THIS_COIN_DEAD_CONTRACT,
    abi: parseAbi([
      "function isThisCoinDead(bytes32 _coin) external view returns (uint256, uint256)",
    ]),
    functionName: "isThisCoinDead",
    args: [coinHash],
  });

  const [votesDead, votesAlive] = data
    ? [Number(data[0] || 0n), Number(data[1] || 0n)]
    : [0, 0];
  const [isVoting, setIsVoting] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);

  useEffect(() => {
    if (isError) {
      toast.error(`Error: ${error?.message}`, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        pauseOnHover: true,
        draggable: true,
      });
      setIsVoting(false);
    }
  }, [isError, error]);

  const deadRate =
    votesAlive + votesDead == 0
      ? 0
      : Math.round((votesDead / (votesAlive + votesDead)) * 100);

  const handleVote = async (isAlive: boolean) => {
    if (!isConnected && openConnectModal) {
      openConnectModal();
      return;
    }
    setIsVoting(true);
    if (isAlive) {
      const hash = await writeContractAsync({
        address: IS_THIS_COIN_DEAD_CONTRACT,
        abi: parseAbi(["function voteAlive(bytes32 _coin) external payable"]),
        functionName: "voteAlive",
        value: parseEther("0.0001"),
        args: [coinHash],
      });
      toast.success(
        `Vote casted successfully! View on https://basescan.org/tx/${hash}`,
        {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          pauseOnHover: true,
          draggable: true,
        }
      );
    } else {
      const hash = await writeContractAsync({
        address: IS_THIS_COIN_DEAD_CONTRACT,
        abi: parseAbi(["function voteDead(bytes32 _coin) external payable"]),
        functionName: "voteDead",
        value: parseEther("0.0001"),
        args: [coinHash],
      });
      toast.success(
        `Vote casted successfully! View on https://basescan.org/tx/${hash}`,
        {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          pauseOnHover: true,
          draggable: true,
        }
      );
    }

    setIsVoting(false);
  };

  // Format description text - handling HTML tags that might be in the description
  const formatDescription = () => {
    // Create a short version (first 150 characters)
    const shortDesc =
      description.length > 150
        ? description.slice(0, 150) + "..."
        : description;

    return {
      full: description,
      short: shortDesc,
      hasMore: description.length > 150,
    };
  };

  const descriptionData = formatDescription();

  return (
    <div className="text-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="rounded-lg shadow-xl overflow-hidden bg-neutral-800">
          {/* Coin Header */}
          <div className="p-6 border-b border-neutral-700 bg-neutral-800 flex items-center space-x-6">
            <Image
              src={logo}
              alt={`${name} logo`}
              className="w-16 h-16 rounded-full"
            />
            <div>
              <h2 className="text-2xl font-bold text-white">{name}</h2>
              <p className="text-sm text-gray-400">{symbol}</p>
            </div>
          </div>

          {/* Description Section */}
          <div className="p-6 border-b border-neutral-700">
            <h3 className="text-lg font-semibold text-white mb-2">
              About {name}
            </h3>
            <div className="text-gray-300 prose prose-invert max-w-none">
              {showFullDescription ? (
                <div
                  dangerouslySetInnerHTML={{ __html: descriptionData.full }}
                />
              ) : (
                <div
                  dangerouslySetInnerHTML={{ __html: descriptionData.short }}
                />
              )}

              {descriptionData.hasMore && (
                <button
                  onClick={() => setShowFullDescription(!showFullDescription)}
                  className="text-blue-400 hover:text-blue-300 mt-2 text-sm font-medium"
                >
                  {showFullDescription ? "Show Less" : "Read More"}
                </button>
              )}
            </div>
          </div>

          {/* Voting Stats */}
          <div className="p-6">
            <div className="mb-8">
              <div className="mb-2 text-center">
                <span className="text-3xl font-bold text-white inline-block px-6 py-2 rounded-lg shadow-md">
                  Is This Coin Dead?:{" "}
                  <span className="text-red-400">{deadRate}%</span>
                </span>
              </div>
              <div className="w-full bg-green-700 rounded-full h-4">
                <div
                  className="bg-red-600 h-4 rounded-full transition-all duration-500"
                  style={{ width: `${deadRate}%` }}
                ></div>
              </div>
            </div>

            {/* Vote Counts */}
            <div className="flex justify-between mb-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-red-400">
                  {votesDead}
                </div>
                <div className="text-sm text-gray-400">Votes Dead</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400">
                  {votesAlive}
                </div>
                <div className="text-sm text-gray-400">Votes Alive</div>
              </div>
            </div>

            {/* Voting Buttons */}
            <div className="flex space-x-4">
              <button
                onClick={() => handleVote(false)}
                disabled={isVoting}
                className={`flex-1 py-3 px-4 rounded-lg font-medium text-white bg-red-600 hover:bg-red-700 transition-colors`}
              >
                {isVoting ? "Voting..." : "Vote Dead"}
              </button>
              <button
                onClick={() => handleVote(true)}
                disabled={isVoting}
                className={`flex-1 py-3 px-4 rounded-lg font-medium text-white bg-green-600 hover:bg-green-700 transition-colors `}
              >
                {isVoting ? "Voting..." : "Vote Alive"}
              </button>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default CoinInfoPage;

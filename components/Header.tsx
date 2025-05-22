"use client";
import React, { useState } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Link from "next/link";
import { useRouter } from "next/navigation";

const Header = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    // Redirect to the search value route
    router.push(`/${searchQuery}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch(e);
    }
  };

  return (
    <header className="bg-neutral-800 p-4 flex flex-col md:flex-row items-center justify-between gap-4">
      <div className="md:w-1/4 animate-fade-in">
        <Link href="/">
          <h1 className="text-3xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-green-600">
            IsThisCoinDead?
          </h1>{" "}
        </Link>
      </div>
      <div className="flex justify-center w-full md:w-1/2">
        <div className="relative w-full max-w-md">
          <div className="flex">
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              type="text"
              placeholder="Enter Coinmarketcap Coin Slug"
              className="bg-neutral-700 border rounded-l-xl border-neutral-600 px-3 py-2 focus:outline-none w-full"
            />
            <button
              onClick={handleSearch}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 focus:outline-none rounded-r-xl"
            >
              <span>Search</span>
            </button>
          </div>
        </div>
      </div>
      <div>
        <ConnectButton
          showBalance={false}
          chainStatus="icon"
          label="Connect Wallet"
        />
      </div>
    </header>
  );
};

export default Header;
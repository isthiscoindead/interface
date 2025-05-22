"use client"
import { useState } from "react";
import { NextPage } from "next";

interface CoinInfoPageProps {
  name: string
  symbol: string
  description: string
  logo: string
  slug: string
}

const CoinInfoPage: NextPage<CoinInfoPageProps> = ({name, symbol, description, logo, slug}: CoinInfoPageProps) => {
  // Mock data - replace with actual API calls
  const votesDead = 1000
  const votesAlive = 200
  
  const [isVoting, setIsVoting] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);
  
  const deadRate = Math.round((votesDead / (votesAlive + votesDead)) * 100);
  
  const handleVote = async (isAlive: boolean) => {
    setIsVoting(true);
    
    try {
      setHasVoted(true);
    } catch (error) {
      console.error("Error voting:", error);
    } finally {
      setIsVoting(false);
    }
  };
  
  // Format description text - handling HTML tags that might be in the description
  const formatDescription = () => {
    // Create a short version (first 150 characters)
    const shortDesc = description.length > 150 ? description.slice(0, 150) + '...' : description;
    
    return { 
      full: description,
      short: shortDesc,
      hasMore: description.length > 150
    };
  };
  
  const descriptionData = formatDescription();
  
  return (
    <div className="min-h-screen text-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="bg-neutral-800 rounded-lg shadow-xl overflow-hidden bg-neutral-800">
          {/* Coin Header */}
          <div className="p-6 border-b border-neutral-700 bg-neutral-800 flex items-center space-x-6">
            <img 
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
            <h3 className="text-lg font-semibold text-white mb-2">About {name}</h3>
            <div className="text-gray-300 prose prose-invert max-w-none">
              {showFullDescription ? (
                <div dangerouslySetInnerHTML={{ __html: descriptionData.full }} />
              ) : (
                <div dangerouslySetInnerHTML={{ __html: descriptionData.short }} />
              )}
              
              {descriptionData.hasMore && (
                <button 
                  onClick={() => setShowFullDescription(!showFullDescription)}
                  className="text-blue-400 hover:text-blue-300 mt-2 text-sm font-medium"
                >
                  {showFullDescription ? 'Show Less' : 'Read More'}
                </button>
              )}
            </div>
          </div>
          
          {/* Voting Stats */}
          <div className="p-6">
            <div className="mb-8">
              <div className="mb-2 text-center">
                <span className="text-3xl font-bold text-white inline-block px-6 py-2 rounded-lg shadow-md">
                  Is This Coin Dead?: <span className="text-red-400">{deadRate}%</span>
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
                <div className="text-3xl font-bold text-red-400">{votesDead}</div>
                <div className="text-sm text-gray-400">Votes Dead</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400">{votesAlive}</div>
                <div className="text-sm text-gray-400">Votes Alive</div>
              </div>
            </div>
            
            {/* Voting Buttons */}
            <div className="flex space-x-4">
              <button
                onClick={() => handleVote(false)}
                disabled={isVoting || hasVoted}
                className={`flex-1 py-3 px-4 rounded-lg font-medium text-white ${
                  hasVoted 
                    ? "bg-gray-600 cursor-not-allowed" 
                    : "bg-red-600 hover:bg-red-700 transition-colors"
                }`}
              >
                {isVoting ? "Voting..." : "Vote Dead"}
              </button>
              <button
                onClick={() => handleVote(true)}
                disabled={isVoting || hasVoted}
                className={`flex-1 py-3 px-4 rounded-lg font-medium text-white ${
                  hasVoted 
                    ? "bg-gray-600 cursor-not-allowed" 
                    : "bg-green-600 hover:bg-green-700 transition-colors"
                }`}
              >
                {isVoting ? "Voting..." : "Vote Alive"}
              </button>
            </div>
            
            {hasVoted && (
              <p className="text-center mt-4 text-sm text-gray-400">
                Thank you for voting! Your vote has been recorded.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoinInfoPage;
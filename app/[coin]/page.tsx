import axios from "axios";
import CoinInfoPage from "./info";

interface CoinPageProps {
  params: Promise<{
    coin: string;
  }>;
}

const CoinPage = async ({ params }: CoinPageProps) => {
  const { coin } = await params;
  let coinData;
  try {
    const response = await axios.get(
      "https://pro-api.coinmarketcap.com/v2/cryptocurrency/info",
      {
        params: {
          slug: coin,
        },
        headers: {
          "X-CMC_PRO_API_KEY": process.env.COINMARKETCAP_API_KEY,
        },
      }
    );

    // Get the first coin ID (key) from the data object
    const coinId = Object.keys(response.data.data)[0];
    // Access the coin data using the ID
    coinData = response.data.data[coinId];
  } catch (error: unknown) {
    console.error("Error fetching coin data:", error);
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center">
        <div className="border border-neutral-700 rounded-lg p-6 max-w-md">
          <h1 className="text-2xl font-bold text-red-600 mb-2">
            Coin Not Found
          </h1>
          <p className="text-white mb-4">
            Sorry, we couldn&apos;t find information for &quot;{coin}&quot;.
            This coin might not exist or there could be an issue with our data
            provider.
          </p>
          <div className="flex flex-col gap-3">
            <p className="text-sm text-white">
              Coin must match with the CoinMarketCap.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <CoinInfoPage
        name={coinData.name}
        symbol={coinData.symbol}
        description={coinData.description}
        logo={coinData.logo}
        slug={coin}
      />
    </div>
  );
};

export default CoinPage;

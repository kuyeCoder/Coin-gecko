import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { CryptoContext } from "../context/cryptoContext";
import AreaChart from "./AreaChart";
import { ArrowDown, ArrowUp } from "lucide-react";

const CoinPage = () => {
  // uses useParams() to get the crytold from the URL

  const { cryptoId } = useParams();
  const [coinDetails, setCoinDetails] = useState(null);
  // console.log(coinDetails)

  // charData - stores price chart data.

  const [charData, setChartData] = useState(null);
  //** Period - tracks the selected time period for the chart (default : 10days) */
  const [period, setPeriod] = useState("10");

  // error -tracks any API errors
  const [error, setError] = useState(null);

  // Accesses currentCurrency from cryptoContext to display prices in the selected.

  //** Typically this line accesses the currentCurrency object from the cryptoContext. This object likely contains the name and symbol of the currently selected (e.g., {name: "usd", symbol: "$"}

  const { currentCurrency } = useContext(CryptoContext);
  console.log(currentCurrency);

  if (!cryptoId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-800 text-white">
        <p>Error: No cryptoCurrency ID provided </p>
      </div>
    );
  }

  const requestOptions = {
    method: "GET",
    headers: {
      accept: "application/json",
      "x-cg-demo-api-key": "CG-yv92JYw3fMAJc1PKz2ppNrKc	",
    },
  };

  useEffect(() => {
    setError(null); // no error
    const fetchData = async () => {
      try {
        const detailsRes = await fetch(
          `https://api.coingecko.com/api/v3/coins/${cryptoId}`,
          requestOptions
        );
        if (!detailsRes.ok)
          throw new Error(
            `Error fetching coin details: ${detailsRes.statusText}`
          );

        setCoinDetails(await detailsRes.json());

        const chartRes = await fetch(
          `https://api.coingecko.com/api/v3/coins/${cryptoId}/market_chart?vs_currency=${currentCurrency.name}&days=${period}&interval=daily`,
          requestOptions
        );

        if (!chartRes.ok)
          throw new Error(
            `Error fetching coin details: ${chartRes.statusText}`
          );

        setChartData(await chartRes.json());
      } catch (err) {
        console.log(err);
        setError(err.message);
      }
    };

    /*
        Data visualization:
        Includes an AreaChart component to display price history

        Period can be changed via a dropdown *24H, 7D, 30D, etc. 
    */

    fetchData();
  }, [currentCurrency, cryptoId, period]);

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <p>{error}</p>
      </div>
    );

  if (!coinDetails || !charData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900/50 to-gray-900/90 text-white px-4 sm:px-[5%] md:px-[8%] py-6">
      {/* ------------------------HEADER-------------------- */}

      <div className="flex flex-col items-center md:flex-row gap-4 mb-6 bg-gray-800/30 backdrop-blur-lg p-4 rounded-xl border border-emerald-500">
        <img
          src={coinDetails.image?.large}
          alt={coinDetails.name}
          className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500/20 p-1"
        />

        <div className="md:text-left">
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
            {coinDetails.name}
            <span className="text-xl md:text-2xl ml-2 text-cyan-400/80 block mt-1">
              ({coinDetails.symbol?.toUpperCase()})
            </span>
          </h1>
          <p className="mt-1 text-sm text-gray-300/80">
            Rank: #{coinDetails.market_cap_rank}
          </p>
        </div>
      </div>

      {/*-------------- Price Chart Card */}

      <div className="mb-6 bg-gray-800/30 backdrop-blur-md p-4 rounded-xl border border-emerald-500/20">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-3 gap-2">
          <h2 className="text-lg font-semibold text-emerald-400/90">
            {currentCurrency.symbol} price chart
          </h2>

          <div className="relative group">
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="bg-gray-800/60 border border-emerald-500/50 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500/50"
            >
              <option value="1">24H</option>
              <option value="7">7D</option>
              <option value="10">10D</option>
              <option value="30">30D</option>
              <option value="90">3M</option>
              <option value="365">1Y</option>
            </select>

            {/*  Cool Blurry Outline */}

            <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-600/20 to-cyan-500/20 rounded-lg blur opacity-30 group-hover:opacity-50 transition duration-300 -z-10"></div>
          </div>

          {/* 
              Data Visualization:
              Includes an areaChart componenent to display price history
              Period can be changed via a dropdown (24H, 7D, 30D etc)
          */}

          {/* <div className="h-24 md:h-80">
            <AreaChart historicalData={charData} currencySymbol={currentCurrency.symbol} />
          </div>
        </div> */}

          
        </div>

        {/* --------------MOBILE STart (stacked) ------------ */}

          <div className="space-y-3 md:hidden">
            {/* current Price */}
            <div className="bg-gray-800/30 backdrop-blur-md p-4 rounded-lg border border-emerald-500/20">
              <div className="flex justify-between items-center">
                <span className="text-sm text-cyan-400/80">Current Price</span>
                <span className="text-lg font-bold text-emerald-400">
                  {currentCurrency.symbol}
                  {coinDetails.market_data?.current_price?.[
                    currentCurrency.name
                  ]?.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Market Cap */}
            <div className="bg-gray-800/30 backdrop-blur-md p-4 rounded-lg border border-emerald-500/20">
              <div className="flex justify-between items-center">
                <span className="text-sm text-cyan-400/80">Market Cap</span>
                <span className="text-lg font-bold text-emerald-400">
                  {currentCurrency.symbol}
                  {coinDetails.market_data?.market_cap?.[
                    currentCurrency.name
                  ]?.toLocaleString()}
                </span>
              </div>
            </div>

            {/* 24_hour Range */}
            <div className="bg-gray-800/30 backdrop-blur-md p-4 rounded-lg border border-emerald-500/20">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-cyan-400/80">24h High</span>
                  <div className="flex items-center text-green-400">
                    <ArrowUp className="w-4 h-4 mr-1" />
                    {currentCurrency.symbol}
                    {coinDetails.market_data?.high_24h?.[
                      currentCurrency.name
                    ]?.toLocaleString()}
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-cyan-400/80">24h Low</span>
                  <div className="flex items-center text-red-400">
                    <ArrowUp className="w-4 h-4 mr-1" />
                    {currentCurrency.symbol}
                    {coinDetails.market_data?.low_24h?.[
                      currentCurrency.name
                    ]?.toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          </div>
      </div>

      {/* --------------Desktop stats (three.across) ------------------- */}

      <div className="hidden md:flex justify-between gap-4 mt-6">
        {/* Current Price */}
        <div className="flex-1 bg-gray-800/30 backdrop-blur-md rounded-xl border p-4 border-lime-500/20">
          <h3 className="text-sm text-cyan-400/80 mb-2">Current Price</h3>
          <p className="text-2xl font-bold text-emerald-400">
            {currentCurrency.symbol}
            {coinDetails.market_data?.current_price?.[currentCurrency.name]?.toLocaleString()}
          </p>

        </div>

        {/* Market Cap */}
        <div className="flex-1 bg-gray-800/30 backdrop-blur-md p-4 rounded-xl border border-emerald-500/20">
          <h3 className="text-sm text-cyan-400/80 mb-2">Market Cap</h3>
          <p className="text-2xl font-bold text-emerald-400">
            {currentCurrency.symbol}
            {coinDetails.market_data?.market_cap?.[currentCurrency.name]?.toLocaleString()}
          </p>
        </div>

        {/* 24h Range */}
        <div className="flex-1 bg-gray-800/30 backdrop-blur-md p-4 rounded-xl border border-emerald-500/20">
          <h3 className="text-sm text-cyan-400/80 mb-2">24h Range</h3>
          <div className="flex justify-between items-center">
            <div className="flex items-center text-green-400">
              <ArrowUp className="w-5 h-5 mr-1" />
              {currentCurrency.symbol} {coinDetails.market_data?.high_24h?.[currentCurrency.name]?.toLocaleString()}

            </div>

            <div className="flex items-center text-red-400">
              <ArrowDown className="w-5 h-5 mr-1" />
              {currentCurrency.symbol} {coinDetails.market_data?.low_24h?.[currentCurrency.name]?.toLocaleString()}
            </div>

          </div>
        </div>
      

      </div>

      <div className="flex flex-col md:flex-row gap-4 mt-6">
        {/* 24H change */}
        <div className="flex-1 bg-gray-800/30 backdrop-blur-md p-4 rounded-lg md:rounded-xl border-emerald-500/30">
          <div className="flex justify-between items-center">
            <span className="text-sm md:text-base text-emerald-400/90">24h Change</span>
            <div className="flex items-center gap-2">
              <span className={`text-base md:text-lg ${coinDetails.market_data?.price_change_percentage_24h > 0 ? "text-green-400" : "text-red-400"}`}>
                {typeof coinDetails.market_data?.price_change_percentage_24h === "number" ? coinDetails.market_data.price_change_percentage_24h.toFixed(2) : "--"}%</span>
              {coinDetails.market_data?.price_change_percentage_24h > 0 ? (
                <ArrowUp className="w-5 h-5 text-green-400" />
              ) : (
                  <ArrowDown className="w-5 h-5 text-red-400" />
              )}
            </div>

          </div>

        </div>

      </div>


    </div>
  );
};

export default CoinPage;

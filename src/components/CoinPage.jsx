import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { CryptoContext } from "../context/cryptoContext";

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
    )
  
  if (!coinDetails || !charData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 bg-emerald-500"></div>
      </div>
    )
  }


  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900/50 to-gray-900/90 text-white px-4 sm:px-[5%] md:px-[8%] py-6">
      {/* ------------------------HEADER-------------------- */}
      
      <div className="flex flex-col items-center md:flex-row gap-4 mb-6 bg-gray-800/30 backdrop-blur-lg p-4 rounded-xl border border-emerald-500">
        <img src={coinDetails.image?.large} alt={coinDetails.name} className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500/20 p-1" />

        <div className="md:text-left">
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
            {coinDetails.name}
          <span className="text-xl md:text-2xl ml-2 text-cyan-400/80 block mt-1">
            ({coinDetails.symbol?.toUpperCase()})
          </span>
          </h1>
          <p className="mt-1 text-sm text-gray-300/80">Rank: #{coinDetails.market_cap_rank}</p>
          

        </div>
        
      </div>

      {/*-------------- Price Chart Card */}

      <div className="mb-6 bg-gray-800/30 backdrop-blur-md p-4 rounded-xl border border-emerald-500/20">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-3 gap-2 ">

        </div>

      </div>

  </div>
  )
};

export default CoinPage;

import { createContext, useEffect, useState } from "react";

export const CryptoContext = createContext();

const CryptoContextProvider = (props) => {
  // Raw array from coingecko for the selected currency.
  const [cryptolist, setCryptolist] = useState([]);
  const [filteredCryptos, setFilteredCryptos] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");

  // * Object describe which fiat currency you're priciing coins in, changing triggers a data refectch
  const [currentCurrency, setCurrentCurrency] = useState({
    name: "usd",
    symbol: "$",
  });

  const fetchCryptoData = async () => {
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        "x-cg-demo-api-key": "CG-yv92JYw3fMAJc1PKz2ppNrKc",
      },
    };

    try {
      const res = await fetch(
        `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currentCurrency.name}`,
        options
      );
      const data = await res.json();

      // if data is successfull , it parse the JSON response and updates the cryptolist state with the data using setCryptolist(data).

      setCryptolist(data);
    } catch (error) {
      console.log("Failed to fetch crypto data:", error);  
    }
  };

  // Refetch when currency changes.

  // useEffect(() => { ... }, [])

  // useEffect Formula

  
  useEffect(() => {
    fetchCryptoData();

    // The [currency] array is the dependency array. if any value in this array changes between renders, the effect will re-run. this ensures that if the user switches from USD to EUR, new data is fetched immediately.
    // It also runs once when the component mounts for the first time to fetch initial data.
  }, [currentCurrency]);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      // if searchTerm is empty (or just whitespace), filteredCryptos is set to the entire cryptolist
      setFilteredCryptos(cryptolist);
    } else {
      setFilteredCryptos(
        cryptolist.filter((c) =>
          c.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
  }, [cryptolist, searchTerm]);

  const contextValue = {
    cryptolist,
    filteredCryptos,
    currentCurrency,
    setCurrentCurrency,
    searchTerm,
    setSearchTerm,
  };

  return (
    <CryptoContext.Provider value={contextValue}>
      {props.children}
    </CryptoContext.Provider>
  );
};

export default CryptoContextProvider;

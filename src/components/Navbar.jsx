// --- Copilot: Keyboard navigation for search dropdown ---
import { Coins } from "lucide-react";
import { useContext, useState, useEffect } from "react";
import { CryptoContext } from "../context/cryptoContext";
import { Search } from "lucide-react";

const Navbar = () => {
  const [input, setInput] = useState("");
  const [filteredCoins, setFilteredCoins] = useState([]);
  const [highlightedIndex, setHighlightedIndex] = useState(-1); // Copilot: Track highlighted suggestion
  const { cryptolist = [], setSearchTerm } = useContext(CryptoContext);

  const searchHandler = (event) => {
    event.preventDefault();

    // Updates the global searchTermin the cryptoContext with the current of the input field. this will likely trigger a re-render in other component that are listening to searchTerm, causing them to filter their data.

    setSearchTerm(input);
  };

  // Copilot: Handle input changes and reset highlight
  const inputHandler = (event) => {
    const value = event.target.value;
    setInput(value);
    setHighlightedIndex(-1); // Copilot: Reset highlight on input change
    if (value === "") {
      setSearchTerm("");
      setFilteredCoins([]);
    } else {
      const suggestions = cryptolist.filter((coin) =>
        coin.name.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredCoins(suggestions.slice(0, 5));
    }
  };

  // === Copilot: ENHANCED Keyboard navigation for search dropdown ===
  // This effect ensures highlightedIndex is always valid when filteredCoins changes
  useEffect(() => {
    if (highlightedIndex >= filteredCoins.length) {
      setHighlightedIndex(filteredCoins.length - 1);
    }
    if (filteredCoins.length === 0) {
      setHighlightedIndex(-1);
    }
  }, [filteredCoins]);

  // This handler now also scrolls the highlighted item into view for visibility
  const handleKeyDown = (event) => {
    if (filteredCoins.length === 0) return;
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setHighlightedIndex((prev) => {
        const next = prev < filteredCoins.length - 1 ? prev + 1 : 0;
        // Copilot: Scroll highlighted item into view
        setTimeout(() => {
          const el = document.getElementById(`search-suggestion-${next}`);
          if (el) el.scrollIntoView({ block: "nearest" });
        }, 0);
        return next;
      });
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setHighlightedIndex((prev) => {
        const next = prev > 0 ? prev - 1 : filteredCoins.length - 1;
        // Copilot: Scroll highlighted item into view
        setTimeout(() => {
          const el = document.getElementById(`search-suggestion-${next}`);
          if (el) el.scrollIntoView({ block: "nearest" });
        }, 0);
        return next;
      });
    } else if (event.key === "Enter") {
      if (highlightedIndex >= 0) {
        setInput(filteredCoins[highlightedIndex].name);
        setFilteredCoins([]);
        setHighlightedIndex(-1);
      }
    }
  };

  return (
    <nav className="flex flex-wrap md:flex-nowrap items-center justify-between gap-4 px-[5%] md:px-[8%] lg:px-[10%] py-5 bg-gray-900 backdrop-blur-md border-b border-gray-700/30 sticky top-0 z-50">
      <a className="order-1 flex-shrink-0 flex items-center gap-2 hover:scale-105 transition-transform">
        <Coins className="w-8 h-8 text-emerald-800" />
        <span className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
          CrytoTracker
        </span>
      </a>

      {/* Search */}

      <form
        onSubmit={searchHandler}
        className="order-3 w-full md:order-2 md:w-auto flex-1 max-w-2xl mx-0 md:mx-4 relative"
      >
        <div className="relative group">
          {/* Gradient background */}
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/400 to-cyan-500/40 rounded-full opacity-30 group-hover:opacity-50 transistion duration-300 pointer-events-none"></div>

          {/* input + button */}

          {/* Copilot: Added onKeyDown for keyboard navigation */}
          <input
            type="text"
            placeholder="Search Crypto...."
            value={input}
            onChange={inputHandler}
            onKeyDown={handleKeyDown} // Copilot: Keyboard navigation
            required
            className="relative w-full pr-12 pl-6 py-3 bg-gray-800/60 border border-gray-600/30 rounded-full foucus:outline-none focus:ring-2 focus:ring-emerald-500/50 placeholder-gray-400 text-gray-200 backdrop-blur-sm z-10"
          />

          <button className="absolute right-2 top-1/2 -translate-y-1/2 z-20 p-2 bg-gradient-to-r from-emerald-600 to-cyan-600 text-white rounded-full hover:scale-105 transition-all">
            <Search className="w-4 h-4 pointer-events-none" />
          </button>
        </div>
        {filteredCoins.length > 0 && (
          <ul className="absolute w-full bg-gray-800/95 border border-gray-700 mt-2 rounded-lg shadow-xl z-10 backdrop-blur-md max-h-60 overflow-y-auto">
            {filteredCoins.map((coin, idx) => (
              <li
                key={idx}
                id={`search-suggestion-${idx}`}
                // === Copilot: ENHANCED highlight for keyboard navigation ===
                className={`px-4 py-3 hover:bg-emerald-400/30 hover:text-black cursor-pointer text-gray-100 transition-all duration-150 ${
                  idx === highlightedIndex
                    ? "bg-emerald-400/30 text-black font-bold border-l-4 border-emerald-600"
                    : ""
                }`}
                onMouseEnter={() => setHighlightedIndex(idx)}
                onMouseLeave={() => setHighlightedIndex(-1)}
                onClick={() => {
                  setInput(coin.name);
                  setFilteredCoins([]);
                  setHighlightedIndex(-1);
                }}
              >
                {/* === Copilot: Standout arrow for highlighted item === */}
                {idx === highlightedIndex && (
                  <span className="mr-2 animate-bounce">→</span>
                )}
                {coin.name}
              </li>
            ))}
          </ul>
        )}
      </form>
    </nav>
  );
};

export default Navbar;

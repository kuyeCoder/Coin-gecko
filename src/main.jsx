import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import CryptoContextProvider from "./context/cryptoContext";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <CryptoContextProvider>
      <App />
    </CryptoContextProvider>
    
  </BrowserRouter>
);

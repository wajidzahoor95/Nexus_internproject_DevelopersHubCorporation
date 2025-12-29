import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

import { AuthProvider } from "./context/AuthContext";
import { MeetingProvider } from "./context/MeetingContext";
import { WalletProvider } from "./context/WalletContext";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider>
      <MeetingProvider>
        <WalletProvider>
          <App />
        </WalletProvider>
      </MeetingProvider>
    </AuthProvider>
  </React.StrictMode>
);

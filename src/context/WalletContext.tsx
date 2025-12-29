import { createContext, useContext, useState } from "react";

/* -------------------- Types -------------------- */

export type Transaction = {
  id: number;
  amount: number;
  sender: string;
  receiver: string;
  status: "Success";
  date: string;
  dealId?: number;
  dealName?: string;
};

type WalletContextType = {
  balance: number;
  transactions: Transaction[];
  deposit: (amount: number) => void;
  withdraw: (amount: number) => void;
  transfer: (amount: number, receiver: string) => void;
  fundDeal: (
    amount: number,
    receiver: string,
    dealId: number,
    dealName: string
  ) => void;
};

/* -------------------- Context -------------------- */

const WalletContext = createContext<WalletContextType | null>(null);

/* -------------------- Provider -------------------- */

export const WalletProvider = ({ children }: { children: React.ReactNode }) => {
  const [balance, setBalance] = useState<number>(10000);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const addTransaction = (transaction: Transaction) => {
    setTransactions((prev) => [transaction, ...prev]);
  };

  const deposit = (amount: number) => {
    if (amount <= 0) return;

    setBalance((prev) => prev + amount);
    addTransaction({
      id: Date.now(),
      amount,
      sender: "User",
      receiver: "Wallet",
      status: "Success",
      date: new Date().toISOString(),
    });
  };

  const withdraw = (amount: number) => {
    if (amount <= 0 || amount > balance) return;

    setBalance((prev) => prev - amount);
    addTransaction({
      id: Date.now(),
      amount,
      sender: "Wallet",
      receiver: "User",
      status: "Success",
      date: new Date().toISOString(),
    });
  };

  const transfer = (amount: number, receiver: string) => {
    if (amount <= 0 || amount > balance) return;

    setBalance((prev) => prev - amount);
    addTransaction({
      id: Date.now(),
      amount,
      sender: "Investor",
      receiver,
      status: "Success",
      date: new Date().toISOString(),
    });
  };

  return (
    <WalletContext.Provider
      value={{ balance, transactions, deposit, withdraw, transfer }}
    >
      {children}
    </WalletContext.Provider>
  );
};

/* -------------------- Hook -------------------- */

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error("useWallet must be used inside WalletProvider");
  }
  return context;
};

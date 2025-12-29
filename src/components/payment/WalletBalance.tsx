import { useWallet } from "../../context/WalletContext";

const WalletBalance = () => {
  const { balance } = useWallet();

  return (
    <div className="bg-gradient-to-r from-indigo-600 to-blue-500 text-white p-6 rounded-xl shadow">
      <h3 className="text-lg">Wallet Balance</h3>
      <p className="text-3xl font-bold mt-2">Rs {balance}</p>
    </div>
  );
};

export default WalletBalance;

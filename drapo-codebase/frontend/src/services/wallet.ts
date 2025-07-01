// Mock API for wallet
export const getWallet = async () => {
  return {
    address: "0xBhutanBTC1234567890abcdef",
    balance: 42.1234,
  };
};

export const getTransactions = async () => {
  return [
    { to: "0xabc123", amount: 1.5 },
    { to: "0xdef456", amount: 0.75 },
    { to: "0xghi789", amount: 2.0 },
  ];
};

export const sendTransaction = async ({
  to,
  amount,
}: {
  to: string;
  amount: number;
}) => {
  // Simulate network delay
  await new Promise((res) => setTimeout(res, 800));
  return { success: true };
};

export const createWallet = async () => {
  // Simulate wallet creation
  await new Promise((res) => setTimeout(res, 500));
  return {
    address: "0xBhutanBTC" + Math.random().toString(16).slice(2, 12),
    balance: 0,
  };
};

export const deposit = async (amount: number) => {
  // Simulate deposit
  await new Promise((res) => setTimeout(res, 500));
  return { success: true, amount };
};

export const withdraw = async (amount: number) => {
  // Simulate withdrawal
  await new Promise((res) => setTimeout(res, 500));
  return { success: true, amount };
};

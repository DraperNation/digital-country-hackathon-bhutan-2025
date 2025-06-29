'use client';

import { WagmiProvider as WagmiProviderV2, createConfig, http } from 'wagmi';
import { avalancheFuji } from 'wagmi/chains';
import { type ReactNode } from 'react';

const config = createConfig({
  chains: [avalancheFuji],
  transports: {
    [avalancheFuji.id]: http(),
  },
});

export function WagmiProvider({ children }: { children: ReactNode }) {
  return <WagmiProviderV2 config={config}>{children}</WagmiProviderV2>;
} 
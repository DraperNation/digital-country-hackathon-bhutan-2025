'use client';
import '@rainbow-me/rainbowkit/styles.css';
import {
  getDefaultConfig,
} from '@rainbow-me/rainbowkit';
import {
  holesky
} from 'wagmi/chains';

export const config = getDefaultConfig({
  appName: 'Public Multisig',
  projectId: '6d6e105d97709f1728de63ea9815aed4',
  chains: [holesky],
});
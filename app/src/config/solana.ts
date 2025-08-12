import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-phantom";
import { SolflareWalletAdapter } from "@solana/wallet-adapter-solflare";
import { BackpackWalletAdapter } from "./backpack-wallet";

import { clusterApiUrl, Connection } from "@solana/web3.js";

export let network = WalletAdapterNetwork.Devnet;
export let endpoint = clusterApiUrl(network);
export let connection = new Connection(endpoint, "confirmed");
export let blockchain: "solana" | "x1" = "solana";

export const wallets = [
    new PhantomWalletAdapter(),
    new SolflareWalletAdapter(),
    new BackpackWalletAdapter(),
];

export function switchNetwork(newNetwork: "solana" | "x1") {
    if (newNetwork == "solana") {
        blockchain = "solana";
        endpoint = clusterApiUrl(WalletAdapterNetwork.Devnet);
        connection = new Connection(endpoint, "confirmed");
    } else {
        blockchain = "x1";
        endpoint = "https://rpc.testnet.x1.xyz";
        connection = new Connection(endpoint, "confirmed");
    }
}

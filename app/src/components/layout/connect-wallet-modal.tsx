"use client";

import { WalletIcon } from "@solana/wallet-adapter-react-ui";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

import { useEffect, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";

import { switchNetwork, wallets } from "@/config/solana";

import { cn } from "@/lib/utils";
import { WalletReadyState } from "@solana/wallet-adapter-base";

interface Props {
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
}

export default function ConnectWalletModal({ isOpen, setIsOpen }: Props) {
    const { select } = useWallet();
    const [selectedNetwork, setSelectedNetwork] = useState<"solana" | "x1">(
        "solana"
    );

    useEffect(() => {
        switchNetwork(selectedNetwork);
    }, [selectedNetwork]);

    const handleWalletSelect = (wallet: (typeof wallets)[0]) => {
        if (
            wallet.readyState === WalletReadyState.NotDetected ||
            wallet.readyState === WalletReadyState.Loadable
        ) {
            window.open(wallet.url, "_blank");
            return;
        }

        try {
            select(wallet.name);
            setIsOpen(false);
        } catch (err) {
            console.error("Wallet connect error:", err);
        }
    };

    const NetworkTab = ({
        network,
        children,
    }: {
        network: "solana" | "x1";
        children: React.ReactNode;
    }) => (
        <button
            onClick={() => setSelectedNetwork(network)}
            className={cn(
                "flex-1 py-2 text-sm font-medium transition-colors border-b-2",
                selectedNetwork === network
                    ? "text-primary border-primary"
                    : "text-muted-foreground border-transparent hover:text-foreground hover:border-border"
            )}
        >
            {children}
        </button>
    );

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="sm:max-w-md bg-card text-card-foreground shadow-2xl shadow-primary/20 rounded-lg border border-primary/30 p-0">
                <DialogHeader className="p-6 pb-4">
                    <DialogTitle className="text-2xl font-headline font-bold text-primary text-center [text-shadow:0_0_8px_hsl(var(--primary)/0.5)]">
                        Connect a Wallet
                    </DialogTitle>
                    <DialogDescription className="text-center">
                        First, select your network, then choose a wallet.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex border-b mx-6">
                    <NetworkTab network="solana">Solana</NetworkTab>
                    <NetworkTab network="x1">X1</NetworkTab>
                </div>

                <div className="p-6 pt-4 space-y-3 max-h-[50vh] overflow-y-auto">
                    {wallets.map((wallet) => (
                        <Button
                            key={wallet.name}
                            onClick={() => handleWalletSelect(wallet)}
                            variant="secondary"
                            className="w-full justify-start h-14 text-lg bg-secondary hover:bg-primary/90 hover:text-primary-foreground transition-all duration-300 ease-in-out"
                        >
                            <WalletIcon
                                wallet={{ adapter: wallet }}
                                className="h-7 w-7 mr-4"
                            />
                            {wallet.name}
                        </Button>
                    ))}
                </div>
                <button
                    onClick={() => setIsOpen(false)}
                    className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none text-muted-foreground"
                >
                    <X className="h-4 w-4" />
                    <span className="sr-only">Close</span>
                </button>
            </DialogContent>
        </Dialog>
    );
}

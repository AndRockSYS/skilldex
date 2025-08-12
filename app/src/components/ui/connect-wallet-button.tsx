"use client";

import { Button } from "@/components/ui/button";
import { WalletIcon } from "@solana/wallet-adapter-react-ui";
import ConnectWalletModal from "@/components/layout/connect-wallet-modal";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Copy, LogOut, ChevronDown } from "lucide-react";

import { useState, useMemo } from "react";
import { useToast } from "@/hooks/use-toast";
import { useWallet } from "@solana/wallet-adapter-react";

export default function ConnectWalletButton() {
    const { publicKey, wallet, disconnect } = useWallet();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { toast } = useToast();

    const base58 = useMemo(() => publicKey?.toBase58(), [publicKey]);

    const copyAddress = async () => {
        if (base58) {
            await navigator.clipboard.writeText(base58);
            toast({
                title: "Address Copied",
                description: "Wallet address copied to clipboard.",
            });
        }
    };

    if (!wallet || !base58) {
        return (
            <>
                <Button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                    Connect
                </Button>
                <ConnectWalletModal
                    isOpen={isModalOpen}
                    setIsOpen={setIsModalOpen}
                />
            </>
        );
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button className="bg-secondary hover:bg-secondary/80 text-secondary-foreground">
                    <div className="flex items-center gap-2">
                        {wallet && (
                            <WalletIcon wallet={wallet} className="h-5 w-5" />
                        )}
                        <span>
                            {base58.slice(0, 4)}...{base58.slice(-4)}
                        </span>
                        <ChevronDown className="h-4 w-4" />
                    </div>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem
                    onClick={copyAddress}
                    className="cursor-pointer"
                >
                    <Copy className="mr-2 h-4 w-4" />
                    <span>Copy Address</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={disconnect}
                    className="cursor-pointer text-destructive focus:text-destructive"
                >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Disconnect</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

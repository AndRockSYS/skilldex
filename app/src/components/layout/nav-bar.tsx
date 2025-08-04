"use client";

import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import Link from "next/link";
import { Menu, CircleUserRound, Coins, Loader2, Zap } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

import { usePathname } from "next/navigation";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAppSelector } from "@/lib/redux/hooks";

import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import navBar from "@/content/nav-bar.json";

import { cn } from "@/lib/utils";

export default function NavBar() {
    const pathname = usePathname();
    const [isSheetOpen, setIsSheetOpen] = useState(false);

    const user = useAppSelector((state) => state.userReducer);

    const ProfileIcon = ({ isMobileSize = false }) => (
        <Link
            href="/profile"
            className={cn(
                buttonVariants({ variant: "ghost", size: "sm" }),
                "text-muted-foreground hover:text-primary w-9 h-9 px-0",
                isMobileSize && "h-8 w-8"
            )}
        >
            <Avatar className={cn("h-6 w-6", isMobileSize && "h-5 w-5")}>
                <AvatarImage src={user.avatar || undefined} alt="User Avatar" />
                <AvatarFallback className="bg-transparent">
                    <CircleUserRound className="h-5 w-5" />
                </AvatarFallback>
            </Avatar>
            <span className="sr-only">Profile</span>
        </Link>
    );

    return (
        <>
            <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="w-full flex h-16 items-center justify-between px-8">
                    <Link
                        href="/"
                        className="flex items-center gap-2"
                        onClick={() => setIsSheetOpen(false)}
                    >
                        <span className="rainbow-text font-headline text-2xl font-bold">
                            SKILLDEX.IO
                        </span>
                    </Link>

                    <div className="hidden md:flex items-center gap-1 lg:gap-2">
                        {navBar.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    buttonVariants({
                                        variant: "ghost",
                                        size: "sm",
                                    }),
                                    "font-medium transition-colors",
                                    pathname == item.href
                                        ? "text-primary"
                                        : "text-muted-foreground hover:bg-accent/10 hover:text-accent"
                                )}
                            >
                                {item.label}
                            </Link>
                        ))}
                        <Link
                            href="/skill"
                            className="flex w-full items-center py-3 font-medium text-accent hover:text-accent/80"
                        >
                            <Zap className="size-4 mr-2" /> $SKILL
                        </Link>
                        <div className="ml-4 flex items-center gap-3">
                            <WalletBalance isMobile={false} />
                            <WalletMultiButton className="py-4 w-full min-h-[40px] text-lg bg-primary text-primary-foreground rounded-lg" />
                            <ProfileIcon />
                        </div>
                    </div>

                    <div className="flex items-center gap-2 md:hidden">
                        <WalletBalance isMobile={true} />
                        <ProfileIcon isMobileSize={true} />
                        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                            <SheetTrigger asChild>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-8 w-8"
                                >
                                    <Menu className="h-5 w-5" />
                                    <span className="sr-only">
                                        Toggle navigation menu
                                    </span>
                                </Button>
                            </SheetTrigger>
                            <SheetContent
                                side="right"
                                className="w-[280px] sm:w-[320px]"
                            >
                                <SheetHeader className="sr-only">
                                    <SheetTitle>Navigation Menu</SheetTitle>
                                </SheetHeader>
                                <div className="grid gap-4 py-6">
                                    <Link
                                        href="/"
                                        className="flex items-center gap-2 mb-4 px-2"
                                        onClick={() => setIsSheetOpen(false)}
                                    >
                                        <span className="rainbow-text font-headline text-xl font-bold">
                                            SKILLDEX.IO
                                        </span>
                                    </Link>
                                    {navBar.map((item) => (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            className={cn(
                                                "flex w-full items-center py-3 text-lg font-medium",
                                                pathname === item.href
                                                    ? "text-accent"
                                                    : "text-foreground hover:text-accent"
                                            )}
                                            onClick={() =>
                                                setIsSheetOpen(false)
                                            }
                                        >
                                            {item.label}
                                        </Link>
                                    ))}
                                    <div className="mt-4 border-t pt-4 px-2">
                                        <WalletMultiButton className="w-full min-h-[40px] text-lg bg-primary text-primary-foreground rounded-lg" />
                                    </div>
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </nav>
        </>
    );
}

const WalletBalance = ({ isMobile }: { isMobile: boolean }) => {
    const { publicKey } = useWallet();
    const { connection } = useConnection();

    const {
        data: balance,
        isFetching,
        isRefetching,
    } = useQuery({
        queryKey: [publicKey ?? "user", "balance"],
        queryFn: async () => {
            if (!publicKey) return 0;

            const balance = await connection.getBalance(publicKey);
            return balance / LAMPORTS_PER_SOL;
        },
        initialData: 0,
        refetchInterval: 2_000,
    });

    return (
        <span
            className={cn(
                "flex items-center gap-1 font-medium",
                "text-muted-foreground",
                isMobile ? "text-xs" : "text-sm"
            )}
        >
            {isFetching && !balance ? (
                <Loader2
                    className={cn(
                        isMobile ? "size-3.5" : "size-4",
                        "text-muted-foreground/70 animate-spin"
                    )}
                />
            ) : (
                <Coins
                    className={cn(
                        isMobile ? "size-3.5" : "size-4",
                        "text-muted-foreground/70"
                    )}
                />
            )}
            <span>{balance.toFixed(2)}</span>
        </span>
    );
};

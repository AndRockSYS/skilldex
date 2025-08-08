"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
    PlusSquare,
    Search,
    Filter,
    ChevronLeft,
    ChevronRight,
    Gamepad,
} from "lucide-react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LobbiesTable from "@/components/lobby/lobbies-table";
import Announcements from "@/components/lobby/announcements";
import UserLobbies from "@/components/lobby/user-lobbies";
import Image from "next/image";

import { useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useWallet } from "@solana/wallet-adapter-react";
import useLobbies from "@/hooks/use-lobbies";

import GameDatabase from "@/lib/firebase/games";

import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { games } from "@/content/games";

import { GameState, GameType, TableGameState } from "@/types/games";
import { cn } from "@/lib/utils";

function LobbyPage() {
    const { publicKey } = useWallet();
    const searchParams = useSearchParams();
    const lobbyId = searchParams.get("lobbyId");
    const game = searchParams.get("game");

    const [state, setState] = useState<TableGameState>(TableGameState.Open);

    const [searchTerm, setSearchTerm] = useState("");
    const [gameType, setGameType] = useState<GameType>(Number(game ?? -1));

    const [minStake, setMinStake] = useState<string>("");
    const [maxStake, setMaxStake] = useState<string>("");

    const {
        lobbies,
        hasNextPage,
        fetchNextPage,
        hasPreviousPage,
        fetchPreviousPage,
        page,
    } = useLobbies(gameType, state);

    const { data: lobby } = useQuery({
        queryKey: ["lobby", lobbyId],
        queryFn: async () => await GameDatabase.fetchLobbyById(Number(lobbyId)),
        enabled: !!lobbyId,
    });

    const filteredLobbies = useMemo(() => {
        let filtered = lobby ? [lobby] : lobbies.pages[page];
        if (!filtered) filtered = [];

        if (searchTerm) {
            const lowered = searchTerm.toLowerCase();
            filtered = filtered.filter(
                (lobby) =>
                    lobby.id.toString().toLowerCase().includes(lowered) ||
                    lobby.creator.wallet.toLowerCase().includes(lowered)
            );
        }

        const parsedMinStake = parseFloat(minStake);
        if (!isNaN(parsedMinStake))
            filtered = filtered.filter(
                (lobby) =>
                    lobby.pool.initial / LAMPORTS_PER_SOL >= parsedMinStake
            );

        const parsedMaxStake = parseFloat(maxStake);
        if (!isNaN(parsedMaxStake))
            filtered = filtered.filter(
                (lobby) =>
                    lobby.pool.initial / LAMPORTS_PER_SOL <= parsedMaxStake
            );

        return filtered;
    }, [lobbies, lobby, page, searchTerm, gameType, minStake, maxStake]);

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <h1 className="font-headline text-3xl md:text-4xl font-bold tracking-tight text-center md:text-left">
                    Games Lobby
                </h1>
                <Button
                    asChild
                    className="w-full md:w-auto bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                    <Link
                        href="/create-lobby"
                        className="flex items-center px-4 py-2"
                    >
                        <PlusSquare className="mr-2 h-5 w-5" />
                        <span className="font-medium">Create a Challenge</span>
                    </Link>
                </Button>
            </div>
            <div className="fixed inset-0 -z-10">
                <Image
                    src="/images/lobby.png"
                    alt="background"
                    fill
                    className="object-cover"
                    priority
                />
            </div>
            <Announcements />
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                {[
                    {
                        id: -1,
                        thumbnail: "/images/thumbnail/all-games.png",
                        name: "All Games",
                    },
                    ...games,
                ].map((game) => {
                    const isSelected = gameType === game.id;
                    return (
                        <button
                            key={game.id}
                            onClick={() => setGameType(game.id)}
                            className={cn(
                                "group relative rounded-lg border-2 text-center transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background",
                                isSelected
                                    ? "bg-primary/10 border-primary"
                                    : "bg-card/50 border-border hover:border-primary/50"
                            )}
                        >
                            <Image
                                src={game.thumbnail}
                                alt={game.name}
                                width={400}
                                height={200}
                            />
                            <p
                                className={cn(
                                    "absolute w-full bg-card bottom-0 left-1/2 -translate-x-1/2 font-bold text-sm sm:text-base transition-colors",
                                    isSelected
                                        ? "text-primary"
                                        : "text-foreground"
                                )}
                            >
                                {game.name}
                            </p>
                        </button>
                    );
                })}
            </div>
            <Accordion type="single" collapsible className="w-full">
                <AccordionItem
                    value="filters"
                    className="border-b-0 rounded-lg shadow-sm bg-card"
                >
                    <AccordionTrigger className="px-4 sm:px-6 py-4 hover:no-underline">
                        <div className="flex items-center text-xl font-semibold">
                            <Filter className="mr-2 h-5 w-5 text-primary" />
                            Filters
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="p-0">
                        <div className="px-4 sm:px-6 pt-0 pb-4 space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 items-end">
                                <div>
                                    <Label
                                        htmlFor="min-stake-filter"
                                        className="text-sm font-medium"
                                    >
                                        Min Stake (SOL/XNT)
                                    </Label>
                                    <Input
                                        id="min-stake-filter"
                                        type="number"
                                        placeholder="e.g., 0.1 or 1"
                                        value={minStake}
                                        onChange={(e) =>
                                            setMinStake(e.target.value)
                                        }
                                        min="0"
                                        step="0.01"
                                    />
                                </div>
                                <div>
                                    <Label
                                        htmlFor="max-stake-filter"
                                        className="text-sm font-medium"
                                    >
                                        Max Stake (SOL/XNT)
                                    </Label>
                                    <Input
                                        id="max-stake-filter"
                                        type="number"
                                        placeholder="e.g., 10"
                                        value={maxStake}
                                        onChange={(e) =>
                                            setMaxStake(e.target.value)
                                        }
                                        min="0"
                                        step="0.01"
                                    />
                                </div>
                            </div>
                            <div className="relative">
                                <Label
                                    htmlFor="search-filter"
                                    className="text-sm font-medium sr-only"
                                >
                                    Search All
                                </Label>
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
                                <Input
                                    id="search-filter"
                                    placeholder="Search by challenger or lobby id"
                                    className="pl-10"
                                    value={searchTerm}
                                    onChange={(e) =>
                                        setSearchTerm(e.target.value)
                                    }
                                />
                            </div>
                        </div>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
            <Tabs
                defaultValue={GameState.Open.toString()}
                onValueChange={(value) =>
                    setState(Number(value) as TableGameState)
                }
                className="w-full"
            >
                <TabsList
                    className={cn(
                        "grid w-full",
                        publicKey ? "grid-cols-4" : "grid-cols-3"
                    )}
                >
                    <TabsTrigger value={TableGameState.Open.toString()}>
                        Open
                    </TabsTrigger>
                    <TabsTrigger value={TableGameState.Active.toString()}>
                        Active
                    </TabsTrigger>
                    <TabsTrigger value={TableGameState.Finished.toString()}>
                        History
                    </TabsTrigger>
                    {publicKey && (
                        <TabsTrigger value={TableGameState.User.toString()}>
                            My Games
                        </TabsTrigger>
                    )}
                </TabsList>
                {[
                    TableGameState.Open,
                    TableGameState.Active,
                    TableGameState.Finished,
                    TableGameState.User,
                ].map((state) => (
                    <TabsContent
                        key={state}
                        value={state.toString()}
                        className="mt-4"
                    >
                        <Card>
                            <CardContent className="p-0">
                                {state == TableGameState.User ? (
                                    <UserLobbies
                                        lobbies={lobbies.pages[page]}
                                    />
                                ) : (
                                    <LobbiesTable
                                        lobbies={filteredLobbies.filter(
                                            (lobby) => {
                                                return lobby.state ==
                                                    GameState.Open
                                                    ? !lobby.expirationTime ||
                                                          lobby.expirationTime >
                                                              Date.now()
                                                    : true;
                                            }
                                        )}
                                        status={state as unknown as GameState}
                                    />
                                )}
                            </CardContent>
                            <CardFooter className="flex justify-between items-center py-4 border-t">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => fetchPreviousPage()}
                                    disabled={hasPreviousPage || page == 0}
                                >
                                    <ChevronLeft className="mr-2 h-4 w-4" />{" "}
                                    Previous
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => fetchNextPage()}
                                    disabled={!hasNextPage}
                                >
                                    Next{" "}
                                    <ChevronRight className="ml-2 h-4 w-4" />
                                </Button>
                            </CardFooter>
                        </Card>
                    </TabsContent>
                ))}
            </Tabs>
        </div>
    );
}

export default function Suspended() {
    return (
        <Suspense>
            <LobbyPage />
        </Suspense>
    );
}

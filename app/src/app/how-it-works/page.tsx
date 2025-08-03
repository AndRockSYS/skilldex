"use client";

import { ArrowRight, ShieldCheck, Lock, Scaling } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Card } from "@/components/ui/card";

import { games, rules } from "@/content/games";

export default function HowItWorks() {
    return (
        <div className="space-y-20 md:space-y-28 px-4 py-12">
            <section className="text-center">
                <h1 className="font-headline text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-12">
                    How <span className="text-primary">SKILLDEX</span> Works
                </h1>
                <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-8 md:gap-4 text-center">
                    <div className="flex flex-col items-center">
                        <div className="mb-4 flex items-center justify-center h-16 w-16 rounded-full bg-primary/20 text-primary font-bold text-2xl font-headline">
                            1
                        </div>
                        <h3 className="text-xl font-semibold mb-2">
                            Connect & Challenge
                        </h3>
                        <p className="text-muted-foreground">
                            Connect your wallet, then create or join a challenge
                            in the lobby.
                        </p>
                    </div>
                    <div className="flex flex-col items-center">
                        <div className="mb-4 flex items-center justify-center h-16 w-16 rounded-full bg-primary/20 text-primary font-bold text-2xl font-headline">
                            2
                        </div>
                        <h3 className="text-xl font-semibold mb-2">
                            Play to Win
                        </h3>
                        <p className="text-muted-foreground">
                            Go head-to-head in your favorite skill games against
                            another player.
                        </p>
                    </div>
                    <div className="flex flex-col items-center">
                        <div className="mb-4 flex items-center justify-center h-16 w-16 rounded-full bg-primary/20 text-primary font-bold text-2xl font-headline">
                            3
                        </div>
                        <h3 className="text-xl font-semibold mb-2">
                            Claim Your Prize
                        </h3>
                        <p className="text-muted-foreground">
                            The winner's wallet is automatically credited with
                            the prize pool.
                        </p>
                    </div>
                </div>
            </section>
            <section>
                <h2 className="font-headline text-3xl md:text-4xl font-bold mb-8 text-center">
                    Our Games
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {games.map((game) => (
                        <Link
                            href={`/lobby?game=${game.id}`}
                            key={game.id}
                            className="block group"
                        >
                            <Card className="overflow-hidden transition-all duration-300 ease-in-out border-2 border-transparent group-hover:border-primary group-hover:shadow-primary/30 group-hover:-translate-y-1">
                                <Image
                                    src={game.thumbnail}
                                    alt={game.name}
                                    width={400}
                                    height={300}
                                    data-ai-hint={`${game.id} thumbnail`}
                                    className="w-full h-40 object-cover transition-transform duration-300 group-hover:scale-105"
                                />
                                <div className="p-4 bg-card">
                                    <h3 className="font-bold text-lg text-foreground">
                                        {game.name}
                                    </h3>
                                    <p className="text-sm text-primary font-semibold flex items-center">
                                        Play Now{" "}
                                        <ArrowRight className="ml-1 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                                    </p>
                                </div>
                            </Card>
                        </Link>
                    ))}
                </div>
            </section>
            <section className="text-center">
                <h2 className="font-headline text-3xl md:text-4xl font-bold mb-12">
                    Why Skilldex is Secure
                </h2>
                <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-8 text-center">
                    <div className="flex flex-col items-center">
                        <div className="mb-4 flex items-center justify-center h-16 w-16 rounded-full bg-primary/20 text-primary">
                            <ShieldCheck className="h-8 w-8" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">
                            On-Chain Escrow
                        </h3>
                        <p className="text-muted-foreground">
                            When a challenge is created, funds are sent to a
                            secure on-chain escrow account (a smart contract),
                            not to us or the other player.
                        </p>
                    </div>
                    <div className="flex flex-col items-center">
                        <div className="mb-4 flex items-center justify-center h-16 w-16 rounded-full bg-primary/20 text-primary">
                            <Lock className="h-8 w-8" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">
                            Automated Payouts
                        </h3>
                        <p className="text-muted-foreground">
                            The smart contract automatically releases the prize
                            to the winner's wallet once the game result is
                            confirmed. No manual intervention needed.
                        </p>
                    </div>
                    <div className="flex flex-col items-center">
                        <div className="mb-4 flex items-center justify-center h-16 w-16 rounded-full bg-primary/20 text-primary">
                            <Scaling className="h-8 w-8" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">
                            Decentralized & Transparent
                        </h3>
                        <p className="text-muted-foreground">
                            All transactions are recorded on the Solana
                            blockchain, making them fully transparent and
                            verifiable by anyone.
                        </p>
                    </div>
                </div>
            </section>
            <section id="game-rules-overview" className="scroll-mt-20">
                <h2 className="font-headline text-3xl md:text-4xl font-bold mb-12 text-center">
                    Game Rules Overview
                </h2>
                <div className="max-w-3xl mx-auto">
                    <Accordion type="single" collapsible className="w-full">
                        {games.map((game) => {
                            const rulesList = rules[game.id];
                            return (
                                <AccordionItem
                                    value={game.id.toString()}
                                    key={game.id}
                                >
                                    <AccordionTrigger className="text-xl hover:no-underline">
                                        <div className="flex items-center gap-3">
                                            <game.icon className="h-6 w-6 text-primary" />
                                            <span>{game.name}</span>
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent className="prose dark:prose-invert max-w-none">
                                        {rulesList.length > 1 ? (
                                            <ol className="list-decimal list-inside text-muted-foreground space-y-1 pl-4">
                                                {rulesList.map(
                                                    (rule, index) => (
                                                        <li key={index}>
                                                            {rule}
                                                        </li>
                                                    )
                                                )}
                                            </ol>
                                        ) : (
                                            <p className="text-muted-foreground">
                                                {rulesList[0]}
                                            </p>
                                        )}
                                    </AccordionContent>
                                </AccordionItem>
                            );
                        })}
                    </Accordion>
                </div>
            </section>
        </div>
    );
}

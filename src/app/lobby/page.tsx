'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { PlusSquare, Search, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import LobbiesTable from '@/components/lobby/lobbies-table';
import Announcements from '@/components/lobby/announcements';

import { useState, useMemo } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';

import { games } from '@/content/games';

import { GameState, GameType, Lobby } from '@/types/games';

export default function LobbyPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [gameType, setGameType] = useState<GameType>();
    const [minStake, setMinStake] = useState<string>('');
    const [maxStake, setMaxStake] = useState<string>('');

    // todo extract lobbyId from search params and set it as a search term

    const {
        data: lobbies,
        fetchNextPage,
        fetchPreviousPage,
        hasNextPage,
        hasPreviousPage,
    } = useInfiniteQuery({
        queryKey: ['lobby', 'all'],
        queryFn: async () => {
            // todo fetch all lobbies
            return {} as Lobby[];
        },
        getNextPageParam: (lastPage) => lastPage[lastPage.length - 1].id,
        initialPageParam: 0,
        initialData: { pages: [], pageParams: [] },
    });

    const filteredLobbies = useMemo(() => {
        // todo make dynamic
        let filtered = lobbies.pages[0];

        if (searchTerm) {
            filtered = filtered.filter(
                (challenge) =>
                    challenge.gameType
                        .toString()
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                    challenge.pool.token
                        .toString()
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                    challenge.creator.wallet.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    challenge.id.toString().toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (gameType) filtered = filtered.filter((challenge) => challenge.gameType == gameType);

        const parsedMinStake = parseFloat(minStake);
        if (!isNaN(parsedMinStake))
            filtered = filtered.filter((challenge) => challenge.pool.amount >= parsedMinStake);

        const parsedMaxStake = parseFloat(maxStake);
        if (!isNaN(parsedMaxStake))
            filtered = filtered.filter((challenge) => challenge.pool.amount <= parsedMaxStake);

        return filtered;
    }, [lobbies, searchTerm, gameType, minStake, maxStake]);

    return (
        <div className='space-y-8'>
            <div className='flex flex-col md:flex-row justify-between items-center gap-4'>
                <h1 className='font-headline text-3xl md:text-4xl font-bold tracking-tight text-center md:text-left'>
                    Live Challenge Lobby
                </h1>
                <Button
                    asChild
                    className='w-full md:w-auto bg-primary hover:bg-primary/90 text-primary-foreground'
                >
                    <Link href='/create-challenge' className='flex items-center px-4 py-2'>
                        <PlusSquare className='mr-2 h-5 w-5' />
                        <span className='font-medium'>Create New Challenge</span>
                    </Link>
                </Button>
            </div>
            <Announcements />
            <Accordion type='single' collapsible className='w-full'>
                <AccordionItem value='filters' className='border-b-0 rounded-lg shadow-sm bg-card'>
                    <AccordionTrigger className='px-4 sm:px-6 py-4 hover:no-underline'>
                        <div className='flex items-center text-xl font-semibold'>
                            <Filter className='mr-2 h-5 w-5 text-primary' />
                            Filters
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className='p-0'>
                        <div className='px-4 sm:px-6 pt-0 pb-4 space-y-4'>
                            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 items-end'>
                                <div>
                                    <Label htmlFor='game-filter' className='text-sm font-medium'>
                                        Game Type
                                    </Label>
                                    <Select
                                        value={gameType?.toString()}
                                        onValueChange={(value) => setGameType(Number(value))}
                                    >
                                        <SelectTrigger id='game-filter'>
                                            <SelectValue placeholder='Filter by game' />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value='all'>All Games</SelectItem>
                                            {games.map((game) => (
                                                <SelectItem
                                                    key={game.id}
                                                    value={game.id.toString()}
                                                >
                                                    {game.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <Label
                                        htmlFor='min-stake-filter'
                                        className='text-sm font-medium'
                                    >
                                        Min Stake (SOL/XNT)
                                    </Label>
                                    <Input
                                        id='min-stake-filter'
                                        type='number'
                                        placeholder='e.g., 0.1 or 1'
                                        value={minStake}
                                        onChange={(e) => setMinStake(e.target.value)}
                                        min='0'
                                        step='0.01'
                                    />
                                </div>
                                <div>
                                    <Label
                                        htmlFor='max-stake-filter'
                                        className='text-sm font-medium'
                                    >
                                        Max Stake (SOL/XNT)
                                    </Label>
                                    <Input
                                        id='max-stake-filter'
                                        type='number'
                                        placeholder='e.g., 10'
                                        value={maxStake}
                                        onChange={(e) => setMaxStake(e.target.value)}
                                        min='0'
                                        step='0.01'
                                    />
                                </div>
                            </div>
                            <div className='relative'>
                                <Label
                                    htmlFor='search-filter'
                                    className='text-sm font-medium sr-only'
                                >
                                    Search All
                                </Label>
                                <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none' />
                                <Input
                                    id='search-filter'
                                    placeholder='Search by game, token, challenger, or ID'
                                    className='pl-10'
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
            <Tabs defaultValue={GameState.Open.toString()} className='w-full'>
                <TabsList className='grid w-full grid-cols-3'>
                    <TabsTrigger value={GameState.Open.toString()}>Open Challenges</TabsTrigger>
                    <TabsTrigger value={GameState.Active.toString()}>Active Matches</TabsTrigger>
                    <TabsTrigger value={GameState.Finished.toString()}>Match History</TabsTrigger>
                </TabsList>
                {[GameState.Open, GameState.Active, GameState.Finished].map((state) => (
                    <TabsContent value={state.toString()} className='mt-4'>
                        <Card>
                            <CardContent className='p-0'>
                                <LobbiesTable lobbies={filteredLobbies} status={state} />
                            </CardContent>
                            <CardFooter className='flex justify-between items-center py-4 border-t'>
                                <Button
                                    variant='outline'
                                    size='sm'
                                    onClick={() => fetchPreviousPage()}
                                    disabled={hasPreviousPage}
                                >
                                    <ChevronLeft className='mr-2 h-4 w-4' /> Previous
                                </Button>
                                <Button
                                    variant='outline'
                                    size='sm'
                                    onClick={() => fetchNextPage()}
                                    disabled={hasNextPage}
                                >
                                    Next <ChevronRight className='ml-2 h-4 w-4' />
                                </Button>
                            </CardFooter>
                        </Card>
                    </TabsContent>
                ))}
            </Tabs>
        </div>
    );
}

'use client';

import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription as ShadCNCardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Gamepad2,
    Coins,
    Clock,
    Percent,
    Sparkles,
    Loader2,
    Timer,
    AlertTriangle,
    Trophy,
} from 'lucide-react';
import SuccessCreation from '@/components/create-lobby/success-creation';

import { useForm } from 'react-hook-form';
import useProgram from '@/hooks/use-program';
import { useWallet } from '@solana/wallet-adapter-react';
import { useSearchParams } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { useCallback, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';

import GameDatabase from '@/lib/firebase/games';
import { zodResolver } from '@hookform/resolvers/zod';
import { LobbyForm, lobbySchema } from '@/lib/zod';
import { addGame } from '@/lib/redux/slice/user';

import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import { EXPIRATION_OPTIONS, MIN_STAKE, PLATFORM_COMMISSION, TURN_LIMITS } from '@/utils/constants';
import { games } from '@/content/games';

import { getTokenName, Token } from '@/types/utils';
import { GameState, GameType, getMatchFormatName, Lobby, MatchFormat } from '@/types/games';

export default function CreateLobby() {
    const searchParams = useSearchParams();
    const stake = searchParams.get('stake');
    const gameTypeId = searchParams.get('gameTypeId');
    const matchFormatId = searchParams.get('matchFormatId');

    const dispatch = useAppDispatch();
    const user = useAppSelector((state) => state.userReducer);

    const { createLobby } = useProgram();
    const wallet = useWallet();

    const { toast } = useToast();

    const formatId = Number(matchFormatId ?? 0);
    const form = useForm<LobbyForm>({
        resolver: zodResolver(lobbySchema),
        defaultValues: {
            gameType: games.find((g) => g.id == Number(gameTypeId))?.id ?? GameType.TicTacToe,
            token: Token.SOL,
            stake: Number(stake) ?? MIN_STAKE,
            expiration: EXPIRATION_OPTIONS[0].id,
            turnTimeLimit: TURN_LIMITS[0].id,
            matchFormat: Object.values(MatchFormat).includes(formatId)
                ? (formatId as MatchFormat)
                : MatchFormat.Single,
        },
    });

    const watchedStake = form.watch('stake');

    const [lobby, setLobby] = useState<Lobby>();
    const handleLobbyCreation = useCallback(
        async (form: LobbyForm) => {
            if (!wallet.publicKey) return;

            const initialBet = Math.floor(form.stake * LAMPORTS_PER_SOL);
            const expirationTime = form.expiration;
            const turnTime = Number(form.turnTimeLimit);

            const response = await createLobby(form.gameType, initialBet, expirationTime);

            if (!response) {
                toast({
                    title: 'Tx Error',
                    description: 'An issue occured during transaction.',
                    variant: 'destructive',
                });
                return;
            }

            const lobby: Lobby = {
                id: response.lobbyId.toNumber(),
                state: GameState.Open,
                gameType: form.gameType,
                format: form.matchFormat,

                pool: {
                    initial: initialBet,
                    token: Token.SOL,
                },

                creator: {
                    wallet: wallet.publicKey?.toString(),
                    score: 0,
                    txSignature: response.signature,
                },

                timeLimit: turnTime,
                createdAt: Date.now(),
                expirationTime: Date.now() + expirationTime,
            };

            if (user.name) lobby.creator.name = user.name;
            if (user.avatar) lobby.creator.avatar = user.avatar;

            try {
                await dispatch(addGame({ gameType: 'created' }));
                await GameDatabase.createLobby(lobby);
            } catch (error) {
                toast({
                    title: 'Database Error',
                    description: 'An issue occured during saving your data.',
                    variant: 'destructive',
                });
            }

            setLobby(lobby);
        },
        [wallet, user, lobby]
    );

    if (lobby) return <SuccessCreation lobby={lobby} />;

    return (
        <div className='max-w-2xl mx-auto p-4 sm:p-0'>
            <Card className='shadow-xl'>
                <CardHeader className='text-center'>
                    <Sparkles className='mx-auto h-10 w-10 sm:h-12 sm:w-12 text-primary mb-2' />
                    <CardTitle className='font-headline text-2xl sm:text-3xl'>
                        Create New Challenge
                    </CardTitle>
                    <ShadCNCardDescription>
                        Set up your game, stake your token, and an on-chain escrow will be created
                        for the match.
                    </ShadCNCardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(handleLobbyCreation)}
                            className='space-y-6'
                        >
                            <FormField
                                control={form.control}
                                name='gameType'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className='flex items-center'>
                                            <Gamepad2 className='mr-2 h-5 w-5 text-primary' />{' '}
                                            Select Game
                                        </FormLabel>
                                        <FormControl>
                                            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-2'>
                                                {games.map((game) => {
                                                    const isSelected = field.value === game.id;
                                                    return (
                                                        <Button
                                                            key={game.id}
                                                            type='button'
                                                            variant={
                                                                isSelected ? 'default' : 'outline'
                                                            }
                                                            onClick={() => field.onChange(game.id)}
                                                            className='h-auto py-4 px-4 flex flex-col items-center justify-center space-y-2 text-center transition-all duration-200 ease-in-out rounded-lg border hover:shadow-primary/20 transform hover:scale-105'
                                                        >
                                                            <game.icon
                                                                className={`h-8 w-8 mb-1 ${
                                                                    isSelected
                                                                        ? 'text-primary-foreground'
                                                                        : 'text-primary'
                                                                }`}
                                                            />
                                                            <span
                                                                className={`text-sm font-medium ${
                                                                    isSelected
                                                                        ? 'text-primary-foreground'
                                                                        : 'text-card-foreground'
                                                                }`}
                                                            >
                                                                {game.name}
                                                            </span>
                                                        </Button>
                                                    );
                                                })}
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name='matchFormat'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className='flex items-center'>
                                            <Trophy className='mr-2 h-5 w-5 text-primary' /> Match
                                            Format
                                        </FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            value={field.value.toString()}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder='Select match format' />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {Object.values(MatchFormat).map((option) => (
                                                    <SelectItem
                                                        key={option}
                                                        value={option.toString()}
                                                    >
                                                        {getMatchFormatName(option as MatchFormat)}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormDescription>
                                            Choose if it's a single game or a series.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name='token'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className='flex items-center'>
                                            <Coins className='mr-2 h-5 w-5 text-primary' /> Select
                                            Token
                                        </FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            value={field.value.toString()}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder='Choose token for staking' />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem
                                                    key={Token.SOL}
                                                    value={Token.SOL.toString()}
                                                >
                                                    SOL
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name='stake'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className='flex items-center'>
                                            <Coins className='mr-2 h-5 w-5 text-primary' /> Stake
                                            Amount ({form.getValues('token')})
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                type='number'
                                                step={'0.01'}
                                                min={MIN_STAKE}
                                                {...field}
                                                onChange={(e) => {
                                                    const value = e.target.value;
                                                    field.onChange(
                                                        value == '' ? '' : parseFloat(value)
                                                    );
                                                }}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className='p-3 bg-muted/50 rounded-md text-sm space-y-1'>
                                <p className='flex justify-between'>
                                    <span>Your Stake:</span>
                                    <span className='font-semibold'>
                                        {watchedStake} {getTokenName(form.getValues('token'))}
                                    </span>
                                </p>
                                <p className='flex justify-between'>
                                    <span className='flex items-center'>
                                        <Percent className='mr-1 h-4 w-4 text-muted-foreground' />
                                        Platform Fee ({PLATFORM_COMMISSION}% of total pool):
                                    </span>
                                    <span className='font-semibold'>
                                        {(watchedStake / 100) * PLATFORM_COMMISSION}{' '}
                                        {getTokenName(form.getValues('token'))}
                                    </span>
                                </p>
                                <p className='flex justify-between font-bold text-primary'>
                                    <span>Net Prize for Winner:</span>
                                    <span>
                                        {watchedStake * 2 -
                                            (watchedStake / 100) * PLATFORM_COMMISSION}{' '}
                                        {getTokenName(form.getValues('token'))}
                                    </span>
                                </p>
                                <p className='text-xs text-muted-foreground pt-1'>
                                    Note: Standard network transaction fees will also apply for
                                    blockchain interactions.
                                </p>
                            </div>

                            <FormField
                                control={form.control}
                                name='expiration'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className='flex items-center'>
                                            <Clock className='mr-2 h-5 w-5 text-primary' />{' '}
                                            Challenge Expiration
                                        </FormLabel>
                                        <Select
                                            onValueChange={(value) => field.onChange(Number(value))}
                                            defaultValue={field.value.toString()}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder='Set challenge duration' />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {EXPIRATION_OPTIONS.map((option) => (
                                                    <SelectItem
                                                        key={option.id}
                                                        value={option.id.toString()}
                                                    >
                                                        {option.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormDescription>
                                            How long this challenge will remain open for others to
                                            join.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name='turnTimeLimit'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className='flex items-center'>
                                            <Timer className='mr-2 h-5 w-5 text-primary' /> Turn
                                            Time Limit
                                        </FormLabel>
                                        <Select
                                            onValueChange={(value) => field.onChange(Number(value))}
                                            defaultValue={field.value.toString()}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder='Set time limit per turn' />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {TURN_LIMITS.map((option) => (
                                                    <SelectItem
                                                        key={option.id}
                                                        value={option.id.toString()}
                                                    >
                                                        {option.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormDescription className='flex items-center gap-1'>
                                            <AlertTriangle className='h-4 w-4 text-destructive' />
                                            Maximum time per turn. Exceeding this limit may result
                                            in a forfeit.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <Button
                                type='submit'
                                className='w-full bg-accent hover:bg-accent/90 text-accent-foreground text-lg py-4 md:py-6'
                                disabled={!wallet.connected || form.formState.isSubmitting}
                            >
                                {form.formState.isSubmitting ? (
                                    <>
                                        <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                                        Processing...
                                    </>
                                ) : (
                                    'Stake & Create Challenge'
                                )}
                            </Button>
                            {!wallet.connected && (
                                <p className='text-sm text-center text-destructive'>
                                    Please connect your wallet to create a challenge.
                                </p>
                            )}
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}

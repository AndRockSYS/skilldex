import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useToast } from '../use-toast';
import { useQuery } from '@tanstack/react-query';
import { useAppDispatch } from '@/lib/redux/hooks';
import useTab from './use-tab';
import { useWallet } from '@solana/wallet-adapter-react';
import useNotifications from './use-notifications';

import GameDatabase from '@/lib/firebase/games';
import { addGame } from '@/lib/redux/slice/user';

import { formatWallet } from '@/utils/formatter';
import { findSeriesWinner } from '@/utils/game-utils';

import { GameState, getGameName } from '@/types/games';

export default function useGameProcessing(gameId: number) {
    const { toast } = useToast();
    const router = useRouter();

    const { publicKey } = useWallet();
    const dispatch = useAppDispatch();

    const { isTabVisible } = useTab();
    const { notificationPermission, soundRef, playTurnSound } = useNotifications();
    const [turnTimeLeft, setTimeLeft] = useState(0);

    const { data: gameData, refetch: refetchGameData } = useQuery({
        queryKey: ['game', gameId],
        queryFn: async () => await GameDatabase.fetchLobbyById(gameId),
        throwOnError: (error) => {
            toast({
                title: 'Error',
                description: 'Game not found in demo data.',
                variant: 'destructive',
            });
            router.push('/lobby');
            throw error;
        },
        enabled: !!gameId,
        refetchInterval: 2_000,
    });

    const { data: turn } = useQuery({
        queryKey: ['game', gameId, 'turn'],
        queryFn: async () => await GameDatabase.fetchTurn(gameId),
        enabled: gameData?.state == GameState.Active,
        refetchInterval: 1_000,
    });

    const { data: emojis } = useQuery({
        queryKey: ['game', gameId, 'emojis'],
        queryFn: async () => {
            const emojis = await GameDatabase.fetchEmojis(gameId);
            return emojis.sort((a, b) => a.timestamp - b.timestamp);
        },
        enabled: gameData?.state == GameState.Active,
        refetchInterval: 1_000,
        initialData: [],
    });

    const isSpectator = useMemo(() => {
        if (!publicKey || !gameData) return true;
        return (
            gameData.creator.wallet != publicKey.toString() &&
            gameData.opponent?.wallet != publicKey.toString()
        );
    }, [gameData, publicKey]);

    // Handles turn timer
    useEffect(() => {
        if (!gameData || !turn || gameData.state != GameState.Active) return;

        const endTimestamp = turn.turnStart + gameData.timeLimit;
        const timeLeft = Math.max(endTimestamp - Date.now(), 0);

        if (timeLeft == 0) {
            endTurn();
            return;
        }

        const timer = setInterval(() => setTimeLeft(timeLeft), 400);
        return () => clearInterval(timer);
    }, [gameData, turn, turnTimeLeft]);

    const endTurn = useCallback(async () => {
        if (!gameData || !gameData.opponent || !turn) return;

        const turnGoesTo =
            turn?.playerWallet == gameData.creator.wallet
                ? gameData.opponent.wallet
                : gameData.creator.wallet;

        const endTimestamp = turn.turnStart + gameData.timeLimit;
        const timeLeft = Math.max(endTimestamp - Date.now(), 0);

        // todo end round at some point, depending on the game

        if (timeLeft == 0) {
            toast({
                title: 'Turn Timed Out!',
                description: `${turnGoesTo} wins this game.`,
                variant: 'destructive',
                duration: 5000,
            });
            await endRound(turnGoesTo);
        } else await GameDatabase.updateTurn(gameData.id, turnGoesTo);
    }, [turn, gameData]);

    const endRound = useCallback(
        async (roundWinner: string) => {
            if (!gameData || !gameData.opponent) return;

            const side = roundWinner == gameData.creator.wallet ? 'creator' : 'opponent';

            const updatedGameData = { ...gameData };
            if (!updatedGameData[side]) return;

            updatedGameData[side].score += 1;
            await GameDatabase.updateScore(gameData.id, side, updatedGameData[side].score);

            await refetchGameData();

            const seriesWinner = findSeriesWinner(updatedGameData);
            if (seriesWinner) endSeries(seriesWinner);
            else {
                // todo start a new round
            }
        },
        [gameData]
    );

    const endSeries = useCallback(
        async (seriesWinner: string) => {
            if (!gameData || gameData.winner || !publicKey) return;

            toast({
                title: 'Match Over!',
                description: `${formatWallet(seriesWinner)} wins the series!`,
                variant: 'default',
                duration: 3_000,
            });

            await GameDatabase.updateWinner(gameData.id, seriesWinner);
            await GameDatabase.clearGameData(gameData.id);

            if (isSpectator) router.push('/lobby');
            else {
                await dispatch(
                    addGame({ gameType: seriesWinner == publicKey.toString() ? 'won' : 'played' })
                );
                router.push(`/game/${gameData.id}/result`);
            }
        },
        [gameData, publicKey, isSpectator]
    );

    useEffect(() => {
        if (typeof window == 'undefined' || !turn || !publicKey || !gameData) return;

        const isEffectivelyOffline = !isTabVisible;
        if (turn.playerWallet == publicKey.toString()) {
            playTurnSound();

            if (isEffectivelyOffline && notificationPermission == 'granted') {
                const notification = new Notification(`It's your turn!`, {
                    body: `Time to make your move in ${getGameName(
                        gameData.gameType
                    )} on SKILLDEX.IO.`,
                    icon: '/logo.png',
                    tag: `skilldex-io-turn-${gameId}`,
                });
                notification.onclick = () => {
                    window.focus();
                    router.push(`/game/${gameId}`);
                    notification.close();
                };
            }
        }
    }, [publicKey, turn, gameData?.gameType]);

    return { gameData, turn, emojis, turnTimeLeft, endTurn, soundRef };
}

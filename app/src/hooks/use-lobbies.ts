import { useInfiniteQuery } from "@tanstack/react-query";
import { useWallet } from "@solana/wallet-adapter-react";
import { useCallback, useEffect, useMemo, useState } from "react";

import GameDatabase from "@/lib/firebase/games";

import { TableGameState, GameType, Lobby, GameState } from "@/types/games";

export default function useLobbies(gameType: GameType, state: TableGameState) {
    const { publicKey } = useWallet();

    const [page, setPage] = useState(0);

    useEffect(() => {
        setPage(0);
    }, [gameType, state]);

    const {
        data: lobbies,
        fetchNextPage: fetchNext,
        hasPreviousPage,
        fetchPreviousPage: fetchPrevious,
    } = useInfiniteQuery<Lobby[], Error>({
        queryKey: ["lobby", publicKey, state, gameType],
        queryFn: async ({ pageParam }) => {
            let data: Lobby[] = [];

            if (state == TableGameState.User) {
                const lobbies = await GameDatabase.fetchUserLobbies(
                    (publicKey as any).toString(),
                    pageParam as number | undefined
                );

                const temp = [];
                for (let lobby of lobbies) {
                    try {
                        const turn = await GameDatabase.fetchTurn(lobby.id);
                        temp.push({ ...lobby, ...turn });
                    } catch (error) {
                        temp.push({ ...lobby, turn: undefined });
                    }
                }

                data = temp;
            } else {
                data = await GameDatabase.fetchLobbies(
                    state as unknown as GameState,
                    gameType,
                    pageParam as number | undefined
                );
            }

            return data;
        },
        getNextPageParam: (lastPageLobbies) => {
            if (lastPageLobbies.length === 0) return undefined;
            return lastPageLobbies[lastPageLobbies.length - 1].createdAt;
        },
        initialPageParam: undefined,
        initialData: { pages: [[]], pageParams: [undefined] },
        refetchInterval: 3_000,
    });

    const fetchNextPage = useCallback(
        () => fetchNext().then(() => setPage(page + 1)),
        [page, lobbies]
    );

    const fetchPreviousPage = useCallback(
        () => fetchPrevious().then(() => setPage(page - 1)),
        [page, lobbies]
    );

    const hasNextPage = useMemo(
        () =>
            lobbies.pages[page] != undefined &&
            lobbies.pages[page].length == 10,
        [lobbies, page]
    );

    return {
        lobbies,
        fetchNextPage,
        hasPreviousPage,
        hasNextPage,
        fetchPreviousPage,
        page,
    };
}

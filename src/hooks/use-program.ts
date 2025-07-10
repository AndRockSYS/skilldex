import { useAnchorWallet } from '@solana/wallet-adapter-react';
import { useCallback, useMemo, useState } from 'react';
import { useToast } from './use-toast';

import { getPlatform } from '@/actions';

import { getPlatformPubKey, initProgram, parseEventLogs } from '@/lib/solana';
import { BorshCoder, web3, BN } from '@coral-xyz/anchor';

import { IDL } from '@/data/program-idl';
import { connection } from '@/config/solana';

import { convertGameType } from '@/utils/formatter';

import { PublicKey, Transaction } from '@solana/web3.js';
import { GameType } from '@/types/games';

const useProgram = () => {
    const { toast } = useToast();
    const [isProcessing, setIsProcessing] = useState(false);

    const wallet = useAnchorWallet();
    const program = useMemo(() => (wallet ? initProgram(wallet) : undefined), [wallet]);

    const completeTransaction = useCallback(
        async (tx: Transaction, platform?: web3.Keypair) => {
            try {
                if (!wallet) return;

                let { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();
                tx.lastValidBlockHeight = lastValidBlockHeight + 50;
                tx.recentBlockhash = blockhash;
                tx.feePayer = wallet.publicKey;

                const signed = await wallet.signTransaction(tx);
                if (platform) signed.partialSign(platform);

                const txId = await connection.sendRawTransaction(signed.serialize());
                const confirmation = await connection.confirmTransaction(
                    {
                        signature: txId,
                        blockhash,
                        lastValidBlockHeight,
                    },
                    'confirmed'
                );

                if (confirmation.value.err) throw new Error(confirmation.value.err.toString());

                return { signature: txId, error: confirmation.value.err?.toString() };
            } catch (error: any) {
                console.error(error);
                toast({
                    title: 'Tx Error',
                    description: error.message ?? 'Your transaction was not submitted.',
                    variant: 'destructive',
                });
            } finally {
                setIsProcessing(false);
            }
        },
        [wallet]
    );

    const createLobby = useCallback(
        async (gameType: GameType, bet: number, expireTime: number) => {
            if (!wallet?.publicKey || !program) {
                toast({
                    title: 'Wallet Not Connected',
                    description: 'Please connect your wallet.',
                    variant: 'destructive',
                });
                return;
            }
            setIsProcessing(true);

            const platformSigner = web3.Keypair.fromSecretKey(await getPlatform());

            const tx = await program.methods
                .createLobby(
                    convertGameType(gameType),
                    new BN(bet),
                    new BN(Math.floor(expireTime / 1000))
                )
                .accounts({
                    //@ts-expect-error
                    platformSigner: platformSigner.publicKey,
                    player: wallet.publicKey,
                })
                .transaction();

            const data = await completeTransaction(tx, platformSigner);
            if (!data || data.error) return;

            const logs = await parseEventLogs(connection, data.signature, program);
            for (let event of logs) {
                if (event.name == 'lobbyCreation')
                    return { lobbyId: event.data.lobbyId, signature: data.signature };
            }
        },
        [wallet, program]
    );

    const joinLobby = useCallback(
        async (lobbyId: number) => {
            if (!wallet?.publicKey || !program) {
                toast({
                    title: 'Wallet Not Connected',
                    description: 'Please connect your wallet.',
                    variant: 'destructive',
                });
                return;
            }
            setIsProcessing(true);

            const platformSigner = web3.Keypair.fromSecretKey(await getPlatform());

            const tx = await program.methods
                .joinLobby(new BN(lobbyId))
                .accounts({
                    //@ts-expect-error
                    platformSigner: platformSigner.publicKey,
                    player: wallet.publicKey,
                })
                .transaction();

            return await completeTransaction(tx, platformSigner);
        },
        [connection, wallet]
    );

    const closeLobby = useCallback(
        async (lobbyId: number) => {
            if (!wallet?.publicKey || !program) {
                toast({
                    title: 'Wallet Not Connected',
                    description: 'Please connect your wallet.',
                    variant: 'destructive',
                });
                return;
            }
            setIsProcessing(true);

            const tx = await program.methods
                .closeLobbyAsPlayer(new BN(lobbyId))
                .accounts({
                    player: wallet.publicKey,
                })
                .transaction();

            return await completeTransaction(tx);
        },
        [wallet]
    );

    const declareWinner = useCallback(
        async (lobbyId: number) => {
            if (!wallet?.publicKey || !program) {
                toast({
                    title: 'Wallet Not Connected',
                    description: 'Please connect your wallet.',
                    variant: 'destructive',
                });
                return;
            }
            setIsProcessing(true);

            const platformSigner = web3.Keypair.fromSecretKey(await getPlatform());

            const tx = await program.methods
                .declareWinner(new BN(lobbyId))
                .accounts({
                    //@ts-expect-error
                    platformSigner: platformSigner.publicKey,
                    winner: wallet.publicKey,
                })
                .transaction();

            return await completeTransaction(tx, platformSigner);
        },
        [wallet]
    );

    const fetchPlatformData = useCallback(async (): Promise<{
        platform_signer: PublicKey;
        current_id: BN;
        balance: BN;
    }> => {
        const coder = new BorshCoder(IDL as any);

        const accountInfo = await connection.getAccountInfo(getPlatformPubKey());
        if (!accountInfo) throw new Error('Account not found');

        return coder.accounts.decode('Platform', accountInfo.data);
    }, [wallet]);

    // * Admin actions only

    const initializePlatform = useCallback(async () => {
        if (!wallet?.publicKey || !program) {
            toast({
                title: 'Wallet Not Connected',
                description: 'Please connect your wallet.',
                variant: 'destructive',
            });
            return;
        }
        setIsProcessing(true);

        const tx = await program.methods
            .initializePlatform()
            .accounts({
                platformSigner: wallet.publicKey,
            })
            .transaction();

        return await completeTransaction(tx);
    }, [wallet]);

    const updatePlatform = useCallback(
        async (newSigner: PublicKey) => {
            if (!wallet?.publicKey || !program) {
                toast({
                    title: 'Wallet Not Connected',
                    description: 'Please connect your wallet.',
                    variant: 'destructive',
                });
                return;
            }
            setIsProcessing(true);

            const platformSigner = web3.Keypair.fromSecretKey(await getPlatform());

            const tx = await program.methods
                .updatePlatformSigner()
                .accounts({
                    //@ts-expect-error
                    platformSigner: platformSigner.publicKey,
                    newPlatformSigner: newSigner,
                })
                .transaction();

            return await completeTransaction(tx, platformSigner);
        },
        [wallet]
    );

    const withdrawCommission = useCallback(async () => {
        if (!wallet?.publicKey || !program) {
            toast({
                title: 'Wallet Not Connected',
                description: 'Please connect your wallet.',
                variant: 'destructive',
            });
            return;
        }
        setIsProcessing(true);

        const platformSigner = web3.Keypair.fromSecretKey(await getPlatform());

        const tx = await program.methods
            .withdrawCommission()
            .accounts({
                platformSigner: platformSigner.publicKey,
            })
            .transaction();

        return await completeTransaction(tx, platformSigner);
    }, [wallet]);

    const closeLobbyPlatform = useCallback(
        async (lobbyId: number, creator: PublicKey) => {
            if (!wallet?.publicKey || !program) {
                toast({
                    title: 'Wallet Not Connected',
                    description: 'Please connect your wallet.',
                    variant: 'destructive',
                });
                return;
            }
            setIsProcessing(true);

            const platformSigner = web3.Keypair.fromSecretKey(await getPlatform());

            const tx = await program.methods
                .closeLobbyAsPlatform(new BN(lobbyId))
                .accounts({
                    //@ts-expect-error
                    platformSigner: platformSigner.publicKey,
                    playerAccount: creator,
                })
                .transaction();

            return await completeTransaction(tx, platformSigner);
        },
        [wallet]
    );

    return {
        createLobby,
        closeLobby,
        joinLobby,
        initializePlatform,
        updatePlatform,
        withdrawCommission,
        declareWinner,
        closeLobbyPlatform,
        fetchPlatformData,
        isProcessing,
    };
};

export default useProgram;

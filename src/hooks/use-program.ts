import { useAnchorWallet, useConnection } from '@solana/wallet-adapter-react';
import { useCallback, useState } from 'react';
import { useToast } from './use-toast';

import { getPlatform } from '@/actions';

import { getPlatformPubKey, initProgram, parseEventLogs } from '@/lib/solana';
import { web3 } from '@coral-xyz/anchor';
import { bs58 } from '@coral-xyz/anchor/dist/cjs/utils/bytes';

import { PublicKey, Transaction } from '@solana/web3.js';
import { GameType } from '@/types/games';

const useProgram = () => {
    const { toast } = useToast();
    const { connection } = useConnection();
    const wallet = useAnchorWallet();

    const [isProcessing, setIsProcessing] = useState(false);

    const completeTransaction = useCallback(
        async (tx: Transaction) => {
            try {
                if (!wallet) return;

                const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();
                tx.recentBlockhash = blockhash;
                tx.feePayer = wallet.publicKey;

                const signed = await wallet.signTransaction(tx);
                if (!signed.signature) throw new Error('Signing error');
                const signature = bs58.encode(signed.signature);

                const confirmed = await connection.confirmTransaction(
                    {
                        signature,
                        blockhash,
                        lastValidBlockHeight,
                    },
                    'confirmed'
                );

                return { signature, error: confirmed.value.err?.toString() };
            } catch (error) {
                toast({
                    title: 'Tx Error',
                    description: 'Your transaction was not submitted.',
                    variant: 'destructive',
                });
            } finally {
                setIsProcessing(false);
            }
        },
        [connection, wallet]
    );

    const createLobby = useCallback(
        async (gameType: GameType, bet: number, expireTime: number) => {
            setIsProcessing(true);
            if (!wallet?.publicKey) {
                toast({
                    title: 'Wallet Not Connected',
                    description: 'Please connect your wallet.',
                    variant: 'destructive',
                });
                return;
            }

            const platform_signer = web3.Keypair.fromSecretKey(await getPlatform());

            const program = initProgram(wallet, connection);
            const tx = await program.methods
                .createLobby(gameType, bet, expireTime)
                .accounts({
                    //@ts-ignore
                    platform_signer: platform_signer.publicKey,
                    player: wallet.publicKey,
                })
                .signers([platform_signer])
                .transaction();

            const data = await completeTransaction(tx);
            if (!data || data.error) return;

            const logs = await parseEventLogs(connection, data.signature, program);
            for (let event of logs) {
                if (event.name == 'LobbyCreation')
                    return { lobbyId: event.data.lobby_id, signature: data.signature };
            }
        },
        [connection, wallet]
    );

    const joinLobby = useCallback(
        async (lobbyId: number) => {
            if (!wallet?.publicKey) {
                toast({
                    title: 'Wallet Not Connected',
                    description: 'Please connect your wallet.',
                    variant: 'destructive',
                });
                return;
            }
            setIsProcessing(true);

            const platform_signer = web3.Keypair.fromSecretKey(await getPlatform());

            const tx = await initProgram(wallet, connection)
                .methods.joinLobby(lobbyId)
                .accounts({
                    //@ts-ignore
                    platform_signer: platform_signer.publicKey,
                    player: wallet.publicKey,
                })
                .signers([platform_signer])
                .transaction();

            return await completeTransaction(tx);
        },
        [connection, wallet]
    );

    const closeLobby = useCallback(
        async (lobbyId: number) => {
            if (!wallet?.publicKey) {
                toast({
                    title: 'Wallet Not Connected',
                    description: 'Please connect your wallet.',
                    variant: 'destructive',
                });
                return;
            }
            setIsProcessing(true);

            const tx = await initProgram(wallet, connection)
                .methods.closeLobbyAsPlayer(lobbyId)
                .accounts({
                    player: wallet.publicKey,
                })
                .transaction();

            return await completeTransaction(tx);
        },
        [connection, wallet]
    );

    const declareWinner = useCallback(
        async (lobbyId: number) => {
            if (!wallet?.publicKey) {
                toast({
                    title: 'Wallet Not Connected',
                    description: 'Please connect your wallet.',
                    variant: 'destructive',
                });
                return;
            }
            setIsProcessing(true);

            const platform_signer = web3.Keypair.fromSecretKey(await getPlatform());

            const tx = await initProgram(wallet, connection)
                .methods.declareWinner(lobbyId)
                .accounts({
                    //@ts-ignore
                    platform_signer: platform_signer.publicKey,
                    winner: wallet.publicKey,
                })
                .signers([platform_signer])
                .transaction();
            setIsProcessing(true);

            return await completeTransaction(tx);
        },
        [connection, wallet]
    );

    const fetchPlatformData = useCallback(async () => {
        if (!wallet?.publicKey) {
            toast({
                title: 'Wallet Not Connected',
                description: 'Please connect your wallet.',
                variant: 'destructive',
            });
            return;
        }

        const platformAccount = await initProgram(wallet, connection).account.platform.fetch(
            getPlatformPubKey()
        );

        return platformAccount;
    }, [wallet, connection]);

    // * Admin actions only

    const updatePlatform = useCallback(async (newSigner: PublicKey) => {
        if (!wallet?.publicKey) {
            toast({
                title: 'Wallet Not Connected',
                description: 'Please connect your wallet.',
                variant: 'destructive',
            });
            return;
        }
        setIsProcessing(true);

        const platform_signer = web3.Keypair.fromSecretKey(await getPlatform());

        const tx = await initProgram(wallet, connection)
            .methods.updatePlatformSigner()
            .accounts({
                //@ts-ignore
                platform_signer: platform_signer.publicKey,
                newPlatformSigner: newSigner,
            })
            .signers([platform_signer])
            .transaction();
        setIsProcessing(true);

        return await completeTransaction(tx);
    }, []);

    const withdrawCommission = useCallback(async () => {
        if (!wallet?.publicKey) {
            toast({
                title: 'Wallet Not Connected',
                description: 'Please connect your wallet.',
                variant: 'destructive',
            });
            return;
        }
        setIsProcessing(true);

        const platform_signer = web3.Keypair.fromSecretKey(await getPlatform());

        const tx = await initProgram(wallet, connection)
            .methods.withdrawCommission()
            .accounts({
                //@ts-ignore
                platform_signer: platform_signer.publicKey,
            })
            .signers([platform_signer])
            .transaction();
        setIsProcessing(true);

        return await completeTransaction(tx);
    }, []);

    const closeLobbyPlatform = useCallback(async (lobbyId: number, creator: PublicKey) => {
        if (!wallet?.publicKey) {
            toast({
                title: 'Wallet Not Connected',
                description: 'Please connect your wallet.',
                variant: 'destructive',
            });
            return;
        }
        setIsProcessing(true);

        const platform_signer = web3.Keypair.fromSecretKey(await getPlatform());

        const tx = await initProgram(wallet, connection)
            .methods.closeLobbyAsPlatform(lobbyId)
            .accounts({
                //@ts-ignore
                platform_signer: platform_signer.publicKey,
                playerAccount: creator,
            })
            .signers([platform_signer])
            .transaction();
        setIsProcessing(true);

        return await completeTransaction(tx);
    }, []);

    return {
        createLobby,
        closeLobby,
        joinLobby,
        updatePlatform,
        withdrawCommission,
        declareWinner,
        closeLobbyPlatform,
        fetchPlatformData,
        isProcessing,
    };
};

export default useProgram;

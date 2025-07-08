import { useAnchorWallet } from '@solana/wallet-adapter-react';
import { useCallback, useState } from 'react';
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
    const wallet = useAnchorWallet();

    const [isProcessing, setIsProcessing] = useState(false);

    const completeTransaction = useCallback(
        async (tx: Transaction) => {
            try {
                if (!wallet) return;

                let { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();
                tx.lastValidBlockHeight = lastValidBlockHeight + 50;
                tx.recentBlockhash = blockhash;
                tx.feePayer = wallet.publicKey;

                const signed = await wallet.signTransaction(tx);

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
                console.log(error);
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
            setIsProcessing(true);
            if (!wallet?.publicKey) {
                toast({
                    title: 'Wallet Not Connected',
                    description: 'Please connect your wallet.',
                    variant: 'destructive',
                });
                return;
            }

            const platformSigner = web3.Keypair.fromSecretKey(await getPlatform());

            const program = initProgram(wallet);
            const tx = await program.methods
                .createLobby(
                    convertGameType(gameType),
                    new BN(bet),
                    new BN(Math.floor(expireTime / 1000))
                )
                .accounts({
                    //@ts-ignore
                    platformSigner: platformSigner.publicKey,
                    player: wallet.publicKey,
                })
                .signers([platformSigner])
                .transaction();

            const data = await completeTransaction(tx);
            if (!data || data.error) return;

            const logs = await parseEventLogs(connection, data.signature, program);
            for (let event of logs) {
                if (event.name == 'lobbyCreation')
                    return { lobbyId: event.data.lobbyId, signature: data.signature };
            }
        },
        [wallet]
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

            const platformSigner = web3.Keypair.fromSecretKey(await getPlatform());

            const tx = await initProgram(wallet)
                .methods.joinLobby(lobbyId)
                .accounts({
                    //@ts-ignore
                    platformSigner: platformSigner.publicKey,
                    player: wallet.publicKey,
                })
                .signers([platformSigner])
                .transaction();

            return await completeTransaction(tx);
        },
        [wallet]
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

            const tx = await initProgram(wallet)
                .methods.closeLobbyAsPlayer(lobbyId)
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
            if (!wallet?.publicKey) {
                toast({
                    title: 'Wallet Not Connected',
                    description: 'Please connect your wallet.',
                    variant: 'destructive',
                });
                return;
            }
            setIsProcessing(true);

            const platformSigner = web3.Keypair.fromSecretKey(await getPlatform());

            const tx = await initProgram(wallet)
                .methods.declareWinner(lobbyId)
                .accounts({
                    //@ts-ignore
                    platformSigner: platformSigner.publicKey,
                    winner: wallet.publicKey,
                })
                .signers([platformSigner])
                .transaction();

            return await completeTransaction(tx);
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
        if (!wallet?.publicKey) {
            toast({
                title: 'Wallet Not Connected',
                description: 'Please connect your wallet.',
                variant: 'destructive',
            });
            return;
        }
        setIsProcessing(true);

        const tx = await initProgram(wallet)
            .methods.initializePlatform()
            .accounts({
                platformSigner: wallet.publicKey,
            })
            .transaction();

        return await completeTransaction(tx);
    }, [wallet]);

    const updatePlatform = useCallback(
        async (newSigner: PublicKey) => {
            if (!wallet?.publicKey) {
                toast({
                    title: 'Wallet Not Connected',
                    description: 'Please connect your wallet.',
                    variant: 'destructive',
                });
                return;
            }
            setIsProcessing(true);

            const platformSigner = web3.Keypair.fromSecretKey(await getPlatform());

            const tx = await initProgram(wallet)
                .methods.updatePlatformSigner()
                .accounts({
                    //@ts-ignore
                    platformSigner: platformSigner.publicKey,
                    newPlatformSigner: newSigner,
                })
                .signers([platformSigner])
                .transaction();

            return await completeTransaction(tx);
        },
        [wallet]
    );

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

        const platformSigner = web3.Keypair.fromSecretKey(await getPlatform());

        const tx = await initProgram(wallet)
            .methods.withdrawCommission()
            .accounts({
                platformSigner: platformSigner.publicKey,
            })
            .signers([platformSigner])
            .transaction();

        return await completeTransaction(tx);
    }, [wallet]);

    const closeLobbyPlatform = useCallback(
        async (lobbyId: number, creator: PublicKey) => {
            if (!wallet?.publicKey) {
                toast({
                    title: 'Wallet Not Connected',
                    description: 'Please connect your wallet.',
                    variant: 'destructive',
                });
                return;
            }
            setIsProcessing(true);

            const platformSigner = web3.Keypair.fromSecretKey(await getPlatform());

            const tx = await initProgram(wallet)
                .methods.closeLobbyAsPlatform(lobbyId)
                .accounts({
                    //@ts-ignore
                    platformSigner: platformSigner.publicKey,
                    playerAccount: creator,
                })
                .signers([platformSigner])
                .transaction();

            return await completeTransaction(tx);
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

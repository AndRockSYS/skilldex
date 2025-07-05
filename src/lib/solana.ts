import { clusterApiUrl, Connection, PublicKey } from '@solana/web3.js';
import { AnchorWallet } from '@solana/wallet-adapter-react';
import { AnchorProvider, Program } from '@coral-xyz/anchor';

import { IDL, Skilldex } from '@/data/program-idl';
import { PDA_AFFIXES } from '@/utils/constants';

export const clusterConnection = new Connection(
    clusterApiUrl(process.env.NEXT_PUBLIC_RPC_ENV as any),
    'confirmed'
);

export const initProgram = (
    wallet: AnchorWallet,
    connection: Connection = clusterConnection
): Program<Skilldex> => {
    const provider = new AnchorProvider(connection, wallet as any, { commitment: 'confirmed' });
    return new Program<Skilldex>(IDL as Skilldex, provider);
};

export const getPlatformPubKey = (): PublicKey => {
    const [platform] = PublicKey.findProgramAddressSync(
        [Buffer.from(PDA_AFFIXES.platform), Buffer.from(PDA_AFFIXES.suffix)],
        new PublicKey(IDL.address)
    );
    return platform;
};

export const getLobbyAddress = (lobbyId: number): PublicKey => {
    const [lobby] = PublicKey.findProgramAddressSync(
        [
            Buffer.from(PDA_AFFIXES.lobby),
            Buffer.from(lobbyId.toString()),
            Buffer.from(PDA_AFFIXES.suffix),
        ],
        new PublicKey(IDL.address)
    );
    return lobby;
};

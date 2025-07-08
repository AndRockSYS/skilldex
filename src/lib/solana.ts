import { Connection, PublicKey } from '@solana/web3.js';
import { AnchorWallet } from '@solana/wallet-adapter-react';
import { AnchorProvider, BN, BorshCoder, EventParser, Program } from '@coral-xyz/anchor';

import { connection } from '@/config/solana';

import { IDL, Skilldex } from '@/data/program-idl';
import { PDA_AFFIXES } from '@/utils/constants';

export const initProgram = (wallet: AnchorWallet): Program<Skilldex> => {
    const provider = new AnchorProvider(connection, wallet, { commitment: 'confirmed' });
    return new Program<Skilldex>(IDL, provider);
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
            new BN(lobbyId).toArray('le', 8),
            Buffer.from(PDA_AFFIXES.suffix),
        ],
        new PublicKey(IDL.address)
    );
    return lobby;
};

export const parseEventLogs = async (
    connection: Connection,
    signature: string,
    program: Program<Skilldex>
) => {
    const tx = await connection.getTransaction(signature, {
        commitment: 'confirmed',
    });
    const eventParser = new EventParser(program.programId, new BorshCoder(program.idl));
    if (!tx?.meta?.logMessages) return [];

    const events = eventParser.parseLogs(tx.meta.logMessages);
    return events;
};

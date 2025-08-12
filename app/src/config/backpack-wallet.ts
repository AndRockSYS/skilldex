import {
    BaseWalletAdapter,
    WalletError,
    WalletName,
    WalletNotReadyError,
    WalletReadyState,
} from "@solana/wallet-adapter-base";
import {
    PublicKey,
    Transaction,
    VersionedTransaction,
    TransactionVersion,
} from "@solana/web3.js";

export class BackpackWalletAdapter extends BaseWalletAdapter {
    name = "Backpack" as WalletName;
    url = "https://backpack.app";
    icon = "https://backpack.app/favicon.ico";
    readyState =
        typeof window !== "undefined" && (window as any).backpack
            ? WalletReadyState.Installed
            : WalletReadyState.NotDetected;

    private _publicKey: PublicKey | null = null;
    private _connected = false;
    private _connecting = false;

    get publicKey() {
        return this._publicKey;
    }

    get connected() {
        return this._connected;
    }

    get connecting() {
        return this._connecting;
    }

    get supportedTransactionVersions(): ReadonlySet<TransactionVersion> | null {
        // Backpack supports both legacy and v0 transactions
        return new Set<"legacy" | 0>(["legacy", 0]);
    }

    async connect(): Promise<void> {
        try {
            if (this.connected || this.connecting) return;
            this._connecting = true;

            const provider = (window as any).backpack?.solana;
            if (!provider) throw new WalletNotReadyError();

            const resp = await provider.connect();
            this._publicKey = new PublicKey(resp.publicKey.toString());
            this._connected = true;

            this.emit("connect", this._publicKey);
        } catch (err) {
            const error =
                err instanceof WalletError
                    ? err
                    : new WalletError((err as Error).message, err as Error);
            this.emit("error", error);
            throw error;
        } finally {
            this._connecting = false;
        }
    }

    async disconnect(): Promise<void> {
        const provider = (window as any).backpack?.solana;
        if (provider?.disconnect) {
            await provider.disconnect();
        }
        this._publicKey = null;
        this._connected = false;
        this.emit("disconnect");
    }

    async sendTransaction<T extends Transaction | VersionedTransaction>(
        transaction: T,
        connection: any,
        options?: any
    ): Promise<string> {
        const provider = (window as any).backpack?.solana;
        if (!provider) throw new WalletNotReadyError();

        return await provider.signAndSendTransaction(transaction, options);
    }

    async signTransaction<T extends Transaction | VersionedTransaction>(
        transaction: T
    ): Promise<T> {
        const provider = (window as any).backpack?.solana;
        if (!provider) throw new WalletNotReadyError();
        return await provider.signTransaction(transaction);
    }

    async signAllTransactions<T extends Transaction | VersionedTransaction>(
        transactions: T[]
    ): Promise<T[]> {
        const provider = (window as any).backpack?.solana;
        if (!provider) throw new WalletNotReadyError();
        return await provider.signAllTransactions(transactions);
    }
}

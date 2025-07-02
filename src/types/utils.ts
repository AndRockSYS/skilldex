export enum Token {
    SOL,
}

export const getTokenName = (token: Token): string => {
    switch (token) {
        case Token.SOL:
            return 'SOL';
    }
};

export interface LobbyDisplayStatus {
    text: string;
    variant: 'default' | 'secondary' | 'destructive' | 'outline';
}

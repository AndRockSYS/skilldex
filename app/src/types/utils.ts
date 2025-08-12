export enum Token {
    SOL,
    X1,
}

export const getTokenName = (token: Token): string => {
    switch (token) {
        case Token.SOL:
            return "SOL";
        case Token.X1:
            return "X1";
    }
};

export interface LobbyDisplayStatus {
    text: string;
    variant: "default" | "secondary" | "destructive" | "outline";
}

export type Timestamp = number;

import { Coins, Flame, Gamepad2, Users } from "lucide-react";

export const allocationData = [
    { name: "Public Sale", value: 8, color: "#82ca9d" },
    { name: "Community & Ecosystem", value: 22, color: "#ffc658" },
    { name: "Team & Founders", value: 20, color: "#00C49F" },
    { name: "Treasury Reserve", value: 26.7, color: "#8884d8" },
    { name: "Liquidity Provision", value: 10, color: "#ff8042" },
    { name: "Advisors & Partners", value: 5, color: "#FF80E5" },
];

export const bondingCurveData = [
    { batch: 0, supply: 0, price: 0.025 },
    { batch: 1, supply: 1000000, price: 0.025 },
    { batch: 2, supply: 2000000, price: 0.06 },
    { batch: 3, supply: 3000000, price: 0.12 },
    { batch: 4, supply: 4000000, price: 0.2 },
    { batch: 5, supply: 5000000, price: 0.3 },
    { batch: 6, supply: 6000000, price: 0.4 },
    { batch: 7, supply: 7000000, price: 0.5 },
    { batch: 8, supply: 8000000, price: 0.625 },
    { batch: 9, supply: 9000000, price: 0.75 },
    { batch: 10, supply: 10000000, price: 0.825 },
    { batch: 11, supply: 11000000, price: 0.9 },
    { batch: 12, supply: 12000000, price: 1.0 },
];

export const coreBenefits = [
    {
        icon: <Coins className="h-8 w-8 text-yellow-400" />,
        title: "Discounted Fees",
        description:
            "Use $SKILL for challenge entry fees and receive a 75% discount compared to other tokens.",
    },
    {
        icon: <Flame className="h-8 w-8 text-destructive" />,
        title: "Token Burns",
        description:
            "Every match paid with $SKILL or other tokens helps permanently reduce the $SKILL supply.",
    },
];

export const futureBenefits = [
    {
        icon: <Gamepad2 className="h-8 w-8 text-accent" />,
        title: "Cosmetic Unlocks",
        description:
            "Buy skins, boards, utility avatars, and other unique NFTs exclusively with $SKILL.",
    },
    {
        icon: <Users className="h-8 w-8 text-purple-400" />,
        title: "Governance",
        description:
            "Vote on key ecosystem decisions, such as treasury use, new games, and platform parameters.",
    },
];

export const roadmapPhases = [
    {
        phase: "Phase 1: 0–1 Year",
        items: [
            "Launch on Solana mainnet & X1 testnet/mainnet",
            "Launch of Checkers, Connect 4, Reversi, and Tic-Tac-Toe",
            "$SKILL token public sale via Metaplex Candy Machine",
            "CoinMarketCap & CoinGecko listing",
            "PlayToEarn.com listing",
            "DexScreener listing",
            "Community growth & Discord activation",
        ],
    },
    {
        phase: "Phase 2: 1–3 Years",
        items: [
            "Centralized exchange (CEX) listings",
            "Strategic community boost campaigns",
            "Partnerships with new GameFi projects",
            "Partner with Web3 gaming influencers to attract new players",
            "Live Twitch streams and content creator engagement",
            "Localization of platform UI/UX",
            "Release of new games based on player feedback",
            "Launch NFT avatars and board skins",
        ],
    },
    {
        phase: "Phase 3: Post 3 Years",
        items: [
            "DAO integration for community governance",
            "Treasury-controlled Bitcoin yield deployment",
            "Buyback & burn using Bitcoin treasury profits",
        ],
    },
];

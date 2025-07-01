import { Wallet, PlusSquare, Gamepad2, Award, ShieldCheck, Users } from 'lucide-react';

export const features = [
    {
        icon: ShieldCheck,
        title: 'Secure & Transparent',
        description:
            'Built on blockchain principles, ensuring fairness and security of funds and game outcomes.',
    },
    {
        icon: Users,
        title: 'Community Focused',
        description:
            'Compete with a global community of gamers. Rise through the ranks and become a legend.',
    },
    {
        icon: Gamepad2,
        title: 'Expanding Game Library',
        description:
            "We're constantly adding new and exciting skill-based games to challenge your abilities.",
    },
];

export const steps = [
    {
        icon: Wallet,
        title: 'Connect Your Wallet',
        description:
            'Securely connect your preferred cryptocurrency wallet. This is your gateway to SKILLDEX.IO, holding your tokens and prizes.',
        image: 'https://placehold.co/600x400.png',
        imageHint: 'wallet connect',
    },
    {
        icon: PlusSquare,
        title: 'Create or Join a Challenge',
        description:
            'Browse the lobby for existing challenges or create your own. Set the game, stake amount, token, and expiration time.',
        image: 'https://placehold.co/600x400.png',
        imageHint: 'game lobby',
    },
    {
        icon: Gamepad2,
        title: 'Play the Game',
        description:
            'Once an opponent joins (or you join theirs), the match begins! Showcase your skills in your chosen game. Remember to make your move within the set turn time limit to avoid forfeiting the match.',
        image: 'https://placehold.co/600x400.png',
        imageHint: 'gameplay action',
    },
    {
        icon: Award,
        title: 'Claim Your Winnings',
        description:
            'Victorious? The prize pool (minus a small platform fee) is automatically transferred to your wallet. Sweet victory!',
        image: 'https://placehold.co/600x400.png',
        imageHint: 'trophy prize',
    },
];

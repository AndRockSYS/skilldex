# Skilldex

Skilldex is a decentralized skill-based gaming platform built on Solana. Players can create and join game lobbies, stake tokens, and compete for prizes in classic games. All staking and payouts are handled securely on-chain.

## Folder Structure

```
app/                  # Next.js frontend application
  src/                # Source code for the frontend
    app/              # Next.js (routes)
    components/       # Reusable React components (UI, game boards, modals, etc.)
    config/           # Configuration files (database, solana, etc.)
    context/          # Context files
    content/          # Static content (game rules, announcements, etc.)
    hooks/            # Custom React hooks (wallet, game logic, etc.)
    utils/            # Utility functions (helpers, formatting, etc.)
    lib/              # Library implementations
    data/             # Static data
    types/            # TypeScript type definitions
  public/             # Public static assets (served at root)

firebase/             # Firebase project configuration
  functions/          # Cloud Function to clear the game queue after joining
  firebase.json       # Firebase configuration file

README.md             # Project overview and instructions
```

## Features

-   Skill-based games: Tic-Tac-Toe, Connect Four, Checkers, Reversi
-   Lobby system: Create, join, and manage game lobbies
-   On-chain escrow and automated payouts
-   Leaderboard and user profiles
-   Admin tools for moderation and announcements

## Getting Started

1. **Install Next.js dependencies:**

    ```bash
    cd app
    npm install
    ```

2. **Run the project:**

    ```bash
    npm run dev
    ```

    Open [http://localhost:3000](http://localhost:3000).

3. **Deploy Firebase function:**

    ```bash
    cd firebase/functions
    npm install
    firebase deploy --only functions
    ```

## Learn More

-   [Next.js Documentation](https://nextjs.org/docs)
-   [Solana Docs](https://docs.solana.com/)
-   [Firebase Functions](https://firebase.google.com/docs/functions)

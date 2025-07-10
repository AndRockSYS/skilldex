'use client';

import { Provider } from 'react-redux';

import { useEffect, useRef } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';

import { makeStore, AppStore } from '@/lib/redux/store';
import { fetchUser, clearUser } from '@/lib/redux/slice/user';

export default function StoreProvider({ children }: { children: React.ReactNode }) {
    const { publicKey, disconnecting } = useWallet();

    const storeRef = useRef<AppStore>(undefined);
    if (!storeRef.current) storeRef.current = makeStore();

    useEffect(() => {
        if (publicKey) storeRef.current?.dispatch(fetchUser(publicKey.toString()));
        if (disconnecting) storeRef.current?.dispatch(clearUser());
    }, [publicKey, disconnecting]);

    return <Provider store={storeRef.current}>{children}</Provider>;
}

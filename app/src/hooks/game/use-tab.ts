import { useEffect, useState } from 'react';

export default function useTab() {
    const [isTabVisible, setIsTabVisible] = useState(true);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setIsTabVisible(!document.hidden);

            const handleVisibilityChange = () => setIsTabVisible(!document.hidden);
            document.addEventListener('visibilitychange', handleVisibilityChange);

            return () => {
                document.removeEventListener('visibilitychange', handleVisibilityChange);
            };
        }
    }, []);

    return { isTabVisible };
}

'use client';

import Link from 'next/link';

import { useIsMobile } from '@/hooks/use-mobile';
import { useMemo } from 'react';

export default function Home() {
    const isMobile = useIsMobile();

    const video = useMemo(
        () => (
            <video
                className='relative top-0 left-0 w-full h-auto object-cover'
                src={`/videos/home-${isMobile ? 'mobile' : 'desktop'}.mp4`}
                muted
                loop
                autoPlay
                playsInline
            />
        ),
        [isMobile]
    );

    return (
        <div className='w-full h-dvh absolute inset-0'>
            <div className='relative h-fit w-full [&_a]:z-10'>
                {video}
                {!isMobile ? (
                    <>
                        <Link
                            href='/create-lobby'
                            className='absolute w-[30%] h-[40%] top-[12%] left-[2%]'
                        />
                        <Link
                            href='/how-it-works'
                            className='absolute w-[16%] h-[14%] bottom-[24%] left-[28%]'
                        />
                        <Link
                            href='/lobby'
                            className='absolute w-[20%] h-[16%] bottom-[5%] right-[30%]'
                        />
                        <Link
                            href='/leaderboard'
                            className='absolute w-[8%] h-[65%] bottom-[13%] right-[15%]'
                        />
                        <Link
                            href='/air-drop'
                            className='absolute w-[7%] h-[12%] top-[23%] left-[36%]'
                        />
                    </>
                ) : (
                    <>
                        <div
                            className='absolute w-[53%] h-[33%] bottom-[21%] left-[20%] flex flex-col items-center
                        [&>a]:w-full [&>a]:h-[calc(100%/4)]'
                        >
                            <Link href='/how-it-works' className='' />
                            <Link href='/lobby' />
                            <Link href='/create-lobby' />
                            <Link href='/leaderboard' />
                        </div>
                        <Link
                            href='/air-drop'
                            className='absolute w-[11%] h-[9%] top-[23%] right-[1%]'
                        />
                    </>
                )}
            </div>
        </div>
    );
}

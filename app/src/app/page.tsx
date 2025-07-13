import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Gamepad2, ListChecks, Users } from 'lucide-react';

export default function Home() {
    return (
        <div className='flex flex-col items-center space-y-12'>
            <section className='text-center py-12 md:py-20'>
                <h1 className='font-headline text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6'>
                    Welcome to <span className='rainbow-text'>SKILLDEX.IO</span>
                </h1>
                <p className='text-lg sm:text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-10'>
                    Challenge players in exciting games, prove your skills, and win crypto prizes.
                    The ultimate P2P skill gaming platform.
                </p>
                <div className='flex flex-col sm:flex-row justify-center gap-4'>
                    <Button
                        asChild
                        size='lg'
                        className='bg-primary hover:bg-primary/90 text-primary-foreground text-lg px-8 py-4 sm:py-6'
                    >
                        <Link href='/lobby'>Enter Lobby</Link>
                    </Button>
                    <Button
                        asChild
                        variant='outline'
                        size='lg'
                        className='text-lg px-8 py-4 sm:py-6 border-accent text-accent hover:bg-accent/10 hover:text-accent'
                    >
                        <Link href='/how-it-works'>How It Works</Link>
                    </Button>
                </div>
            </section>

            <section className='w-full max-w-5xl px-4'>
                <h2 className='font-headline text-3xl md:text-4xl font-semibold text-center mb-12'>
                    Why Choose SKILLDEX.IO?
                </h2>
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8'>
                    <Card className='bg-card transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-xl hover:shadow-primary/20'>
                        <CardHeader className='items-center text-center'>
                            <Gamepad2 className='w-12 h-12 text-primary mb-4' />
                            <CardTitle className='font-headline text-2xl'>Diverse Games</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <CardDescription className='text-center text-muted-foreground'>
                                Play a variety of skill-based games. New games added regularly to
                                keep the challenge fresh.
                            </CardDescription>
                        </CardContent>
                    </Card>
                    <Card className='bg-card transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-xl hover:shadow-primary/20'>
                        <CardHeader className='items-center text-center'>
                            <ListChecks className='w-12 h-12 text-primary mb-4' />
                            <CardTitle className='font-headline text-2xl'>
                                Transparent & Fair
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <CardDescription className='text-center text-muted-foreground'>
                                Leveraging blockchain for secure and transparent prize handling.
                                Fair play is our priority.
                            </CardDescription>
                        </CardContent>
                    </Card>
                    <Card className='bg-card transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-xl hover:shadow-primary/20'>
                        <CardHeader className='items-center text-center'>
                            <Users className='w-12 h-12 text-primary mb-4' />
                            <CardTitle className='font-headline text-2xl'>
                                Vibrant Community
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <CardDescription className='text-center text-muted-foreground'>
                                Join a growing community of gamers. Challenge friends or meet new
                                opponents.
                            </CardDescription>
                        </CardContent>
                    </Card>
                </div>
            </section>

            <section className='w-full max-w-5xl text-center py-12 md:py-16 px-4'>
                <Image
                    src='https://placehold.co/800x400.png'
                    alt='SKILLDEX.IO Gameplay montage'
                    data-ai-hint='gaming crypto'
                    width={800}
                    height={400}
                    className='rounded-lg shadow-2xl mx-auto w-full h-auto'
                />
            </section>

            <section className='text-center py-12 md:py-16'>
                <h2 className='font-headline text-3xl md:text-4xl font-semibold mb-6'>
                    Ready to Play?
                </h2>
                <p className='text-lg text-muted-foreground max-w-xl mx-auto mb-8 px-4'>
                    Join thousands of players competing for glory and crypto. Create your first
                    challenge or jump into an existing one.
                </p>
                <Button
                    asChild
                    size='lg'
                    className='bg-accent hover:bg-accent/90 text-accent-foreground text-lg px-10 py-4 sm:py-6'
                >
                    <Link href='/create-challenge'>Create Your Challenge Now</Link>
                </Button>
            </section>
        </div>
    );
}

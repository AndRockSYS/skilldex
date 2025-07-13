import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { HelpCircle, AlertTriangle } from 'lucide-react';

import { steps, features } from '@/content/how-it-works';
import { games, descriptions, objectives } from '@/content/games';

import { GameDefinition } from '@/types/games';

export default function HowItWorksPage() {
    return (
        <div className='space-y-12 md:space-y-16 px-4'>
            <section className='text-center py-8'>
                <h1 className='font-headline text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4'>
                    How <span className='rainbow-text'>SKILLDEX.IO</span> Works
                </h1>
                <p className='text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto'>
                    A simple, secure, and exciting way to play skill games for crypto prizes.
                </p>
            </section>

            <section className='grid md:grid-cols-1 gap-8 items-stretch'>
                {steps.map((step, index) => (
                    <Card
                        key={index}
                        className='flex flex-col md:flex-row items-center overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300'
                    >
                        <div
                            className={`w-full md:w-1/2 ${
                                index % 2 === 0 ? 'md:order-1' : 'md:order-2'
                            }`}
                        >
                            <Image
                                src={step.image}
                                alt={step.title}
                                data-ai-hint={step.imageHint}
                                width={600}
                                height={400}
                                className='object-cover w-full h-48 sm:h-64 md:h-full'
                            />
                        </div>
                        <div
                            className={`w-full md:w-1/2 p-6 md:p-8 lg:p-10 ${
                                index % 2 === 0 ? 'md:order-2' : 'md:order-1'
                            }`}
                        >
                            <div className='flex items-center mb-4'>
                                <div className='bg-primary text-primary-foreground rounded-full p-2 sm:p-3 mr-3 sm:mr-4'>
                                    <step.icon className='h-6 w-6 sm:h-8 sm:w-8' />
                                </div>
                                <div>
                                    <p className='text-xs sm:text-sm text-primary font-semibold'>
                                        STEP {index + 1}
                                    </p>
                                    <h2 className='font-headline text-xl sm:text-2xl md:text-3xl font-semibold'>
                                        {step.title}
                                    </h2>
                                </div>
                            </div>
                            <p className='text-muted-foreground text-base sm:text-lg leading-relaxed'>
                                {step.description}
                            </p>
                        </div>
                    </Card>
                ))}
            </section>

            <section>
                <h2 className='font-headline text-2xl sm:text-3xl md:text-4xl font-semibold text-center mb-8 md:mb-12'>
                    Platform Highlights
                </h2>
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8'>
                    {features.map((feature, index) => (
                        <Card
                            key={index}
                            className='text-center p-6 bg-card/80 transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-xl hover:shadow-accent/20'
                        >
                            <feature.icon className='h-10 w-10 sm:h-12 sm:w-12 text-accent mx-auto mb-4' />
                            <CardTitle className='font-headline text-lg sm:text-xl mb-2'>
                                {feature.title}
                            </CardTitle>
                            <CardContent className='text-muted-foreground text-sm sm:text-base'>
                                {feature.description}
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </section>

            <section id='game-rules-overview'>
                <h2 className='font-headline text-2xl sm:text-3xl md:text-4xl font-semibold text-center mb-8 md:mb-12 flex items-center justify-center'>
                    <HelpCircle className='mr-2 sm:mr-3 h-7 w-7 sm:h-8 sm:w-8 text-primary' />
                    Understanding Our Games
                </h2>
                <div className='text-center text-muted-foreground mb-10 max-w-3xl mx-auto space-y-3'>
                    <p>
                        Each game on SKILLDEX.IO has unique rules and objectives. Here's a brief
                        overview. For detailed rules, look for an 'Info' or 'Rules' button within
                        the game room or when selecting a game.
                    </p>
                    <p className='flex items-center justify-center gap-1 text-sm font-medium text-destructive bg-destructive/10 p-2 rounded-md'>
                        <AlertTriangle className='h-4 w-4' /> Important: All games have turn time
                        limits. Failing to make your move within the allocated time will result in
                        forfeiting the match to your opponent.
                    </p>
                </div>
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8'>
                    {games.map((game: GameDefinition) => (
                        <Card key={game.id} className='flex flex-col'>
                            <CardHeader>
                                <div className='flex items-center gap-3 mb-2'>
                                    <game.icon className='h-10 w-10 text-primary rounded-md' />
                                    <CardTitle className='font-headline text-xl sm:text-2xl'>
                                        {game.name}
                                    </CardTitle>
                                </div>
                                <CardDescription className='text-sm sm:text-base text-muted-foreground font-semibold'>
                                    Objective: {objectives[game.id] || 'Win the game!'}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className='flex-grow'>
                                <p className='text-sm sm:text-base text-muted-foreground leading-relaxed'>
                                    {descriptions[game.id] ||
                                        'Engage in a thrilling match of skill and strategy.'}
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </section>
        </div>
    );
}

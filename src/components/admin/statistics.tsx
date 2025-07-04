'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TabsContent } from '@/components/ui/tabs';

import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import { PLATFORM_COMMISSION } from '@/utils/constants';

import { Statistics } from '@/types/admin';

interface Props {
    stats: Statistics;
}

export default function StatisticsPage({ stats }: Props) {
    return (
        <TabsContent value='overview' className='mt-6'>
            <>
                <h2 className='font-headline text-xl sm:text-2xl mb-4'>Game Statistics</h2>
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
                    <Card>
                        <CardHeader>
                            <CardTitle className='text-base sm:text-lg'>Total Challenges</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className='text-2xl sm:text-3xl font-bold'>
                                {stats.games.active + stats.games.open + stats.games.finished}
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle className='text-base sm:text-lg'>Open</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className='text-2xl sm:text-3xl font-bold'>{stats.games.open}</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle className='text-base sm:text-lg'>In Play</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className='text-2xl sm:text-3xl font-bold'>{stats.games.active}</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle className='text-base sm:text-lg'>Finished</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className='text-2xl sm:text-3xl font-bold'>{stats.games.finished}</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle className='text-base sm:text-lg'>
                                Total Staked Value (SOL)
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className='text-2xl sm:text-3xl font-bold'>
                                {(stats.totalStake / LAMPORTS_PER_SOL).toFixed(4)}
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle className='text-base sm:text-lg'>
                                Platform Fees Earned (SOL)
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className='text-2xl sm:text-3xl font-bold'>
                                {(
                                    (stats.totalStake / LAMPORTS_PER_SOL / 100) *
                                    PLATFORM_COMMISSION
                                ).toFixed(4)}
                            </p>
                        </CardContent>
                    </Card>
                </div>
                {/* {stats.statusDistribution.some((d: any) => d.value > 0) && (
                    <Card className='mt-6'>
                        <CardHeader>
                            <CardTitle className='text-base sm:text-lg'>
                                Challenge Status Distribution
                            </CardTitle>
                        </CardHeader>
                        <CardContent className='h-[300px] sm:h-[350px] w-full'>
                            <ChartContainer
                                config={{}}
                                className='mx-auto aspect-square max-h-[250px] sm:max-h-[300px]'
                            >
                                <ResponsiveContainer width='100%' height='100%'>
                                    <PieChart>
                                        <Tooltip content={<ChartTooltipContent hideLabel />} />
                                        <Pie
                                            data={stats.statusDistribution}
                                            dataKey='value'
                                            nameKey='name'
                                            cx='50%'
                                            cy='50%'
                                            outerRadius={window.innerWidth < 640 ? 70 : 100}
                                            label
                                        >
                                            {stats.statusDistribution.map((_, index: number) => (
                                                <Cell
                                                    key={`cell-${index}`}
                                                    fill={
                                                        STATS_CHART_COLORS[
                                                            index % STATS_CHART_COLORS.length
                                                        ]
                                                    }
                                                />
                                            ))}
                                        </Pie>
                                        <Legend wrapperStyle={{ fontSize: '0.875rem' }} />
                                    </PieChart>
                                </ResponsiveContainer>
                            </ChartContainer>
                        </CardContent>
                    </Card>
                )} */}
            </>
        </TabsContent>
    );
}

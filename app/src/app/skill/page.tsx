"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    CheckCircle,
    ShieldCheck,
    Lock,
    Users,
    Package,
    Rocket,
    TrendingUp,
} from "lucide-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import {
    PieChart as RechartsPieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    Tooltip,
    LineChart as RechartsLineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
} from "recharts";

import {
    allocationData,
    bondingCurveData,
    coreBenefits,
    futureBenefits,
    roadmapPhases,
} from "@/content/skill";

import { cn } from "@/lib/utils";

const NeonGlowText = ({
    children,
    className,
}: {
    children: React.ReactNode;
    className?: string;
}) => (
    <h1
        className={cn(
            "font-headline font-bold text-white tracking-wider animate-neon-flicker",
            "[text-shadow:0_0_5px_#fff,0_0_10px_#fff,0_0_20px_hsl(var(--primary)),0_0_30px_hsl(var(--primary)),0_0_40px_hsl(var(--primary)),0_0_55px_hsl(var(--primary)),0_0_75px_hsl(var(--primary))]",
            className
        )}
    >
        {children}
    </h1>
);

export default function SkillTokenPage() {
    return (
        <div className="space-y-20 md:space-y-32 overflow-hidden">
            <section className="text-center pt-16 md:pt-24 relative">
                <div className="absolute inset-0 -z-10 h-full w-full bg-transparent bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,hsl(var(--primary)/0.2),rgba(255,255,255,0))]"></div>
                <div className="max-w-4xl mx-auto px-4">
                    <div className="relative inline-block p-4 border-2 border-primary rounded-lg shadow-[0_0_20px_hsl(var(--primary)),inset_0_0_20px_hsl(var(--primary))] mb-6">
                        <NeonGlowText className="text-5xl md:text-7xl lg:text-8xl">
                            BUY $SKILL
                        </NeonGlowText>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-headline font-extrabold tracking-tight mb-4">
                        Buy $SKILL – Play Smarter, Earn More
                    </h1>
                    <p className="max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground mb-8">
                        The native utility token for the Skilldex ecosystem.
                        Unlock lower fees, higher rewards, and exclusive staking
                        benefits.
                    </p>
                    <WalletMultiButton
                        className={cn(
                            buttonVariants({ size: "lg" }),
                            "text-lg px-8 py-6 bg-accent text-accent-foreground shadow-lg shadow-accent/20 hover:shadow-accent/40 transition-shadow"
                        )}
                    />
                </div>
            </section>

            <section className="max-w-5xl mx-auto px-4">
                <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
                    <CardHeader>
                        <CardTitle className="text-3xl font-headline text-center">
                            Token Overview
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
                        <div className="space-y-4">
                            <div className="flex justify-between p-3 bg-muted rounded-lg">
                                <span>Token Name:</span>{" "}
                                <span className="font-bold">SKILL</span>
                            </div>
                            <div className="flex justify-between p-3 bg-muted rounded-lg">
                                <span>Total Supply:</span>{" "}
                                <span className="font-bold">
                                    150,000,000 (Fixed)
                                </span>
                            </div>
                            <div className="flex justify-between p-3 bg-muted rounded-lg">
                                <span>Network:</span>{" "}
                                <span className="font-bold">
                                    Solana (SPL Token)
                                </span>
                            </div>
                            <div className="flex justify-between p-3 bg-muted rounded-lg">
                                <span>Public Sale:</span>{" "}
                                <span className="font-bold">
                                    Metaplex Candy Machine
                                </span>
                            </div>
                        </div>
                        <div className="h-80">
                            <h3 className="text-lg font-semibold text-center mb-2">
                                Price Bonding Curve ($0.025 → $1.00)
                            </h3>
                            <ResponsiveContainer width="100%" height="100%">
                                <RechartsLineChart
                                    data={bondingCurveData}
                                    margin={{
                                        top: 5,
                                        right: 20,
                                        left: 20,
                                        bottom: 5,
                                    }}
                                >
                                    <CartesianGrid
                                        strokeDasharray="3 3"
                                        stroke="hsl(var(--border)/0.5)"
                                    />
                                    <XAxis
                                        dataKey="supply"
                                        type="number"
                                        domain={[0, 12000000]}
                                        tickFormatter={(val) =>
                                            `${val / 1_000_000}M`
                                        }
                                        stroke="hsl(var(--muted-foreground))"
                                    />
                                    <YAxis
                                        dataKey="price"
                                        type="number"
                                        domain={[0, 1]}
                                        tickFormatter={(val) =>
                                            `$${val.toFixed(2)}`
                                        }
                                        stroke="hsl(var(--muted-foreground))"
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor:
                                                "hsl(var(--background))",
                                            border: "1px solid hsl(var(--border))",
                                        }}
                                        labelStyle={{
                                            color: "hsl(var(--foreground))",
                                        }}
                                        formatter={(value, name, props) => {
                                            const price = Number(value);
                                            return [
                                                `$${price.toFixed(4)}`,
                                                `Batch ${props.payload.batch}`,
                                            ];
                                        }}
                                        labelFormatter={(label) =>
                                            `Supply: ${Number(
                                                label
                                            ).toLocaleString()}`
                                        }
                                    />
                                    <Line
                                        type="stepAfter"
                                        dataKey="price"
                                        stroke="hsl(var(--primary))"
                                        strokeWidth={3}
                                        dot={false}
                                    />
                                </RechartsLineChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                    <CardContent>
                        <CardDescription className="text-center text-xs mt-2">
                            The public sale will run via Metaplex Candy Machine,
                            selling 12M tokens in 12 batches of 1M. Price starts
                            at $0.025 and ends at $1.00. Total fundraising
                            potential: ~$5M.
                        </CardDescription>
                    </CardContent>
                </Card>
            </section>

            <section className="max-w-6xl mx-auto px-4">
                <h2 className="text-3xl md:text-4xl font-headline font-bold text-center mb-12">
                    Token Utility
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8">
                    {coreBenefits.map((benefit, index) => (
                        <Card
                            key={index}
                            className="bg-card/50 backdrop-blur-sm border-primary/20 text-center p-6 transition-all duration-300 hover:border-primary hover:shadow-primary/20 hover:-translate-y-2"
                        >
                            <div className="mb-4 inline-block p-3 bg-muted rounded-full">
                                {benefit.icon}
                            </div>
                            <h3 className="text-xl font-bold font-headline mb-2">
                                {benefit.title}
                            </h3>
                            <p className="text-muted-foreground">
                                {benefit.description}
                            </p>
                        </Card>
                    ))}
                </div>
                <div className="mt-12 text-center">
                    <h3 className="text-2xl font-headline font-semibold mb-8">
                        Future Utility
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8">
                        {futureBenefits.map((benefit, index) => (
                            <Card
                                key={index}
                                className="bg-card/50 backdrop-blur-sm border-dashed border-primary/20 text-center p-6 transition-all duration-300 hover:border-primary hover:shadow-primary/20 hover:-translate-y-2 opacity-80 hover:opacity-100"
                            >
                                <div className="mb-4 inline-block p-3 bg-muted rounded-full">
                                    {benefit.icon}
                                </div>
                                <h3 className="text-xl font-bold font-headline mb-2">
                                    {benefit.title}
                                </h3>
                                <p className="text-muted-foreground">
                                    {benefit.description}
                                </p>
                            </Card>
                        ))}
                    </div>
                    <Card className="mt-8 bg-card/50 backdrop-blur-sm border-dashed border-accent/30 text-center p-6">
                        <CardTitle className="flex items-center justify-center gap-2 text-accent">
                            <Rocket className="h-5 w-5" />
                            More to Come
                        </CardTitle>
                        <CardDescription className="mt-2">
                            This is just the beginning. We are constantly
                            exploring new ways to add value and utility to the
                            $SKILL token as the ecosystem grows.
                        </CardDescription>
                    </Card>
                </div>
            </section>

            <section className="max-w-5xl mx-auto px-4">
                <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
                    <CardHeader>
                        <CardTitle className="text-3xl font-headline text-center">
                            Token Allocation &amp; Vesting
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <RechartsPieChart>
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor:
                                                "hsl(var(--background))",
                                            border: "1px solid hsl(var(--border))",
                                        }}
                                        formatter={(value, name) => [
                                            `${Number(value).toFixed(1)}%`,
                                            name,
                                        ]}
                                    />
                                    <Pie
                                        data={allocationData}
                                        dataKey="value"
                                        nameKey="name"
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={"80%"}
                                        label={({ name, percent }) =>
                                            `${name} ${(
                                                (percent as number) * 100
                                            ).toFixed(0)}%`
                                        }
                                    >
                                        {allocationData.map((entry, index) => (
                                            <Cell
                                                key={`cell-${index}`}
                                                fill={entry.color}
                                            />
                                        ))}
                                    </Pie>
                                </RechartsPieChart>
                            </ResponsiveContainer>
                        </div>
                        <div>
                            <ul className="space-y-3 text-sm">
                                {allocationData
                                    .sort((a, b) => b.value - a.value)
                                    .map((entry) => (
                                        <li
                                            key={entry.name}
                                            className="flex items-center"
                                        >
                                            <div
                                                className="w-4 h-4 rounded-full mr-3"
                                                style={{
                                                    backgroundColor:
                                                        entry.color,
                                                }}
                                            ></div>
                                            <span className="text-muted-foreground">
                                                {entry.name}:
                                            </span>
                                            <span className="font-bold ml-auto">
                                                {(
                                                    (entry.value / 100) *
                                                    150_000_000
                                                ).toLocaleString()}{" "}
                                                $SKILL
                                            </span>
                                        </li>
                                    ))}
                            </ul>
                        </div>
                    </CardContent>
                    <CardContent>
                        <div className="grid md:grid-cols-2 gap-6 mt-6 text-center">
                            <Card className="p-4 bg-muted/50 border-primary/20">
                                <CardTitle className="text-lg flex items-center justify-center gap-2">
                                    <Users className="h-5 w-5" />
                                    Team &amp; Founders
                                </CardTitle>
                                <CardDescription>
                                    20% (30M) vested via Streamflow: 1 year
                                    cliff, then linear over 4 years.
                                </CardDescription>
                            </Card>
                            <Card className="p-4 bg-muted/50 border-primary/20">
                                <CardTitle className="text-lg flex items-center justify-center gap-2">
                                    <Package className="h-5 w-5" />
                                    Advisors &amp; Partners
                                </CardTitle>
                                <CardDescription>
                                    5% (7.5M) vested via Streamflow: 6 month
                                    cliff, then linear over 18 months.
                                </CardDescription>
                            </Card>
                        </div>
                    </CardContent>
                </Card>
            </section>

            <section className="max-w-5xl mx-auto px-4">
                <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
                    <CardHeader>
                        <CardTitle className="text-3xl font-headline text-center">
                            Bitcoin Treasury
                        </CardTitle>
                        <CardDescription className="text-center pt-2">
                            To provide long-term stability and trust, 5-10% of
                            the bonding curve and future platform revenue is
                            allocated to a Bitcoin Reserve Treasury.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="grid sm:grid-cols-1 md:grid-cols-3 gap-4 text-center">
                        <Card className="p-4 bg-muted/50 border-primary/20">
                            <ShieldCheck className="h-7 w-7 mx-auto mb-2 text-primary" />
                            <h4 className="font-semibold">Strategic Reserve</h4>
                            <p className="text-xs text-muted-foreground">
                                Acts as a hedge against market volatility,
                                enhancing credibility and investor confidence.
                            </p>
                        </Card>
                        <Card className="p-4 bg-muted/50 border-primary/20">
                            <TrendingUp className="h-7 w-7 mx-auto mb-2 text-primary" />
                            <h4 className="font-semibold">Growth Engine</h4>
                            <p className="text-xs text-muted-foreground">
                                Potential Bitcoin appreciation can fund future
                                $SKILL buybacks or platform growth.
                            </p>
                        </Card>
                        <Card className="p-4 bg-muted/50 border-primary/20">
                            <Lock className="h-7 w-7 mx-auto mb-2 text-primary" />
                            <h4 className="font-semibold">Long-Term Value</h4>
                            <p className="text-xs text-muted-foreground">
                                Demonstrates a commitment to the long-term
                                health and sustainability of the ecosystem.
                            </p>
                        </Card>
                    </CardContent>
                </Card>
            </section>

            <section className="text-center max-w-4xl mx-auto px-4">
                <h2 className="text-3xl md:text-4xl font-headline font-bold mb-4">
                    Fee Distribution Engine
                </h2>
                <p className="text-lg text-muted-foreground mb-8">
                    Our tokenomics are designed for a sustainable and
                    self-growing ecosystem. Here's how platform fees are
                    distributed based on the token used for payment:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/20">
                        <CardTitle className="text-2xl font-headline text-primary mb-4">
                            Paid in $SKILL (0.5% Fee)
                        </CardTitle>
                        <div className="flex justify-around text-center">
                            <div>
                                <p className="text-3xl font-bold text-destructive">
                                    50%
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    Burned
                                </p>
                            </div>
                            <div>
                                <p className="text-3xl font-bold text-primary">
                                    50%
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    To SKILL Treasury
                                </p>
                            </div>
                        </div>
                    </Card>
                    <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/20">
                        <CardTitle className="text-2xl font-headline text-primary mb-4">
                            Paid in SOL/XNT (2.0% Fee)
                        </CardTitle>
                        <div className="flex justify-around text-center">
                            <div>
                                <p className="text-3xl font-bold text-primary">
                                    50%
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    To SOL/XNT Treasury
                                </p>
                            </div>
                            <div>
                                <p className="text-3xl font-bold text-destructive">
                                    50%
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    Market-Buy &amp; Burn $SKILL
                                </p>
                            </div>
                        </div>
                    </Card>
                </div>
            </section>

            <section className="max-w-4xl mx-auto px-4">
                <h2 className="text-3xl md:text-4xl font-headline font-bold text-center mb-12">
                    Our Vision &amp; Roadmap
                </h2>
                <div className="grid md:grid-cols-3 gap-8">
                    {roadmapPhases.map((phase, phaseIndex) => (
                        <Card
                            key={phaseIndex}
                            className="bg-card/50 backdrop-blur-sm border-primary/20 p-6"
                        >
                            <CardTitle className="text-xl font-headline text-primary mb-4">
                                {phase.phase}
                            </CardTitle>
                            <ul className="space-y-3">
                                {phase.items.map((item, itemIndex) => (
                                    <li
                                        key={itemIndex}
                                        className="flex items-start"
                                    >
                                        <CheckCircle className="h-5 w-5 text-accent mr-3 mt-0.5 shrink-0" />
                                        <span className="text-muted-foreground">
                                            {item}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </Card>
                    ))}
                </div>
                <div className="grid md:grid-cols-2 gap-6 mt-12 text-center">
                    <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/20">
                        <CardTitle>Fair Launch</CardTitle>
                        <CardDescription>
                            No VCs, no private sale. Everyone gets a fair chance
                            to buy $SKILL from the start via the public bonding
                            curve.
                        </CardDescription>
                    </Card>
                    <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/20">
                        <CardTitle>Public Transparency</CardTitle>
                        <CardDescription>
                            All treasury, team, and burn wallet addresses will
                            be made public for community verification.
                        </CardDescription>
                    </Card>
                </div>
            </section>

            <section className="px-4">
                <div className="bg-primary/10 rounded-lg p-8 md:p-12 text-center border-2 border-dashed border-primary">
                    <h2 className="text-2xl md:text-3xl font-headline font-bold text-primary mb-4">
                        The Arena Awaits. Are You Ready?
                    </h2>
                    <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                        The public sale is live. Get your $SKILL tokens now and
                        become a foundational part of the Skilldex revolution.
                    </p>
                    <Button
                        size="lg"
                        asChild
                        className="text-xl px-10 py-8 bg-accent text-accent-foreground shadow-lg shadow-accent/20 hover:shadow-accent/40 transition-shadow animate-pulse hover:animate-none"
                    >
                        <a href="#">Buy $SKILL &amp; Start Winning!</a>
                    </Button>
                </div>
            </section>
        </div>
    );
}

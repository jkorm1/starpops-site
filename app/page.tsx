"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import {
  getBusinessData,
  calculateInvestmentReturn,
  type BusinessData,
} from "@/lib/business-data";
import Link from "next/link";
import Image from "next/image";

export default function HomePage() {
  const [businessData, setBusinessData] = useState<BusinessData | null>(null);
  const [investmentAmount, setInvestmentAmount] = useState<string>("");
  const [calculatedReturn, setCalculatedReturn] = useState<number | null>(null);
  const [calculatedProfit, setCalculatedProfit] = useState<number | null>(null);

  useEffect(() => {
    setBusinessData(getBusinessData());
  }, []);

  const handleInvestmentCalculation = () => {
    if (!businessData || !investmentAmount) {
      toast({
        title: "Missing Information",
        description: "Please enter an investment amount to calculate returns.",
        variant: "destructive",
      });
      return;
    }

    const amount = Number.parseFloat(investmentAmount);
    if (
      isNaN(amount) ||
      amount < businessData.investmentTerms.minimumInvestment
    ) {
      toast({
        title: "Invalid Amount",
        description: `Minimum investment is GHS ${businessData.investmentTerms.minimumInvestment.toLocaleString()}.`,
        variant: "destructive",
      });
      return;
    }

    const { profit, totalReturn } = calculateInvestmentReturn(amount);
    setCalculatedReturn(totalReturn);
    setCalculatedProfit(profit);
  };

  if (!businessData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading Star Pops data...</p>
        </div>
      </div>
    );
  }

  // Prepare chart data
  const monthlyChartData = businessData.financials.monthlyData.map((month) => ({
    month: month.month.slice(0, 3),
    actual: month.revenue,
    projected: businessData.operations.projectedMonthlyRevenue,
    profit: month.profit,
  }));

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background/95 to-background/90"></div>

        {/* Background Video Placeholder */}
        <div className="absolute inset-0 opacity-20">
          <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 animate-pulse"></div>
        </div>

        <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
          <div className="mb-8 float-animation">
            <div className="w-40 h-40 bg-primary rounded-full glow-border mx-auto mb-6 flex items-center justify-center">
              <img
                src="https://i.pinimg.com/736x/9d/71/fb/9d71fb1c7ab0c7915863908cfb62068a.jpg" // Replace with your actual image path
                alt="Profile"
                className="w-40 h-40 rounded-full object-cover"
              />
            </div>
          </div>

          <h1 className="text-6xl md:text-8xl font-bold mb-6 text-balance">
            <span className="shimmer-text">Star Pops</span>
            <br />
            <span className="text-secondary">Popcorn Experience</span>
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground mb-8 text-balance max-w-2xl mx-auto">
            {businessData.company.mission}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="glow-border text-lg px-8 py-4" asChild>
              <Link href="/invest">Invest in Our Future</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-8 py-4 bg-transparent"
              asChild
            >
              <Link href="/pitch">View Our Pitch</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Product Gallery */}
      <section className="py-20 px-6">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 text-balance">
            Premium <span className="text-primary">Popcorn</span> Crafted with
            Care
          </h2>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="glass-effect border-primary/20 hover:border-primary/40 transition-all duration-300 group">
              <CardContent className="p-0">
                <div className="aspect-square bg-gradient-to-br from-primary/20 to-secondary/20 rounded-t-lg flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                  <Image
                    src="https://i.pinimg.com/736x/ad/92/71/ad927162a17f2ab283cf86832bcbafcd.jpg"
                    alt="Premium Popcorn Cup"
                    width={300}
                    height={300}
                    className="rounded-t-lg"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-center">
                    Classic Cup
                  </h3>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-effect border-primary/20 hover:border-primary/40 transition-all duration-300 group">
              <CardContent className="p-0">
                <div className="aspect-square bg-gradient-to-br from-secondary/20 to-primary/20 rounded-t-lg flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                  <Image
                    src="/packaged.jpg"
                    alt="Premium Popcorn Bag"
                    width={300}
                    height={300}
                    className="rounded-t-lg"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-center">
                    Premium Bag
                  </h3>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-effect border-primary/20 hover:border-primary/40 transition-all duration-300 group">
              <CardContent className="p-0">
                <div className="aspect-square bg-gradient-to-br from-primary/20 to-secondary/20 rounded-t-lg flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                  <Image
                    src="/artisanal-popcorn-with-toppings-close-up.jpg"
                    alt="Artisanal Popcorn"
                    width={300}
                    height={300}
                    className="rounded-t-lg"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-center">
                    Artisanal Blend
                  </h3>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Performance Story */}
      <section className="py-20 px-6 bg-card/50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-6 text-balance">
              From Part-Time <span className="text-primary">Hustle</span> to
              <br />
              Full-Time <span className="text-secondary">Powerhouse</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-balance">
              Our historical revenue of{" "}
              <span className="text-primary font-semibold">
                GHS{" "}
                {businessData.financials.summary.totalRevenue.toLocaleString()}
              </span>{" "}
              was achieved in just{" "}
              <span className="text-secondary font-semibold">
                {businessData.financials.summary.totalDaysActive} days
              </span>
              . We project full-time operation can unlock over{" "}
              <span className="text-primary font-semibold">
                GHS{" "}
                {businessData.projections.projectedYearlyRevenue.toLocaleString()}
              </span>{" "}
              in annual revenue.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 max-w-7xl mx-auto">
            {/* Revenue Chart */}
            <Card className="glass-effect border-primary/20">
              <CardHeader>
                <CardTitle className="text-2xl text-center">
                  Monthly Revenue: Actual vs Projected
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={monthlyChartData}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="rgba(255,255,255,0.1)"
                    />
                    <XAxis dataKey="month" stroke="#ffffff" />
                    <YAxis stroke="#ffffff" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "rgba(0,0,0,0.8)",
                        border: "1px solid rgba(59, 130, 246, 0.3)",
                        borderRadius: "8px",
                      }}
                    />
                    <Bar
                      dataKey="actual"
                      fill="rgba(59, 130, 246, 0.8)"
                      name="Actual Revenue"
                    />
                    <Bar
                      dataKey="projected"
                      fill="rgba(251, 191, 36, 0.8)"
                      name="Projected Revenue"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Profit Trend */}
            <Card className="glass-effect border-secondary/20">
              <CardHeader>
                <CardTitle className="text-2xl text-center">
                  Profit Growth Trend
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={monthlyChartData}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="rgba(255,255,255,0.1)"
                    />
                    <XAxis dataKey="month" stroke="#ffffff" />
                    <YAxis stroke="#ffffff" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "rgba(0,0,0,0.8)",
                        border: "1px solid rgba(251, 191, 36, 0.3)",
                        borderRadius: "8px",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="profit"
                      stroke="rgba(251, 191, 36, 1)"
                      strokeWidth={3}
                      dot={{
                        fill: "rgba(251, 191, 36, 1)",
                        strokeWidth: 2,
                        r: 6,
                      }}
                      name="Monthly Profit"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Key Metrics */}
          <div className="grid md:grid-cols-4 gap-6 mt-12">
            <Card className="glass-effect border-primary/20 text-center">
              <CardContent className="p-6">
                <div className="text-3xl font-bold text-primary mb-2">
                  GHS{" "}
                  {businessData.financials.summary.totalRevenue.toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">
                  Total Revenue
                </div>
              </CardContent>
            </Card>

            <Card className="glass-effect border-secondary/20 text-center">
              <CardContent className="p-6">
                <div className="text-3xl font-bold text-secondary mb-2">
                  GHS{" "}
                  {businessData.financials.summary.totalProfit.toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">
                  Total Profit
                </div>
              </CardContent>
            </Card>

            <Card className="glass-effect border-primary/20 text-center">
              <CardContent className="p-6">
                <div className="text-3xl font-bold text-primary mb-2">
                  {businessData.financials.summary.totalDaysActive}
                </div>
                <div className="text-sm text-muted-foreground">Active Days</div>
              </CardContent>
            </Card>

            <Card className="glass-effect border-secondary/20 text-center">
              <CardContent className="p-6">
                <div className="text-3xl font-bold text-secondary mb-2">
                  GHS {Math.round(businessData.operations.averageDailyRevenue)}
                </div>
                <div className="text-sm text-muted-foreground">
                  Daily Average
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Investment Teaser */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-5xl font-bold mb-8 text-balance">
            Be a Part of <span className="text-primary">Our Story</span>
          </h2>

          <Card className="glass-effect border-primary/20 max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="text-2xl">
                Quick Investment Calculator
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Input
                  type="number"
                  placeholder={`Minimum: ${businessData.investmentTerms.minimumInvestment.toLocaleString()}`}
                  value={investmentAmount}
                  onChange={(e) => setInvestmentAmount(e.target.value)}
                  className="text-lg p-4 bg-input/50 border-primary/30"
                />
              </div>

              <Button
                onClick={handleInvestmentCalculation}
                className="w-full glow-border text-lg py-4"
                disabled={!investmentAmount}
              >
                Calculate Potential Return
              </Button>

              {calculatedReturn !== null && calculatedProfit !== null && (
                <div className="space-y-4">
                  <div className="p-6 bg-primary/10 rounded-lg border border-primary/20">
                    <div className="text-center">
                      <div className="text-sm text-muted-foreground mb-2">
                        Projected Return
                      </div>
                      <div className="text-2xl font-bold text-primary mb-2">
                        GHS {calculatedReturn.toLocaleString()}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {Math.round(
                          (calculatedProfit /
                            Number.parseFloat(investmentAmount)) *
                            100
                        )}
                        % ROI
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="p-3 bg-secondary/10 rounded border border-secondary/20">
                      <div className="text-muted-foreground">
                        Your Investment
                      </div>
                      <div className="font-bold text-secondary">
                        GHS{" "}
                        {Number.parseFloat(investmentAmount).toLocaleString()}
                      </div>
                    </div>
                    <div className="p-3 bg-primary/10 rounded border border-primary/20">
                      <div className="text-muted-foreground">
                        Projected Profit
                      </div>
                      <div className="font-bold text-primary">
                        GHS {calculatedProfit.toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <Button
                variant="outline"
                size="lg"
                className="w-full bg-transparent"
                asChild
              >
                <Link href="/invest">See Full Proposal & Terms</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Growth Plans Preview */}
      <section className="py-20 px-6 bg-card/50">
        <div className="container mx-auto">
          <h2 className="text-5xl font-bold text-center mb-16 text-balance">
            Our <span className="text-secondary">Vision</span> & Growth Plan
          </h2>

          <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            <Card className="glass-effect border-primary/20">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-3">
                  <Badge variant="secondary" className="text-sm">
                    Short Term
                  </Badge>
                  Next 12 Months
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {businessData.growthPlans.shortTerm.map((plan, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-muted-foreground">{plan}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="glass-effect border-secondary/20">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-3">
                  <Badge
                    variant="outline"
                    className="text-sm border-secondary text-secondary"
                  >
                    Long Term
                  </Badge>
                  2-5 Years
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {businessData.growthPlans.longTerm.map((plan, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-secondary rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-muted-foreground">{plan}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-12">
            <Button
              size="lg"
              variant="outline"
              className="glow-border bg-transparent"
              asChild
            >
              <Link href="/pitch">See Our Detailed Pitch</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Founder Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-5xl font-bold text-center mb-16 text-balance">
            Meet the <span className="text-primary">Founder</span>
          </h2>

          <Card className="glass-effect border-primary/20">
            <CardContent className="p-12">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div className="text-center lg:text-left">
                  <div className="w-64 h-64 mx-auto lg:mx-0 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center mb-8">
                    <Image
                      src="https://i.pinimg.com/736x/02/a9/20/02a920413749598e5125986909a9f876.jpg"
                      alt="Star Pops Founder"
                      width={256}
                      height={256}
                      className="rounded-full"
                    />
                  </div>
                </div>

                <div className="space-y-6">
                  <h3 className="text-3xl font-bold">
                    The Vision Behind Star Pops
                  </h3>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    As a student at KNUST, I saw an opportunity to bring premium
                    popcorn experiences to campus. What started as a part-time
                    venture has grown into a profitable business with immense
                    potential.
                  </p>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    Our success in just 56 active days proves the market demand.
                    With full-time focus and strategic investment, Star Pops is
                    positioned to become Ghana's premier campus food brand.
                  </p>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    Join us in revolutionizing the campus food experience and
                    building a sustainable, profitable business that brings joy
                    to students across Ghana.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Contact Footer */}
      <section className="py-16 px-6 bg-card/30">
        <div className="container mx-auto text-center">
          <h3 className="text-2xl font-bold mb-6">Ready to Connect?</h3>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <span className="text-muted-foreground">
                {businessData.company.email}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-secondary rounded-full"></div>
              <span className="text-muted-foreground">
                {businessData.company.phone}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <span className="text-muted-foreground">
                {businessData.company.location}
              </span>
            </div>
          </div>
          <Button className="mt-8 glow-border" asChild>
            <Link href="/contact">Get in Touch</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}

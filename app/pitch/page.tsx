"use client";

import type React from "react";

import { useEffect, useState, type KeyboardEvent } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { getBusinessData, type BusinessData } from "@/lib/business-data";
import { ChevronLeft, ChevronRight, Play, Pause } from "lucide-react";
import Image from "next/image";

interface PitchSlide {
  id: number;
  title: string;
  subtitle?: string;
  content: React.ReactNode;
  background?: string;
}

export default function PitchPage() {
  const [businessData, setBusinessData] = useState<BusinessData | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const toggleAutoPlay = () => {
    setIsAutoPlay(!isAutoPlay);
  };

  useEffect(() => {
    const data = getBusinessData();
    setBusinessData(data);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isAutoPlay && businessData) {
      interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [isAutoPlay, businessData]);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight" || event.key === " ") {
        nextSlide();
      } else if (event.key === "ArrowLeft") {
        prevSlide();
      } else if (event.key === "Escape") {
        setIsAutoPlay(false);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, []);

  if (isLoading || !businessData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading pitch deck...</p>
        </div>
      </div>
    );
  }

  const monthlyChartData = businessData.financials.monthlyData.map((month) => ({
    month: month.month.slice(0, 3),
    revenue: month.revenue,
    profit: month.profit,
  }));

  const allocationData = [
    {
      name: "CEO Salary",
      value: businessData.allocation.ceoSalary,
      color: "rgba(59, 130, 246, 0.8)",
    },
    {
      name: "Employee Wages",
      value: businessData.allocation.employeeWages,
      color: "rgba(251, 191, 36, 0.8)",
    },
    {
      name: "Operations",
      value: businessData.allocation.operationalCost,
      color: "rgba(34, 197, 94, 0.8)",
    },
    {
      name: "Reinvestment",
      value: businessData.allocation.reinvestment,
      color: "rgba(168, 85, 247, 0.8)",
    },
  ];

  const slides: PitchSlide[] = [
    {
      id: 1,
      title: "Star Pops",
      subtitle: "KNUST's Premier Popcorn Experience",
      content: (
        <div className="text-center space-y-8">
          <div className="w-40 h-40 bg-primary rounded-full glow-border mx-auto mb-6 flex items-center justify-center">
            <img
              src="https://i.pinimg.com/736x/9d/71/fb/9d71fb1c7ab0c7915863908cfb62068a.jpg" // Replace with your actual image path
              alt="Profile"
              className="w-40 h-40 rounded-full object-cover"
            />
          </div>
          <div className="space-y-4">
            <h2 className="text-6xl font-bold shimmer-text">
              {businessData.company.name}
            </h2>
            <p className="text-2xl text-secondary font-medium">
              {businessData.company.mission}
            </p>
            <p className="text-xl text-muted-foreground">
              {businessData.company.location}
            </p>
          </div>
        </div>
      ),
      background:
        "bg-gradient-to-br from-background via-background/95 to-primary/10",
    },
    {
      id: 2,
      title: "The Problem",
      content: (
        <div className="space-y-8">
          <h2 className="text-5xl font-bold text-center mb-12">
            The Campus Food Challenge
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="glass-effect border-red-500/20 p-8">
              <h3 className="text-2xl font-bold text-red-400 mb-4">
                Current Situation
              </h3>
              <ul className="space-y-3 text-lg text-muted-foreground">
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-red-400 rounded-full mt-3 flex-shrink-0"></div>
                  <span>Limited quality snack options on campus</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-red-400 rounded-full mt-3 flex-shrink-0"></div>
                  <span>Students crave premium, affordable treats</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-red-400 rounded-full mt-3 flex-shrink-0"></div>
                  <span>Existing vendors lack innovation and quality</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-red-400 rounded-full mt-3 flex-shrink-0"></div>
                  <span>No premium popcorn experience available</span>
                </li>
              </ul>
            </Card>
            <Card className="glass-effect border-primary/20 p-8">
              <h3 className="text-2xl font-bold text-primary mb-4">
                Market Opportunity
              </h3>
              <ul className="space-y-3 text-lg text-muted-foreground">
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-3 flex-shrink-0"></div>
                  <span>40,000+ students at KNUST campus</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-3 flex-shrink-0"></div>
                  <span>Growing demand for quality campus food</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-3 flex-shrink-0"></div>
                  <span>Untapped premium snack market</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-3 flex-shrink-0"></div>
                  <span>Scalable to other universities</span>
                </li>
              </ul>
            </Card>
          </div>
        </div>
      ),
    },
    {
      id: 3,
      title: "Our Solution",
      content: (
        <div className="space-y-12">
          <h2 className="text-5xl font-bold text-center">
            Premium Popcorn Experience
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="glass-effect border-primary/20 text-center p-8">
              <div className="w-20 h-20 bg-primary/20 rounded-full mx-auto mb-6 flex items-center justify-center">
                <Image
                  src="/golden-popcorn-in-premium-cup.jpg"
                  alt="Premium Quality"
                  width={60}
                  height={60}
                  className="rounded-full"
                />
              </div>
              <h3 className="text-2xl font-bold text-primary mb-4">
                Premium Quality
              </h3>
              <p className="text-muted-foreground">
                Fresh, artisanal popcorn made with the finest ingredients and
                innovative flavors
              </p>
            </Card>
            <Card className="glass-effect border-secondary/20 text-center p-8">
              <div className="w-20 h-20 bg-secondary/20 rounded-full mx-auto mb-6 flex items-center justify-center">
                <span className="text-3xl">🎯</span>
              </div>
              <h3 className="text-2xl font-bold text-secondary mb-4">
                Strategic Location
              </h3>
              <p className="text-muted-foreground">
                Positioned at high-traffic campus areas for maximum visibility
                and accessibility
              </p>
            </Card>
            <Card className="glass-effect border-primary/20 text-center p-8">
              <div className="w-20 h-20 bg-primary/20 rounded-full mx-auto mb-6 flex items-center justify-center">
                <span className="text-3xl">💰</span>
              </div>
              <h3 className="text-2xl font-bold text-primary mb-4">
                Affordable Luxury
              </h3>
              <p className="text-muted-foreground">
                Premium experience at student-friendly prices, making quality
                accessible to all
              </p>
            </Card>
          </div>
        </div>
      ),
    },
    {
      id: 4,
      title: "Market Validation",
      content: (
        <div className="space-y-12">
          <h2 className="text-5xl font-bold text-center">
            Proven Market Demand
          </h2>
          <div className="grid lg:grid-cols-2 gap-12">
            <Card className="glass-effect border-primary/20 p-8">
              <h3 className="text-3xl font-bold text-primary mb-8 text-center">
                Revenue Performance
              </h3>
              <ResponsiveContainer width="100%" height={300}>
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
                    dataKey="revenue"
                    fill="rgba(59, 130, 246, 0.8)"
                    name="Monthly Revenue"
                  />
                </BarChart>
              </ResponsiveContainer>
            </Card>
            <div className="space-y-6">
              <Card className="glass-effect border-secondary/20 p-6 text-center">
                <div className="text-4xl font-bold text-secondary mb-2">
                  GHS{" "}
                  {businessData.financials.summary.totalRevenue.toLocaleString()}
                </div>
                <div className="text-muted-foreground">Total Revenue</div>
                <Badge variant="secondary" className="mt-2">
                  Part-time Operation
                </Badge>
              </Card>
              <Card className="glass-effect border-primary/20 p-6 text-center">
                <div className="text-4xl font-bold text-primary mb-2">
                  {businessData.financials.summary.totalDaysActive}
                </div>
                <div className="text-muted-foreground">Active Days</div>
                <Badge
                  variant="outline"
                  className="mt-2 border-primary text-primary"
                >
                  GHS {Math.round(businessData.operations.averageDailyRevenue)}{" "}
                  Daily Avg
                </Badge>
              </Card>
              <Card className="glass-effect border-secondary/20 p-6 text-center">
                <div className="text-4xl font-bold text-secondary mb-2">
                  {Math.round(
                    (businessData.financials.summary.totalProfit /
                      businessData.financials.summary.totalRevenue) *
                      100
                  )}
                  %
                </div>
                <div className="text-muted-foreground">Profit Margin</div>
                <Badge variant="secondary" className="mt-2">
                  Strong Unit Economics
                </Badge>
              </Card>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 5,
      title: "Business Model",
      content: (
        <div className="space-y-12">
          <h2 className="text-5xl font-bold text-center">
            Scalable Revenue Model
          </h2>
          <div className="grid lg:grid-cols-2 gap-12">
            <div className="space-y-8">
              <Card className="glass-effect border-primary/20 p-8">
                <h3 className="text-2xl font-bold text-primary mb-6">
                  Revenue Streams
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 bg-primary/10 rounded-lg">
                    <span className="font-medium">Direct Sales</span>
                    <span className="text-primary font-bold">85%</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-secondary/10 rounded-lg">
                    <span className="font-medium">Event Catering</span>
                    <span className="text-secondary font-bold">10%</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-primary/10 rounded-lg">
                    <span className="font-medium">Bulk Orders</span>
                    <span className="text-primary font-bold">5%</span>
                  </div>
                </div>
              </Card>
              <Card className="glass-effect border-secondary/20 p-8">
                <h3 className="text-2xl font-bold text-secondary mb-6">
                  Key Metrics
                </h3>
                <div className="space-y-3 text-lg">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Average Order Value
                    </span>
                    <span className="font-bold">GHS 15</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Daily Customers
                    </span>
                    <span className="font-bold">50-80</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Repeat Customer Rate
                    </span>
                    <span className="font-bold">70%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Gross Margin</span>
                    <span className="font-bold text-primary">65%</span>
                  </div>
                </div>
              </Card>
            </div>
            <Card className="glass-effect border-primary/20 p-8">
              <h3 className="text-2xl font-bold text-primary mb-6 text-center">
                Fund Allocation
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={allocationData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}%`}
                  >
                    {allocationData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(0,0,0,0.8)",
                      border: "1px solid rgba(59, 130, 246, 0.3)",
                      borderRadius: "8px",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </Card>
          </div>
        </div>
      ),
    },
    {
      id: 6,
      title: "Growth Strategy",
      content: (
        <div className="space-y-12">
          <h2 className="text-5xl font-bold text-center">Expansion Roadmap</h2>
          <div className="grid lg:grid-cols-2 gap-12">
            <Card className="glass-effect border-primary/20 p-8">
              <h3 className="text-3xl font-bold text-primary mb-8 text-center">
                Short Term (12 Months)
              </h3>
              <div className="space-y-6">
                {businessData.growthPlans.shortTerm.map((plan, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-4 p-4 bg-primary/10 rounded-lg"
                  >
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                      {index + 1}
                    </div>
                    <p className="text-muted-foreground">{plan}</p>
                  </div>
                ))}
              </div>
            </Card>
            <Card className="glass-effect border-secondary/20 p-8">
              <h3 className="text-3xl font-bold text-secondary mb-8 text-center">
                Long Term (2-5 Years)
              </h3>
              <div className="space-y-6">
                {businessData.growthPlans.longTerm.map((plan, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-4 p-4 bg-secondary/10 rounded-lg"
                  >
                    <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center text-sm font-bold text-black flex-shrink-0">
                      {index + 1}
                    </div>
                    <p className="text-muted-foreground">{plan}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      ),
    },
    {
      id: 7,
      title: "Financial Projections",
      content: (
        <div className="space-y-12">
          <h2 className="text-5xl font-bold text-center">Growth Projections</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="glass-effect border-primary/20 p-8 text-center">
              <h3 className="text-2xl font-bold text-primary mb-4">
                Current Performance
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="text-3xl font-bold text-primary">
                    GHS{" "}
                    {Math.round(businessData.operations.averageDailyRevenue)}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Daily Average (Part-time)
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-secondary">
                    GHS{" "}
                    {businessData.financials.summary.totalRevenue.toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Total Revenue (
                    {businessData.financials.summary.totalDaysActive} days)
                  </div>
                </div>
              </div>
            </Card>
            <Card className="glass-effect border-secondary/20 p-8 text-center">
              <h3 className="text-2xl font-bold text-secondary mb-4">
                Full-Time Projection
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="text-3xl font-bold text-secondary">
                    GHS {businessData.operations.projectedDailyRevenue}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Projected Daily Revenue
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary">
                    GHS{" "}
                    {businessData.operations.projectedMonthlyRevenue.toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Monthly Revenue
                  </div>
                </div>
              </div>
            </Card>
            <Card className="glass-effect border-primary/20 p-8 text-center">
              <h3 className="text-2xl font-bold text-primary mb-4">
                Annual Potential
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="text-3xl font-bold text-primary">
                    GHS{" "}
                    {businessData.projections.projectedYearlyRevenue.toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Projected Annual Revenue
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-secondary">
                    {businessData.projections.projectedYearlyGrowth}%
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Growth Rate
                  </div>
                </div>
              </div>
            </Card>
          </div>
          <Card className="glass-effect border-primary/20 p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-center mb-6">
              Investment Impact
            </h3>
            <div className="grid md:grid-cols-2 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold text-primary mb-2">
                  GHS{" "}
                  {businessData.investmentTerms.minimumInvestment.toLocaleString()}
                </div>
                <div className="text-muted-foreground">Minimum Investment</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-secondary mb-2">
                  {businessData.investmentTerms.discountRate}%
                </div>
                <div className="text-muted-foreground">Discount Rate</div>
              </div>
            </div>
          </Card>
        </div>
      ),
    },
    {
      id: 8,
      title: "Investment Opportunity",
      content: (
        <div className="space-y-12">
          <h2 className="text-5xl font-bold text-center">Join Our Journey</h2>
          <div className="grid lg:grid-cols-2 gap-12">
            <div className="space-y-8">
              <Card className="glass-effect border-primary/20 p-8">
                <h3 className="text-2xl font-bold text-primary mb-6">
                  Why Invest Now?
                </h3>
                <ul className="space-y-4 text-lg">
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-3 flex-shrink-0"></div>
                    <span className="text-muted-foreground">
                      Proven market demand with{" "}
                      {businessData.projections.projectedYearlyGrowth}% growth
                      potential
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-secondary rounded-full mt-3 flex-shrink-0"></div>
                    <span className="text-muted-foreground">
                      Strong unit economics with{" "}
                      {Math.round(
                        (businessData.financials.summary.totalProfit /
                          businessData.financials.summary.totalRevenue) *
                          100
                      )}
                      % profit margin
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-3 flex-shrink-0"></div>
                    <span className="text-muted-foreground">
                      Scalable business model across multiple campuses
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-secondary rounded-full mt-3 flex-shrink-0"></div>
                    <span className="text-muted-foreground">
                      Experienced team with proven execution
                    </span>
                  </li>
                </ul>
              </Card>
              <Card className="glass-effect border-secondary/20 p-8">
                <h3 className="text-2xl font-bold text-secondary mb-6">
                  Investment Terms
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 bg-secondary/10 rounded-lg">
                    <span className="font-medium">Minimum Investment</span>
                    <span className="text-secondary font-bold">
                      GHS{" "}
                      {businessData.investmentTerms.minimumInvestment.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-primary/10 rounded-lg">
                    <span className="font-medium">Valuation Cap</span>
                    <span className="text-primary font-bold">
                      GHS{" "}
                      {businessData.investmentTerms.valuationCap.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-secondary/10 rounded-lg">
                    <span className="font-medium">Discount Rate</span>
                    <span className="text-secondary font-bold">
                      {businessData.investmentTerms.discountRate}%
                    </span>
                  </div>
                </div>
              </Card>
            </div>
            <div className="flex flex-col justify-center items-center space-y-8">
              <div className="text-center">
                <div className="w-32 h-32 bg-primary rounded-full glow-border mx-auto mb-8 flex items-center justify-center float-animation">
                  <span className="text-4xl font-bold text-primary-foreground">
                    SP
                  </span>
                </div>
                <h3 className="text-3xl font-bold mb-4">Ready to Invest?</h3>
                <p className="text-xl text-muted-foreground mb-8">
                  Be part of Ghana's next big food success story
                </p>
              </div>
              <div className="space-y-4 w-full max-w-sm">
                <Button className="w-full glow-border text-lg py-4" size="lg">
                  Calculate Your Returns
                </Button>
                <Button
                  variant="outline"
                  className="w-full bg-transparent text-lg py-4"
                  size="lg"
                >
                  Download Full Proposal
                </Button>
                <Button
                  variant="ghost"
                  className="w-full text-lg py-4"
                  size="lg"
                >
                  Schedule a Meeting
                </Button>
              </div>
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Slide Content */}
      <div
        className={`min-h-screen flex items-center justify-center p-8 ${
          slides[currentSlide].background || "bg-background"
        }`}
      >
        <div className="container mx-auto max-w-7xl">
          {slides[currentSlide].content}
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50">
        <Card className="glass-effect border-primary/20 p-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={prevSlide}
              className="hover:bg-primary/20"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>

            <div className="flex items-center gap-2">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    index === currentSlide
                      ? "bg-primary scale-125"
                      : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                  }`}
                />
              ))}
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={nextSlide}
              className="hover:bg-primary/20"
            >
              <ChevronRight className="w-5 h-5" />
            </Button>

            <div className="w-px h-6 bg-border mx-2" />

            <Button
              variant="ghost"
              size="sm"
              onClick={toggleAutoPlay}
              className="hover:bg-secondary/20"
            >
              {isAutoPlay ? (
                <Pause className="w-5 h-5" />
              ) : (
                <Play className="w-5 h-5" />
              )}
            </Button>

            <div className="text-sm text-muted-foreground ml-2">
              {currentSlide + 1} / {slides.length}
            </div>
          </div>
        </Card>
      </div>

      {/* Slide Title Overlay */}
      <div className="fixed top-8 left-8 z-40">
        <Card className="glass-effect border-primary/20 p-4">
          <h1 className="text-2xl font-bold text-primary">
            {slides[currentSlide].title}
          </h1>
          {slides[currentSlide].subtitle && (
            <p className="text-muted-foreground">
              {slides[currentSlide].subtitle}
            </p>
          )}
        </Card>
      </div>

      {/* Keyboard Navigation Hint */}
      <div className="fixed top-8 right-8 z-40">
        <Card className="glass-effect border-secondary/20 p-3">
          <div className="text-xs text-muted-foreground">
            Use ← → keys or click controls to navigate
          </div>
        </Card>
      </div>
    </div>
  );
}

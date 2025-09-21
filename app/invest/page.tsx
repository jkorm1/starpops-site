"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  getBusinessData,
  calculateInvestmentReturn,
  type BusinessData,
} from "@/lib/business-data";
import { toast } from "@/hooks/use-toast";
import {
  Download,
  Shield,
  TrendingUp,
  Users,
  Target,
  Award,
} from "lucide-react";

export default function InvestPage() {
  const [businessData, setBusinessData] = useState<BusinessData | null>(null);
  const [investmentAmount, setInvestmentAmount] = useState<string>("");
  const [investorName, setInvestorName] = useState<string>("");
  const [investorEmail, setInvestorEmail] = useState<string>("");
  const [investorMessage, setInvestorMessage] = useState<string>("");
  const [calculatedReturn, setCalculatedReturn] = useState<number | null>(null);
  const [calculatedProfit, setCalculatedProfit] = useState<number | null>(null);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const data = getBusinessData();
    setBusinessData(data);
    setIsLoading(false);
  }, []);

  const handleCalculateReturn = () => {
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

  const handleGenerateProposal = () => {
    if (!businessData || !investmentAmount || !investorName || !investorEmail) {
      toast({
        title: "Missing Information",
        description:
          "Please fill in all required fields to generate the proposal.",
        variant: "destructive",
      });
      return;
    }

    // In a real app, this would generate a PDF using jsPDF
    const proposalData = {
      investor: {
        name: investorName,
        email: investorEmail,
        message: investorMessage,
      },
      investment: {
        amount: Number.parseFloat(investmentAmount),
        expectedReturn: calculatedReturn,
      },
      business: businessData,
      timestamp: new Date().toISOString(),
    };

    // Simulate PDF generation
    const blob = new Blob([JSON.stringify(proposalData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `star-pops-investment-proposal-${investorName
      .replace(/\s+/g, "-")
      .toLowerCase()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Proposal Generated",
      description:
        "Your investment proposal has been downloaded. Please email it to us for review.",
    });
  };

  if (isLoading || !businessData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading investment portal...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-6">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold mb-6 text-balance">
            <span className="shimmer-text">Investment</span>{" "}
            <span className="text-primary">Portal</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-balance">
            Join us in revolutionizing campus food experiences. Invest in Star
            Pops and be part of Ghana's next big food success story.
          </p>
        </div>

        {/* Investment Highlights */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="glass-effect border-primary/20 text-center">
            <CardContent className="p-8">
              <TrendingUp className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-2">
                {businessData.projections.projectedYearlyGrowth}%
              </h3>
              <p className="text-muted-foreground">Projected Annual Growth</p>
            </CardContent>
          </Card>

          <Card className="glass-effect border-secondary/20 text-center">
            <CardContent className="p-8">
              <Target className="w-12 h-12 text-secondary mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-2">
                GHS{" "}
                {businessData.projections.projectedYearlyRevenue.toLocaleString()}
              </h3>
              <p className="text-muted-foreground">Projected Annual Revenue</p>
            </CardContent>
          </Card>

          <Card className="glass-effect border-primary/20 text-center">
            <CardContent className="p-8">
              <Award className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-2">
                {Math.round(
                  (businessData.financials.summary.totalProfit /
                    businessData.financials.summary.totalRevenue) *
                    100
                )}
                %
              </h3>
              <p className="text-muted-foreground">Current Profit Margin</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Investment Calculator */}
          <Card className="glass-effect border-primary/20">
            <CardHeader>
              <CardTitle className="text-3xl flex items-center gap-3">
                <div className="w-8 h-8 bg-primary rounded-full glow-border"></div>
                Investment Calculator
              </CardTitle>
              <p className="text-muted-foreground">
                Calculate your potential returns based on our growth projections
                and investment terms.
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="investment-amount" className="text-lg">
                  Investment Amount (GHS)
                </Label>
                <Input
                  id="investment-amount"
                  type="number"
                  step="100"
                  placeholder={`Minimum: ${businessData.investmentTerms.minimumInvestment.toLocaleString()}`}
                  value={investmentAmount}
                  onChange={(e) => setInvestmentAmount(e.target.value)}
                  className="text-xl p-4 bg-input/50 border-primary/30"
                />
                <p className="text-sm text-muted-foreground">
                  Minimum investment: GHS{" "}
                  {businessData.investmentTerms.minimumInvestment.toLocaleString()}
                </p>
              </div>

              <Button
                onClick={handleCalculateReturn}
                className="w-full glow-border text-lg py-4"
                disabled={!investmentAmount}
              >
                Calculate Potential Returns
              </Button>

              {calculatedReturn !== null && calculatedProfit !== null && (
                <div className="space-y-4">
                  <div className="p-6 bg-primary/10 rounded-lg border border-primary/20">
                    <div className="text-center">
                      <div className="text-sm text-muted-foreground mb-2">
                        Projected Return
                      </div>
                      <div className="text-4xl font-bold text-primary mb-2">
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

              <div className="p-4 bg-muted/20 rounded-lg border border-border/50">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-primary" />
                  Investment Terms
                </h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>
                    • {businessData.investmentTerms.discountRate}% discount rate
                    on future equity rounds
                  </li>
                  <li>
                    • Valuation cap: GHS{" "}
                    {businessData.investmentTerms.valuationCap.toLocaleString()}
                  </li>
                  <li>
                    • Minimum investment: GHS{" "}
                    {businessData.investmentTerms.minimumInvestment.toLocaleString()}
                  </li>
                  <li>• Convertible note structure</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Investment Form */}
          <Card className="glass-effect border-secondary/20">
            <CardHeader>
              <CardTitle className="text-3xl flex items-center gap-3">
                <div className="w-8 h-8 bg-secondary rounded-full glow-border"></div>
                Investment Proposal
              </CardTitle>
              <p className="text-muted-foreground">
                Ready to invest? Fill out your details to generate a
                personalized investment proposal.
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="investor-name">Full Name *</Label>
                  <Input
                    id="investor-name"
                    placeholder="Your full name"
                    value={investorName}
                    onChange={(e) => setInvestorName(e.target.value)}
                    className="bg-input/50 border-secondary/30"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="investor-email">Email Address *</Label>
                  <Input
                    id="investor-email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={investorEmail}
                    onChange={(e) => setInvestorEmail(e.target.value)}
                    className="bg-input/50 border-secondary/30"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="investor-message">Message (Optional)</Label>
                <Textarea
                  id="investor-message"
                  placeholder="Tell us about your investment goals and any questions you have..."
                  value={investorMessage}
                  onChange={(e) => setInvestorMessage(e.target.value)}
                  className="bg-input/50 border-secondary/30 min-h-[100px]"
                />
              </div>

              <div className="space-y-4">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full bg-transparent border-primary/30"
                    >
                      View Full Investment Terms
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl glass-effect">
                    <DialogHeader>
                      <DialogTitle className="text-2xl">
                        Complete Investment Terms
                      </DialogTitle>
                    </DialogHeader>

                    <div className="space-y-6 max-h-[32rem] overflow-y-auto text-sm text-muted-foreground">
                      {/* Investment Overview */}
                      <div className="p-4 bg-primary/10 rounded-lg">
                        <h4 className="font-semibold mb-2">
                          Investment Structure
                        </h4>
                        <p>{businessData.investmentTerms.fullTerms}</p>
                        <ul className="mt-2 space-y-1 list-disc list-inside">
                          <li>
                            Minimum investment: GHS{" "}
                            {businessData.investmentTerms.minimumInvestment.toLocaleString()}
                          </li>
                          <li>
                            Valuation cap: GHS{" "}
                            {businessData.investmentTerms.valuationCap.toLocaleString()}
                          </li>
                          <li>
                            Discount rate:{" "}
                            {businessData.investmentTerms.discountRate}% on
                            future equity rounds
                          </li>
                          <li>Instrument: Convertible note (SAFE structure)</li>
                        </ul>
                      </div>

                      {/* Conversion Mechanics */}
                      <div className="p-4 bg-secondary/10 rounded-lg">
                        <h4 className="font-semibold mb-2">
                          Conversion Mechanics
                        </h4>
                        <p>
                          Your investment will convert into equity during our
                          next qualified funding round, based on the valuation
                          cap and discount rate above. If no round occurs within
                          24 months, you may opt for conversion at a mutually
                          agreed valuation or extend the note.
                        </p>
                      </div>

                      {/* Financial Highlights */}
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="p-4 bg-muted/20 rounded-lg">
                          <h4 className="font-semibold mb-2">
                            Financial Highlights
                          </h4>
                          <ul className="space-y-1">
                            <li>
                              • Total Revenue: GHS{" "}
                              {businessData.financials.summary.totalRevenue.toLocaleString()}
                            </li>
                            <li>
                              • Total Profit: GHS{" "}
                              {businessData.financials.summary.totalProfit.toLocaleString()}
                            </li>
                            <li>
                              • Profit Margin:{" "}
                              {Math.round(
                                (businessData.financials.summary.totalProfit /
                                  businessData.financials.summary
                                    .totalRevenue) *
                                  100
                              )}
                              %
                            </li>
                            <li>
                              • Active Days:{" "}
                              {businessData.financials.summary.totalDaysActive}
                            </li>
                          </ul>
                        </div>
                        <div className="p-4 bg-primary/10 rounded-lg">
                          <h4 className="font-semibold mb-2">
                            Growth Projections
                          </h4>
                          <ul className="space-y-1">
                            <li>
                              • Projected Annual Revenue: GHS{" "}
                              {businessData.projections.projectedYearlyRevenue.toLocaleString()}
                            </li>
                            <li>
                              • Growth Rate:{" "}
                              {businessData.projections.projectedYearlyGrowth}%
                            </li>
                            <li>• Market Opportunity: Campus food industry</li>
                            <li>• Expansion Plans: Multi-campus presence</li>
                          </ul>
                        </div>
                      </div>

                      {/* Use of Funds */}
                      <div className="p-4 bg-muted/10 rounded-lg">
                        <h4 className="font-semibold mb-2">Use of Funds</h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            CEO Salary: {businessData.allocation.ceoSalary}%
                          </div>
                          <div>
                            Employee Wages:{" "}
                            {businessData.allocation.employeeWages}%
                          </div>
                          <div>
                            Operations:{" "}
                            {businessData.allocation.operationalCost}%
                          </div>
                          <div>
                            Reinvestment: {businessData.allocation.reinvestment}
                            %
                          </div>
                        </div>
                      </div>

                      {/* Investor Rights */}
                      <div className="p-4 bg-secondary/10 rounded-lg">
                        <h4 className="font-semibold mb-2">Investor Rights</h4>
                        <ul className="space-y-1 list-disc list-inside">
                          <li>
                            Right to convert investment into equity at next
                            funding round
                          </li>
                          <li>Access to quarterly financial updates</li>
                          <li>
                            Priority invitation to shareholder meetings and
                            product launches
                          </li>
                          <li>No voting rights unless converted to equity</li>
                        </ul>
                      </div>

                      {/* Risk Disclosure */}
                      <div className="p-4 bg-destructive/10 rounded-lg border border-destructive/30">
                        <h4 className="font-semibold mb-2 text-destructive">
                          Risk Disclosure
                        </h4>
                        <p>
                          All investments carry risk. Star Pops operates in a
                          seasonal and competitive market. While projections are
                          based on current performance and growth plans, future
                          results may vary. Investors should consider their risk
                          tolerance before committing funds.
                        </p>
                      </div>

                      {/* Legal Disclaimer */}
                      <div className="p-4 bg-muted/20 rounded-lg border border-border/30">
                        <h4 className="font-semibold mb-2">Legal Disclaimer</h4>
                        <p>
                          This overview is for informational purposes only and
                          does not constitute a legally binding investment
                          agreement. Final terms will be outlined in a formal
                          convertible note or SAFE agreement. By investing, you
                          acknowledge and accept the terms and risks described
                          above.
                        </p>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
                <Button
                  onClick={handleGenerateProposal}
                  className="w-full glow-border text-lg py-4"
                  disabled={
                    !investmentAmount || !investorName || !investorEmail
                  }
                >
                  <Download className="w-5 h-5 mr-2" />
                  Generate Investment Proposal
                </Button>
              </div>

              <div className="text-sm text-muted-foreground">
                <p className="mb-2">By generating a proposal, you agree to:</p>
                <ul className="space-y-1 text-xs">
                  <li>
                    • Receive follow-up communications about this investment
                    opportunity
                  </li>
                  <li>
                    • Provide accurate information for due diligence purposes
                  </li>
                  <li>
                    • Understand that this is not a binding commitment to invest
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Why Invest Section */}
        <div className="mt-20">
          <h2 className="text-4xl font-bold text-center mb-12 text-balance">
            Why Invest in <span className="text-primary">Star Pops</span>?
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="glass-effect border-primary/20">
              <CardContent className="p-8 text-center">
                <TrendingUp className="w-16 h-16 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-4">Proven Growth</h3>
                <p className="text-muted-foreground">
                  GHS{" "}
                  {businessData.financials.summary.totalRevenue.toLocaleString()}{" "}
                  revenue in just{" "}
                  {businessData.financials.summary.totalDaysActive} days of
                  part-time operation demonstrates strong market demand.
                </p>
              </CardContent>
            </Card>

            <Card className="glass-effect border-secondary/20">
              <CardContent className="p-8 text-center">
                <Users className="w-16 h-16 text-secondary mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-4">Captive Market</h3>
                <p className="text-muted-foreground">
                  KNUST campus provides a consistent customer base of thousands
                  of students with proven demand for quality food options.
                </p>
              </CardContent>
            </Card>

            <Card className="glass-effect border-primary/20">
              <CardContent className="p-8 text-center">
                <Target className="w-16 h-16 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-4">Scalable Model</h3>
                <p className="text-muted-foreground">
                  Our business model is easily replicable across multiple
                  campuses, creating opportunities for rapid expansion.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Contact Section */}
        <div className="mt-20 text-center">
          <Card className="glass-effect border-primary/20 max-w-2xl mx-auto">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-4">
                Ready to Discuss Your Investment?
              </h3>
              <p className="text-muted-foreground mb-6">
                Have questions about the opportunity? Want to schedule a call?
                We're here to help.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button className="glow-border">Schedule a Call</Button>
                <Button variant="outline" className="bg-transparent">
                  Email Us Directly
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { jsPDF } from "jspdf";
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
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [investorEmail, setInvestorEmail] = useState<string>("");
  const [calculatedReturn, setCalculatedReturn] = useState<number | null>(null);
  const [calculatedProfit, setCalculatedProfit] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [previewPDF, setPreviewPDF] = useState<jsPDF | null>(null);

  useEffect(() => {
    const data = getBusinessData();
    setBusinessData(data);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (!businessData || !investmentAmount) {
      setCalculatedReturn(null);
      setCalculatedProfit(null);
      return;
    }

    const amount = Number.parseFloat(investmentAmount);
    if (
      isNaN(amount) ||
      amount < businessData.investmentTerms.minimumInvestment
    ) {
      setCalculatedReturn(null);
      setCalculatedProfit(null);
      return;
    }

    const result = calculateInvestmentReturn(amount);
    setCalculatedReturn(result.totalReturn);
    setCalculatedProfit(result.profit);

    // Optional: For debugging quarterly breakdown
    console.log("Quarterly Payments:", result.paymentSchedule);
  }, [investmentAmount, businessData]);

  const generateProposalPDF = () => {
    if (!businessData) return null;

    const doc = new jsPDF();
    const pageWidth = 210; // A4 width in mm
    const pageMargin = 14; // left/right margin
    const textMaxWidth = pageWidth - pageMargin * 2;

    let y = 20;

    // --- Header ---
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text("Star Pops Investment Proposal", pageMargin, y);
    y += 12;

    // --- Date ---
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(`Date: ${new Date().toLocaleDateString()}`, pageMargin, y);
    y += 10;

    // --- Investor Details ---
    doc.setFont("helvetica", "bold");
    doc.text("Investor Details:", pageMargin, y);
    y += 8;

    doc.setFont("helvetica", "normal");
    const investorLines = [
      `First Name: ${firstName}`,
      `Last Name: ${lastName}`,
      `Email: ${investorEmail}`,
    ];
    investorLines.forEach((line) => {
      doc.text(line, pageMargin, y);
      y += 6;
    });
    y += 4;

    // --- Investment Summary ---
    doc.setFont("helvetica", "bold");
    doc.text("Investment Summary:", pageMargin, y);
    y += 8;

    doc.setFont("helvetica", "normal");
    const amount = parseFloat(investmentAmount);
    const summaryLines = [`Investment Amount: GHS ${amount.toLocaleString()}`];

    if (calculatedReturn !== null && calculatedProfit !== null) {
      summaryLines.push(
        `Expected Profit: GHS ${calculatedProfit.toLocaleString()}`,
        `Total Return: GHS ${calculatedReturn.toLocaleString()}`
      );
    }

    summaryLines.forEach((line) => {
      doc.text(line, pageMargin, y);
      y += 6;
    });
    y += 4;

    // --- Investment Terms ---
    doc.setFont("helvetica", "bold");
    doc.text("Investment Terms:", pageMargin, y);
    y += 8;

    doc.setFont("helvetica", "normal");
    const termsLines = doc.splitTextToSize(
      businessData.investmentTerms.fullTerms,
      textMaxWidth
    );
    termsLines.forEach((line) => {
      if (y > 270) {
        // page break
        doc.addPage();
        y = 20;
      }
      doc.text(line, pageMargin, y);
      y += 6;
    });
    y += 10;

    // --- Footer ---
    const footerText =
      "Please email this proposal to starpops001@gmail.com for review. Once approved, an account will be set up for your investment.";
    const wrappedFooter = doc.splitTextToSize(footerText, textMaxWidth);

    wrappedFooter.forEach((line, i) => {
      if (y > 270) {
        // page break
        doc.addPage();
        y = 20;
      }
      doc.setFont("helvetica", "italic");
      doc.text(line, pageMargin, y + i * 6);
    });

    return doc;
  };

  const handlePreviewProposal = () => {
    const pdf = generateProposalPDF();
    if (pdf) setPreviewPDF(pdf);
  };

  const handleDownloadProposal = () => {
    if (previewPDF) {
      previewPDF.save(
        `star-pops-investment-proposal-${firstName.toLowerCase()}-${lastName.toLowerCase()}.pdf`
      );
      toast({
        title: "Proposal Downloaded",
        description:
          "Please email this PDF to starpops001@gmail.com for review.",
      });
    }
  };

  if (isLoading || !businessData) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-lg text-muted-foreground">
          Loading investment data...
        </p>
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
                    • Minimum investment: GHS{" "}
                    {businessData.investmentTerms.minimumInvestment.toLocaleString()}
                  </li>
                  <li>
                    • Investors receive{" "}
                    {Math.round(businessData.investmentTerms.profitRate * 100)}%
                    profit on their investment
                  </li>
                  <li>
                    • Full repayment completed within{" "}
                    {businessData.investmentTerms.durationYears} years
                  </li>
                  <li>
                    • Payments released{" "}
                    {businessData.investmentTerms.payoutFrequency.toLowerCase()}{" "}
                    (every 3 months)
                  </li>
                  <li>
                    • Once fully paid, investor is detached from the business
                  </li>
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
                  <Label htmlFor="first-name">First Name *</Label>
                  <Input
                    id="first-name"
                    placeholder="First Name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="bg-input/50 border-secondary/30"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="last-name">Last Name *</Label>
                  <Input
                    id="last-name"
                    placeholder="Last Name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
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
                            Investors receive{" "}
                            {businessData.investmentTerms.profitRate * 100}%
                            profit on their investment
                          </li>
                          <li>
                            Payments released{" "}
                            {businessData.investmentTerms.payoutFrequency.toLowerCase()}{" "}
                            (every 3 months)
                          </li>
                          <li>
                            Full repayment completed within{" "}
                            {businessData.investmentTerms.durationYears} years
                          </li>
                          <li>
                            Once fully paid, investor is detached from the
                            business
                          </li>
                        </ul>
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
                            Right to participate in future funding rounds
                            through a convertible note/SAFE
                          </li>
                          <li>Access to quarterly financial updates</li>
                          <li>
                            Priority invitation to business review meetings and
                            product launches
                          </li>
                          <li>
                            No voting rights unless investment converts in the
                            future
                          </li>
                        </ul>
                      </div>

                      {/* Risk Disclosure */}
                      <div className="p-4 bg-destructive/10 rounded-lg border border-destructive/30">
                        <h4 className="font-semibold mb-2 text-destructive">
                          Risk Disclosure
                        </h4>
                        <p>
                          All investments carry risk. Star Pops operates in a
                          seasonal and competitive food market. Key risks
                          include changes in student population, raw material
                          price fluctuations, and competition from other food
                          vendors. While projections are based on strong initial
                          performance, actual future results may vary. Investors
                          should carefully consider their risk tolerance before
                          committing funds.
                        </p>
                      </div>

                      {/* Legal Disclaimer */}
                      <div className="p-4 bg-muted/20 rounded-lg border border-border/30">
                        <h4 className="font-semibold mb-2">Legal Disclaimer</h4>
                        <p>
                          This document is for informational purposes only and
                          does not constitute a legally binding agreement. Final
                          investment terms, repayment schedules, and any
                          optional SAFE arrangements will be outlined in a
                          separate signed contract. By expressing interest, you
                          acknowledge the risks described above and agree that
                          this proposal alone does not represent a binding
                          commitment to invest.
                        </p>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>

                <div className="flex flex-col md:flex-row gap-4 mt-4">
                  <Button
                    onClick={handlePreviewProposal}
                    className="w-full md:w-1/2 glow-border text-lg py-4"
                    disabled={
                      !investmentAmount ||
                      !firstName ||
                      !lastName ||
                      !investorEmail
                    }
                  >
                    Preview Proposal
                  </Button>

                  <Button
                    onClick={handleDownloadProposal}
                    className="w-full md:w-1/2 glow-border text-lg py-4"
                    disabled={!previewPDF}
                  >
                    Download Proposal
                  </Button>
                </div>

                {previewPDF && (
                  <div className="mt-6 border rounded-lg overflow-hidden h-[600px]">
                    <iframe
                      src={previewPDF.output("datauristring")}
                      width="100%"
                      height="100%"
                    />
                  </div>
                )}
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

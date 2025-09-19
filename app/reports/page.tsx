"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
  Area,
  AreaChart,
} from "recharts"
import { getBusinessData, saveBusinessData, type BusinessData, type MonthlyData } from "@/lib/business-data"
import { toast } from "@/hooks/use-toast"

const COLORS = {
  primary: "rgba(59, 130, 246, 0.8)",
  secondary: "rgba(251, 191, 36, 0.8)",
  success: "rgba(34, 197, 94, 0.8)",
  warning: "rgba(245, 158, 11, 0.8)",
  danger: "rgba(239, 68, 68, 0.8)",
}

export default function ReportsPage() {
  const [businessData, setBusinessData] = useState<BusinessData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [newMonthData, setNewMonthData] = useState({
    month: "",
    revenue: "",
    expenses: "",
    daysActive: "",
  })

  useEffect(() => {
    const data = getBusinessData()
    setBusinessData(data)
    setIsLoading(false)
  }, [])

  const handleAddMonthData = () => {
    if (
      !businessData ||
      !newMonthData.month ||
      !newMonthData.revenue ||
      !newMonthData.expenses ||
      !newMonthData.daysActive
    ) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields to add new month data.",
        variant: "destructive",
      })
      return
    }

    const revenue = Number.parseFloat(newMonthData.revenue)
    const expenses = Number.parseFloat(newMonthData.expenses)
    const daysActive = Number.parseInt(newMonthData.daysActive)

    if (isNaN(revenue) || isNaN(expenses) || isNaN(daysActive)) {
      toast({
        title: "Invalid Data",
        description: "Please enter valid numbers for revenue, expenses, and days active.",
        variant: "destructive",
      })
      return
    }

    const newMonth: MonthlyData = {
      month: newMonthData.month,
      revenue,
      expenses,
      profit: revenue - expenses,
      daysActive,
    }

    // Update business data
    const updatedData = {
      ...businessData,
      financials: {
        ...businessData.financials,
        monthlyData: [...businessData.financials.monthlyData, newMonth],
        summary: {
          ...businessData.financials.summary,
          totalRevenue: businessData.financials.summary.totalRevenue + revenue,
          totalExpenses: businessData.financials.summary.totalExpenses + expenses,
          totalProfit: businessData.financials.summary.totalProfit + (revenue - expenses),
          totalDaysActive: businessData.financials.summary.totalDaysActive + daysActive,
        },
      },
    }

    // Recalculate averages
    updatedData.financials.summary.averageMonthlyRevenue =
      updatedData.financials.summary.totalRevenue / updatedData.financials.monthlyData.length

    updatedData.operations.averageDailyRevenue =
      updatedData.financials.summary.totalRevenue / updatedData.financials.summary.totalDaysActive

    setBusinessData(updatedData)
    saveBusinessData(updatedData)

    // Reset form
    setNewMonthData({
      month: "",
      revenue: "",
      expenses: "",
      daysActive: "",
    })

    toast({
      title: "Data Updated",
      description: `Successfully added data for ${newMonth.month}. All metrics have been recalculated.`,
    })
  }

  if (isLoading || !businessData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading financial reports...</p>
        </div>
      </div>
    )
  }

  // Prepare chart data
  const monthlyChartData = businessData.financials.monthlyData.map((month) => ({
    month: month.month.slice(0, 3),
    revenue: month.revenue,
    expenses: month.expenses,
    profit: month.profit,
    daysActive: month.daysActive,
  }))

  const expenseBreakdownData = [
    { name: "Raw Materials", value: businessData.financials.expenseBreakdown.rawMaterials, color: COLORS.primary },
    { name: "Packaging", value: businessData.financials.expenseBreakdown.packaging, color: COLORS.secondary },
    { name: "Operations", value: businessData.financials.expenseBreakdown.operations, color: COLORS.success },
    { name: "Employee", value: businessData.financials.expenseBreakdown.employee, color: COLORS.warning },
    { name: "Transport", value: businessData.financials.expenseBreakdown.transport, color: COLORS.danger },
    { name: "Other", value: businessData.financials.expenseBreakdown.other, color: "rgba(168, 85, 247, 0.8)" },
  ].filter((item) => item.value > 0)

  const allocationData = [
    { name: "CEO Salary", value: businessData.allocation.ceoSalary, color: COLORS.primary },
    { name: "Employee Wages", value: businessData.allocation.employeeWages, color: COLORS.secondary },
    { name: "Operational Cost", value: businessData.allocation.operationalCost, color: COLORS.success },
    { name: "Reinvestment", value: businessData.allocation.reinvestment, color: COLORS.warning },
  ]

  return (
    <div className="min-h-screen py-12 px-6">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 text-balance">
            Financial <span className="text-primary">Reports</span> & Analytics
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Comprehensive financial analysis and data management for Star Pops business operations
          </p>
        </div>

        <Tabs defaultValue="overview" className="space-y-8">
          <TabsList className="grid w-full grid-cols-4 glass-effect">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="detailed">Detailed Analysis</TabsTrigger>
            <TabsTrigger value="projections">Projections</TabsTrigger>
            <TabsTrigger value="update">Update Data</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-8">
            {/* Key Metrics */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="glass-effect border-primary/20">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-primary mb-2">
                    GHS {businessData.financials.summary.totalRevenue.toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground">Total Revenue</div>
                  <Badge variant="secondary" className="mt-2">
                    +{businessData.projections.projectedYearlyGrowth}% Projected
                  </Badge>
                </CardContent>
              </Card>

              <Card className="glass-effect border-secondary/20">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-secondary mb-2">
                    GHS {businessData.financials.summary.totalProfit.toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground">Total Profit</div>
                  <Badge variant="outline" className="mt-2 border-secondary text-secondary">
                    {Math.round(
                      (businessData.financials.summary.totalProfit / businessData.financials.summary.totalRevenue) *
                        100,
                    )}
                    % Margin
                  </Badge>
                </CardContent>
              </Card>

              <Card className="glass-effect border-primary/20">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-primary mb-2">
                    GHS {Math.round(businessData.operations.averageDailyRevenue)}
                  </div>
                  <div className="text-sm text-muted-foreground">Daily Average</div>
                  <Badge variant="secondary" className="mt-2">
                    {businessData.financials.summary.totalDaysActive} Days Active
                  </Badge>
                </CardContent>
              </Card>

              <Card className="glass-effect border-secondary/20">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-secondary mb-2">
                    {businessData.financials.summary.bestSalesMonth}
                  </div>
                  <div className="text-sm text-muted-foreground">Best Month</div>
                  <Badge variant="outline" className="mt-2 border-secondary text-secondary">
                    GHS {businessData.financials.summary.bestSalesMonthRevenue.toLocaleString()}
                  </Badge>
                </CardContent>
              </Card>
            </div>

            {/* Revenue vs Expenses Chart */}
            <Card className="glass-effect border-primary/20">
              <CardHeader>
                <CardTitle className="text-2xl">Monthly Revenue vs Expenses</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={monthlyChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="month" stroke="#ffffff" />
                    <YAxis stroke="#ffffff" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "rgba(0,0,0,0.8)",
                        border: "1px solid rgba(59, 130, 246, 0.3)",
                        borderRadius: "8px",
                      }}
                    />
                    <Bar dataKey="revenue" fill={COLORS.primary} name="Revenue" />
                    <Bar dataKey="expenses" fill={COLORS.secondary} name="Expenses" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Detailed Analysis Tab */}
          <TabsContent value="detailed" className="space-y-8">
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Profit Trend */}
              <Card className="glass-effect border-primary/20">
                <CardHeader>
                  <CardTitle className="text-2xl">Profit Trend Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={350}>
                    <AreaChart data={monthlyChartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                      <XAxis dataKey="month" stroke="#ffffff" />
                      <YAxis stroke="#ffffff" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "rgba(0,0,0,0.8)",
                          border: "1px solid rgba(59, 130, 246, 0.3)",
                          borderRadius: "8px",
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="profit"
                        stroke={COLORS.primary}
                        fill={COLORS.primary}
                        fillOpacity={0.3}
                        name="Monthly Profit"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Expense Breakdown */}
              <Card className="glass-effect border-secondary/20">
                <CardHeader>
                  <CardTitle className="text-2xl">Expense Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={350}>
                    <PieChart>
                      <Pie
                        data={expenseBreakdownData}
                        cx="50%"
                        cy="50%"
                        outerRadius={120}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {expenseBreakdownData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "rgba(0,0,0,0.8)",
                          border: "1px solid rgba(251, 191, 36, 0.3)",
                          borderRadius: "8px",
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Monthly Data Table */}
            <Card className="glass-effect border-primary/20">
              <CardHeader>
                <CardTitle className="text-2xl">Monthly Performance Data</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left p-4">Month</th>
                        <th className="text-right p-4">Revenue</th>
                        <th className="text-right p-4">Expenses</th>
                        <th className="text-right p-4">Profit</th>
                        <th className="text-right p-4">Days Active</th>
                        <th className="text-right p-4">Daily Avg</th>
                      </tr>
                    </thead>
                    <tbody>
                      {businessData.financials.monthlyData.map((month, index) => (
                        <tr key={index} className="border-b border-border/50">
                          <td className="p-4 font-medium">{month.month}</td>
                          <td className="p-4 text-right text-primary">GHS {month.revenue.toLocaleString()}</td>
                          <td className="p-4 text-right text-secondary">GHS {month.expenses.toLocaleString()}</td>
                          <td className={`p-4 text-right ${month.profit >= 0 ? "text-green-400" : "text-red-400"}`}>
                            GHS {month.profit.toLocaleString()}
                          </td>
                          <td className="p-4 text-right">{month.daysActive}</td>
                          <td className="p-4 text-right">GHS {Math.round(month.revenue / month.daysActive)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Projections Tab */}
          <TabsContent value="projections" className="space-y-8">
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Financial Projections */}
              <Card className="glass-effect border-primary/20">
                <CardHeader>
                  <CardTitle className="text-2xl">Growth Projections</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex justify-between items-center p-4 bg-primary/10 rounded-lg">
                    <span className="text-muted-foreground">Current Daily Average</span>
                    <span className="text-xl font-bold text-primary">
                      GHS {Math.round(businessData.operations.averageDailyRevenue)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-secondary/10 rounded-lg">
                    <span className="text-muted-foreground">Projected Daily Revenue</span>
                    <span className="text-xl font-bold text-secondary">
                      GHS {businessData.operations.projectedDailyRevenue}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-primary/10 rounded-lg">
                    <span className="text-muted-foreground">Projected Monthly Revenue</span>
                    <span className="text-xl font-bold text-primary">
                      GHS {businessData.operations.projectedMonthlyRevenue.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-secondary/10 rounded-lg">
                    <span className="text-muted-foreground">Projected Yearly Revenue</span>
                    <span className="text-xl font-bold text-secondary">
                      GHS {businessData.projections.projectedYearlyRevenue.toLocaleString()}
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Money Allocation Strategy */}
              <Card className="glass-effect border-secondary/20">
                <CardHeader>
                  <CardTitle className="text-2xl">Profit Allocation Strategy</CardTitle>
                </CardHeader>
                <CardContent>
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
                          border: "1px solid rgba(251, 191, 36, 0.3)",
                          borderRadius: "8px",
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Key Insights */}
            <Card className="glass-effect border-primary/20">
              <CardHeader>
                <CardTitle className="text-2xl">Key Financial Insights</CardTitle>
              </CardHeader>
              <CardContent className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-primary">Growth Potential</h4>
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <span>
                        {businessData.projections.projectedYearlyGrowth}% projected yearly growth based on full-time
                        operations
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-secondary rounded-full mt-2 flex-shrink-0"></div>
                      <span>
                        Current profit margin of{" "}
                        {Math.round(
                          (businessData.financials.summary.totalProfit / businessData.financials.summary.totalRevenue) *
                            100,
                        )}
                        % demonstrates strong unit economics
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <span>
                        {businessData.projections.potentialYearlySellingDays} potential selling days per academic year
                      </span>
                    </li>
                  </ul>
                </div>
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-secondary">Operational Efficiency</h4>
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-secondary rounded-full mt-2 flex-shrink-0"></div>
                      <span>
                        Average daily revenue of GHS {Math.round(businessData.operations.averageDailyRevenue)} achieved
                        part-time
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <span>
                        Best performing month: {businessData.financials.summary.bestSalesMonth} with GHS{" "}
                        {businessData.financials.summary.bestSalesMonthRevenue.toLocaleString()}
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-secondary rounded-full mt-2 flex-shrink-0"></div>
                      <span>Proven demand across {businessData.operations.academicMonths.length} academic months</span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Update Data Tab */}
          <TabsContent value="update" className="space-y-8">
            <Card className="glass-effect border-primary/20 max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle className="text-2xl text-center">Add New Month Data</CardTitle>
                <p className="text-muted-foreground text-center">
                  Input new sales data to update all financial metrics and projections
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="month">Month</Label>
                    <Input
                      id="month"
                      placeholder="e.g., September"
                      value={newMonthData.month}
                      onChange={(e) => setNewMonthData((prev) => ({ ...prev, month: e.target.value }))}
                      className="bg-input/50 border-primary/30"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="daysActive">Days Active</Label>
                    <Input
                      id="daysActive"
                      type="number"
                      placeholder="e.g., 20"
                      value={newMonthData.daysActive}
                      onChange={(e) => setNewMonthData((prev) => ({ ...prev, daysActive: e.target.value }))}
                      className="bg-input/50 border-primary/30"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="revenue">Total Revenue (GHS)</Label>
                    <Input
                      id="revenue"
                      type="number"
                      step="0.01"
                      placeholder="e.g., 2500.00"
                      value={newMonthData.revenue}
                      onChange={(e) => setNewMonthData((prev) => ({ ...prev, revenue: e.target.value }))}
                      className="bg-input/50 border-primary/30"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="expenses">Total Expenses (GHS)</Label>
                    <Input
                      id="expenses"
                      type="number"
                      step="0.01"
                      placeholder="e.g., 1200.00"
                      value={newMonthData.expenses}
                      onChange={(e) => setNewMonthData((prev) => ({ ...prev, expenses: e.target.value }))}
                      className="bg-input/50 border-secondary/30"
                    />
                  </div>
                </div>

                {newMonthData.revenue && newMonthData.expenses && (
                  <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
                    <div className="text-center">
                      <div className="text-sm text-muted-foreground mb-1">Calculated Profit</div>
                      <div
                        className={`text-2xl font-bold ${
                          (Number.parseFloat(newMonthData.revenue) - Number.parseFloat(newMonthData.expenses)) >= 0
                            ? "text-green-400"
                            : "text-red-400"
                        }`}
                      >
                        GHS{" "}
                        {(
                          Number.parseFloat(newMonthData.revenue) - Number.parseFloat(newMonthData.expenses)
                        ).toLocaleString()}
                      </div>
                    </div>
                  </div>
                )}

                <Button
                  onClick={handleAddMonthData}
                  className="w-full glow-border text-lg py-4"
                  disabled={
                    !newMonthData.month || !newMonthData.revenue || !newMonthData.expenses || !newMonthData.daysActive
                  }
                >
                  Add Month Data & Update Metrics
                </Button>

                <div className="text-sm text-muted-foreground text-center">
                  <p>This will automatically update:</p>
                  <ul className="mt-2 space-y-1">
                    <li>• Total revenue, expenses, and profit</li>
                    <li>• Average daily and monthly revenue</li>
                    <li>• All charts and projections</li>
                    <li>• Homepage performance metrics</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

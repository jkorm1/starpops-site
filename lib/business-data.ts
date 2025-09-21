// Central data system for Star Pops business portal
export interface MonthlyData {
  month: string
  year: number // Added year field for multi-year support
  revenue: number
  expenses: number
  profit: number
  daysActive: number
  dateAdded: string // Added timestamp for when data was entered
}

export interface BusinessData {
  company: {
    name: string
    email: string
    phone: string
    location: string
    mission: string
  }
  financials: {
    summary: {
      totalRevenue: number
      totalExpenses: number
      totalProfit: number
      averageMonthlyRevenue: number
      bestSalesMonth: string
      bestSalesMonthRevenue: number
      totalDaysActive: number
    }
    expenseBreakdown: {
      rawMaterials: number
      packaging: number
      operations: number
      employee: number
      transport: number
      other: number
    }
    monthlyData: MonthlyData[]
  }
  operations: {
    academicMonths: string[]
    averageDailyRevenue: number
    projectedDailyRevenue: number
    projectedMonthlyRevenue: number
  }
  projections: {
    potentialYearlySellingDays: number
    projectedYearlyRevenue: number
    projectedYearlyGrowth: number
  }
  allocation: {
    ceoSalary: number
    employeeWages: number
    operationalCost: number
    reinvestment: number
  }
  growthPlans: {
    shortTerm: string[]
    longTerm: string[]
  }
  investmentTerms: {
    minimumInvestment: number
    valuationCap: number
    discountRate: number
    fullTerms: string
  }
}

// Default business data based on the Excel sheet
export const defaultBusinessData: BusinessData = {
  company: {
    name: "Star Pops",
    email: "starpops001@gmail,com",
    phone: "+233 53 365 2730",
    location: "KNUST, Kumasi",
    mission: "feel the pops!",
  },
  financials: {
    summary: {
      totalRevenue: 11372,
      totalExpenses: 7043,
      totalProfit: 4329,
      averageMonthlyRevenue: 1624.57, // 11372 / 7 active months
      bestSalesMonth: "June",
      bestSalesMonthRevenue: 4250,
      totalDaysActive: 56,
    },
    expenseBreakdown: {
      rawMaterials: 1600, // Maize + Sugar
      packaging: 165, // Package expenses
      operations: 613, // Oil + Milk + Flavour + Margarine
      employee: 300, // Employee costs
      transport: 365, // Transport costs
      other: 4000, // Toppings, Stand, other expenses
    },
    monthlyData: [
      {
        month: "February",
        year: 2025,
        revenue: 526,
        expenses: 1366,
        profit: -840,
        daysActive: 6,
        dateAdded: "2025-02-28",
      },
      { month: "March", year: 2025, revenue: 552, expenses: 527, profit: 25, daysActive: 6, dateAdded: "2025-03-31" },
      { month: "April", year: 2025, revenue: 1169, expenses: 0, profit: 1169, daysActive: 7, dateAdded: "2025-04-30" },
      {
        month: "June",
        year: 2025,
        revenue: 4250,
        expenses: 2354,
        profit: 1896,
        daysActive: 22,
        dateAdded: "2025-06-30",
      },
      { month: "July", year: 2025, revenue: 2425, expenses: 1482, profit: 943, daysActive: 9, dateAdded: "2025-07-31" },
      {
        month: "August",
        year: 2025,
        revenue: 2450,
        expenses: 1314,
        profit: 1136,
        daysActive: 6,
        dateAdded: "2025-08-31",
      },
    ],
  },
  operations: {
    academicMonths: ["January", "February", "March", "April", "June", "July", "August"],
    averageDailyRevenue: 203.07, // 11372 / 56 days
    projectedDailyRevenue: 300, // Projected full-time capacity
    projectedMonthlyRevenue: 6300, // 300 * 21 working days
  },
  projections: {
    potentialYearlySellingDays: 168, // 21 days * 8 months
    projectedYearlyRevenue: 50400, // 6300 * 8 months
    projectedYearlyGrowth: 343, // % increase from current
  },
  allocation: {
    ceoSalary: 15,
    employeeWages: 20,
    operationalCost: 40,
    reinvestment: 25,
  },
  growthPlans: {
    shortTerm: [
      "Establish new branches across KNUST campus",
      "Develop a strong reputation and brand presence",
      "Create an event catering branch for campus functions",
      "Expand product variety with premium flavors",
    ],
    longTerm: [
      "Launch All-in-One Popcorn Packs for retail distribution",
      "Implement nitrogen packaging for extended shelf life",
      "Establish our own popcorn farm for supply chain control",
      "Franchise the Star Pops model to other universities",
    ],
  },
  investmentTerms: {
    minimumInvestment: 1000,
    valuationCap: 500000,
    discountRate: 20,
    fullTerms:
      "Investment terms include 20% discount rate on future equity rounds, minimum investment of GHS 5,000, and participation in our growth journey to become Ghana's premier campus food brand.",
  },
}

// Data management functions
export const getBusinessData = (): BusinessData => {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem("starPopsData")
    if (stored) {
      try {
        return JSON.parse(stored)
      } catch (e) {
        console.error("Error parsing stored data:", e)
      }
    }
  }
  return defaultBusinessData
}

export const saveBusinessData = (data: BusinessData): void => {
  if (typeof window !== "undefined") {
    localStorage.setItem("starPopsData", JSON.stringify(data))
  }
}

export const calculateInvestmentReturn = (investment: number) => {
  const returnRate = 0.2 // 20% return
  const profit = investment * returnRate
  const total = investment + profit
  return {
    investment,
    profit: Math.round(profit),
    totalReturn: Math.round(total),
  }
}


export const resetToOriginalData = (password: string): boolean => {
  const ADMIN_PASSWORD = "jkorm" // You can change this password

  if (password !== ADMIN_PASSWORD) {
    return false
  }

  if (typeof window !== "undefined") {
    localStorage.removeItem("starPopsData")
  }
  return true
}

export const getAvailableYears = (data: BusinessData): number[] => {
  const years = data.financials.monthlyData.map((month) => month.year)
  return [...new Set(years)].sort((a, b) => b - a) // Sort descending (newest first)
}

export const getMonthsForYear = (data: BusinessData, year: number): MonthlyData[] => {
  return data.financials.monthlyData.filter((month) => month.year === year)
}

export const getNextAvailableMonth = (data: BusinessData): { month: string; year: number } => {
  const currentDate = new Date()
  const currentYear = currentDate.getFullYear()
  const currentMonth = currentDate.getMonth() + 1 // 0-indexed to 1-indexed

  // Get the latest entry
  const sortedData = [...data.financials.monthlyData].sort((a, b) => {
    if (a.year !== b.year) return b.year - a.year
    return new Date(`${a.month} 1, ${a.year}`).getMonth() - new Date(`${b.month} 1, ${b.year}`).getMonth()
  })

  if (sortedData.length === 0) {
    return { month: getMonthName(currentMonth), year: currentYear }
  }

  const latestEntry = sortedData[0]
  const latestMonthIndex = getMonthIndex(latestEntry.month)

  // Calculate next month
  let nextMonth = latestMonthIndex + 1
  let nextYear = latestEntry.year

  if (nextMonth > 12) {
    nextMonth = 1
    nextYear += 1
  }

  return { month: getMonthName(nextMonth), year: nextYear }
}

const getMonthName = (monthIndex: number): string => {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]
  return months[monthIndex - 1]
}

const getMonthIndex = (monthName: string): number => {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]
  return months.indexOf(monthName) + 1
}

import { importaciones } from 'src/app/Core/utilities/material/material';
import { Component, type OnInit } from "@angular/core"
import { FormControl, FormGroup } from "@angular/forms"
import {
  SALES_SUMMARY_DATA,
  SALES_TREND_DATA,
  SALES_TRANSACTIONS_DATA,
  DAILY_SALES_DATA,
  SALES_BY_CATEGORY_DATA,
  SALES_BY_EMPLOYEE_DATA,
  OVERDUE_INVOICES_DATA,
  RETURNS_DATA,
  TOP_CLIENTS_DATA,
  PRODUCT_SUMMARY_DATA,
  PRODUCT_INVENTORY_DATA,
  TOP_SELLING_PRODUCTS_DATA,
  LOW_STOCK_PRODUCTS_DATA,
  PAYMENT_SUMMARY_DATA,
  PAYMENT_METHOD_DISTRIBUTION_DATA,
  PAYMENT_TRANSACTIONS_DATA,
  DAILY_PAYMENTS_DATA,
  PAYMENTS_BY_METHOD_DATA,
  REFUNDS_DATA,
  CATEGORIES,
  EMPLOYEES,
  PAYMENT_METHODS,
  STATUS_OPTIONS,
  PRODUCT_STATUS_OPTIONS,
  RETURN_REASONS,
  type SalesSummary,
  type SalesTrend,
  type SalesTransaction,
  type DailySale,
  type SalesByCategory,
  type SalesByEmployee,
  type OverdueInvoice,
  type ReturnTransaction,
  type TopClient,
  type ProductSummary,
  type ProductInventory,
  type PaymentSummary,
  type PaymentMethodDistribution,
  type PaymentTransaction,
} from "./data"
@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [
    importaciones
  ],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.scss'
})
export class ReportsComponent {
 // Main Tabs
  selectedMainTab = 0 // 0: Sales, 1: Products, 2: Payments

  // Sub Tabs
  selectedSalesSubTab = 0 // 0: Overview, 1: Daily, 2: Category, 3: Employee, 4: Overdue, 5: Returns, 6: Top Clients
  selectedProductsSubTab = 0 // 0: Overview, 1: Inventory, 2: Top Selling, 3: Low Stock
  selectedPaymentsSubTab = 0 // 0: Overview, 1: Daily, 2: Method, 3: Refunds

  // Data for reports
  salesSummary: SalesSummary = SALES_SUMMARY_DATA
  salesTrendData: SalesTrend[] = SALES_TREND_DATA
  salesTransactions: SalesTransaction[] = SALES_TRANSACTIONS_DATA
  dailySales: DailySale[] = DAILY_SALES_DATA
  salesByCategory: SalesByCategory[] = SALES_BY_CATEGORY_DATA
  salesByEmployee: SalesByEmployee[] = SALES_BY_EMPLOYEE_DATA
  overdueInvoices: OverdueInvoice[] = OVERDUE_INVOICES_DATA
  returnsData: ReturnTransaction[] = RETURNS_DATA
  topClients: TopClient[] = TOP_CLIENTS_DATA

  productSummary: ProductSummary = PRODUCT_SUMMARY_DATA
  productInventory: ProductInventory[] = PRODUCT_INVENTORY_DATA
  topSellingProducts: ProductInventory[] = TOP_SELLING_PRODUCTS_DATA
  lowStockProducts: ProductInventory[] = LOW_STOCK_PRODUCTS_DATA

  paymentSummary: PaymentSummary = PAYMENT_SUMMARY_DATA
  paymentMethodDistribution: PaymentMethodDistribution[] = PAYMENT_METHOD_DISTRIBUTION_DATA
  paymentTransactions: PaymentTransaction[] = PAYMENT_TRANSACTIONS_DATA
  dailyPayments: DailySale[] = DAILY_PAYMENTS_DATA
  paymentsByMethod: SalesByCategory[] = PAYMENTS_BY_METHOD_DATA
  refundsData: ReturnTransaction[] = REFUNDS_DATA

  // Table displayed columns
  salesTransactionsDisplayedColumns: string[] = ["id", "date", "client", "amount", "status"]
  dailySalesDisplayedColumns: string[] = ["date", "netSales", "transactions", "averagePerTransaction"]
  salesByCategoryDisplayedColumns: string[] = ["category", "netSales", "percentage", "productsSold"]
  salesByEmployeeDisplayedColumns: string[] = ["employee", "netSales", "transactions", "averagePerSale"]
  overdueInvoicesDisplayedColumns: string[] = ["id", "client", "dueDate", "amount", "daysOverdue", "status"]
  returnsDisplayedColumns: string[] = ["id", "date", "client", "amount", "product", "reason"]
  topClientsDisplayedColumns: string[] = ["position", "client", "totalSales", "purchases", "lastPurchase"]

  productInventoryDisplayedColumns: string[] = ["id", "product", "category", "stock", "price", "status"]
  topSellingProductsDisplayedColumns: string[] = ["product", "unitsSold", "revenueGenerated"]
  lowStockProductsDisplayedColumns: string[] = ["id", "product", "category", "stock", "minThreshold"]

  paymentTransactionsDisplayedColumns: string[] = ["id", "date", "amount", "method", "status"]
  dailyPaymentsDisplayedColumns: string[] = ["date", "totalAmount", "numPayments", "averagePerPayment"]
  paymentsByMethodDisplayedColumns: string[] = ["method", "totalAmount", "numTransactions", "percentage"]
  refundsDisplayedColumns: string[] = ["id", "date", "amount", "originalSaleId", "reason"]

  // Filter options
  categories = CATEGORIES
  employees = EMPLOYEES
  paymentMethods = PAYMENT_METHODS
  statusOptions = STATUS_OPTIONS
  productStatusOptions = PRODUCT_STATUS_OPTIONS
  returnReasons = RETURN_REASONS

  // Filter Forms
  dateRange = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  })

  salesCategoryFilter = new FormControl("")
  salesEmployeeFilter = new FormControl("")
  overdueStatusFilter = new FormControl("")
  returnsReasonFilter = new FormControl("")
  productCategoryFilter = new FormControl("")
  productStockStatusFilter = new FormControl("")
  productSearchFilter = new FormControl("")
  paymentMethodFilter = new FormControl("")

  constructor() {}

  ngOnInit(): void {
    // Initialize filters or load data
    this.applyFilters() // Apply initial filters
  }

  onMainTabChange(event: any): void {
    this.selectedMainTab = event.index
    // Reset sub-tab selection and filters when main tab changes
    if (this.selectedMainTab === 0) this.selectedSalesSubTab = 0
    if (this.selectedMainTab === 1) this.selectedProductsSubTab = 0
    if (this.selectedMainTab === 2) this.selectedPaymentsSubTab = 0
    this.resetFilters()
    this.applyFilters()
  }

  onSubTabChange(event: any, type: "sales" | "products" | "payments"): void {
    if (type === "sales") this.selectedSalesSubTab = event.index
    if (type === "products") this.selectedProductsSubTab = event.index
    if (type === "payments") this.selectedPaymentsSubTab = event.index
    this.resetFilters() // Reset filters specific to the sub-tab
    this.applyFilters() // Apply filters for the new sub-tab
  }

  resetFilters(): void {
    this.dateRange.reset()
    this.salesCategoryFilter.reset("")
    this.salesEmployeeFilter.reset("")
    this.overdueStatusFilter.reset("")
    this.returnsReasonFilter.reset("")
    this.productCategoryFilter.reset("")
    this.productStockStatusFilter.reset("")
    this.productSearchFilter.reset("")
    this.paymentMethodFilter.reset("")
  }

  applyFilters(): void {
    // This is where you'd implement actual filtering logic based on form controls
    // For demonstration, we'll just log the filter values and re-assign dummy data.
    console.log("Applying filters...")
    console.log("Date Range:", this.dateRange.value)
    console.log("Sales Category:", this.salesCategoryFilter.value)
    console.log("Sales Employee:", this.salesEmployeeFilter.value)
    console.log("Overdue Status:", this.overdueStatusFilter.value)
    console.log("Returns Reason:", this.returnsReasonFilter.value)
    console.log("Product Category:", this.productCategoryFilter.value)
    console.log("Product Stock Status:", this.productStockStatusFilter.value)
    console.log("Product Search:", this.productSearchFilter.value)
    console.log("Payment Method:", this.paymentMethodFilter.value)

    // In a real application, you would fetch or filter data here
    // For now, we just re-assign the original data
    this.salesTransactions = SALES_TRANSACTIONS_DATA
    this.dailySales = DAILY_SALES_DATA
    this.salesByCategory = SALES_BY_CATEGORY_DATA
    this.salesByEmployee = SALES_BY_EMPLOYEE_DATA
    this.overdueInvoices = OVERDUE_INVOICES_DATA
    this.returnsData = RETURNS_DATA
    this.topClients = TOP_CLIENTS_DATA

    this.productInventory = PRODUCT_INVENTORY_DATA
    this.topSellingProducts = TOP_SELLING_PRODUCTS_DATA
    this.lowStockProducts = LOW_STOCK_PRODUCTS_DATA

    this.paymentTransactions = PAYMENT_TRANSACTIONS_DATA
    this.dailyPayments = DAILY_PAYMENTS_DATA
    this.paymentsByMethod = PAYMENTS_BY_METHOD_DATA
    this.refundsData = REFUNDS_DATA

    // Example of simple filtering (you'd expand this for all data sets)
    if (this.salesCategoryFilter.value) {
      this.salesByCategory = SALES_BY_CATEGORY_DATA.filter((item) => item.category === this.salesCategoryFilter.value)
    }
    if (this.productSearchFilter.value) {
      this.productInventory = PRODUCT_INVENTORY_DATA.filter((item) =>
        item.product.toLowerCase().includes(this.productSearchFilter.value!.toLowerCase()),
      )
    }
  }

  exportCsv(reportName: string): void {
    // Implement CSV export logic here
  }

  printReport(): void {
    window.print()
  }
}



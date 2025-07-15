// Dummy Data for Reports

export interface SalesSummary {
  netSales: number
  completedOrders: number
  averageSale: number
}

export interface SalesTrend {
  month: string
  value: number
}

export interface SalesTransaction {
  id: string
  date: string
  client: string
  amount: number
  status: "completed" | "pending" | "refunded"
}

export interface DailySale {
  date: string
  netSales: number
  transactions: number
  averagePerTransaction: number
}

export interface SalesByCategory {
  category: string
  netSales: number
  percentage: number
  productsSold: number
}

export interface SalesByEmployee {
  employee: string
  netSales: number
  transactions: number
  averagePerSale: number
}

export interface OverdueInvoice {
  id: string
  client: string
  dueDate: string
  amount: number
  daysOverdue: number
  status: "overdue"
}

export interface ReturnTransaction {
  id: string
  date: string
  client: string
  amount: number
  product: string
  reason: string
}

export interface TopClient {
  position: number
  client: string
  totalSales: number
  purchases: number
  lastPurchase: string
}

export interface ProductSummary {
  totalProducts: number
  lowStock: number
  topSelling: string
}

export interface ProductInventory {
  id: string
  product: string
  category: string
  stock: number
  price: number
  status: "in-stock" | "low-stock" | "out-of-stock"
}

export interface PaymentSummary {
  totalPayments: number
  completedPayments: number
  pendingPayments: number
}

export interface PaymentMethodDistribution {
  method: string
  percentage: number
  colorClass: string
}

export interface PaymentTransaction {
  id: string
  date: string
  amount: number
  method: string
  status: "completed" | "pending" | "refunded"
}

export const SALES_SUMMARY_DATA: SalesSummary = {
  netSales: 125450.0,
  completedOrders: 875,
  averageSale: 143.37,
}

export const SALES_TREND_DATA: SalesTrend[] = [
  { month: "Ago", value: 10000 },
  { month: "Sep", value: 12500 },
  { month: "Oct", value: 14000 },
  { month: "Nov", value: 15000 },
  { month: "Dic", value: 16500 },
  { month: "Ene", value: 15800 },
]

export const SALES_TRANSACTIONS_DATA: SalesTransaction[] = [
  { id: "#001234", date: "15/01/24", client: "Ana Pérez", amount: 1250.0, status: "completed" },
  { id: "#001233", date: "15/01/24", client: "Juan García", amount: 3500.0, status: "completed" },
  { id: "#001232", date: "14/01/24", client: "María López", amount: 800.0, status: "pending" },
  { id: "#001231", date: "14/01/24", client: "Pedro Ruiz", amount: 5100.0, status: "completed" },
  { id: "#001230", date: "13/01/24", client: "Laura Soto", amount: 250.0, status: "refunded" },
]

export const DAILY_SALES_DATA: DailySale[] = [
  { date: "15/01/2024", netSales: 12500.0, transactions: 15, averagePerTransaction: 833.33 },
  { date: "14/01/2024", netSales: 10200.0, transactions: 12, averagePerTransaction: 850.0 },
  { date: "13/01/2024", netSales: 11800.0, transactions: 14, averagePerTransaction: 842.86 },
  { date: "12/01/2024", netSales: 9500.0, transactions: 10, averagePerTransaction: 950.0 },
  { date: "11/01/2024", netSales: 13000.0, transactions: 18, averagePerTransaction: 722.22 },
]

export const SALES_BY_CATEGORY_DATA: SalesByCategory[] = [
  { category: "Electrónica", netSales: 50000.0, percentage: 40, productsSold: 200 },
  { category: "Ropa", netSales: 35000.0, percentage: 28, productsSold: 300 },
  { category: "Hogar", netSales: 25000.0, percentage: 20, productsSold: 150 },
  { category: "Libros", netSales: 15000.0, percentage: 12, productsSold: 225 },
]

export const SALES_BY_EMPLOYEE_DATA: SalesByEmployee[] = [
  { employee: "Juan Pérez", netSales: 45000.0, transactions: 300, averagePerSale: 150.0 },
  { employee: "María García", netSales: 38000.0, transactions: 280, averagePerSale: 135.71 },
  { employee: "Carlos Ruiz", netSales: 25000.0, transactions: 180, averagePerSale: 138.89 },
  { employee: "Laura Soto", netSales: 17450.0, transactions: 115, averagePerSale: 151.74 },
]

export const OVERDUE_INVOICES_DATA: OverdueInvoice[] = [
  { id: "INV-00101", client: "Cliente A", dueDate: "01/01/2024", amount: 2500.0, daysOverdue: 14, status: "overdue" },
  { id: "INV-00102", client: "Cliente B", dueDate: "05/01/2024", amount: 1800.0, daysOverdue: 10, status: "overdue" },
  { id: "INV-00103", client: "Cliente C", dueDate: "10/01/2024", amount: 1200.0, daysOverdue: 5, status: "overdue" },
  { id: "INV-00104", client: "Cliente D", dueDate: "20/12/2023", amount: 3000.0, daysOverdue: 26, status: "overdue" },
]

export const RETURNS_DATA: ReturnTransaction[] = [
  {
    id: "RET-001",
    date: "13/01/24",
    client: "Cliente A",
    amount: 250.0,
    product: "Teclado Mecánico",
    reason: "Defecto de fábrica",
  },
  {
    id: "RET-002",
    date: "10/01/24",
    client: "Cliente B",
    amount: 1000.0,
    product: 'Monitor 27"',
    reason: "Cambio de opinión",
  },
  {
    id: "RET-003",
    date: "05/01/24",
    client: "Cliente C",
    amount: 250.0,
    product: "Mouse Gaming",
    reason: "No compatible",
  },
]

export const TOP_CLIENTS_DATA: TopClient[] = [
  { position: 1, client: "Empresa XYZ", totalSales: 50000.0, purchases: 12, lastPurchase: "10/01/24" },
  { position: 2, client: "Juan Pérez", totalSales: 35000.0, purchases: 8, lastPurchase: "15/01/24" },
  { position: 3, client: "Tienda ABC", totalSales: 28000.0, purchases: 5, lastPurchase: "05/01/24" },
  { position: 4, client: "María García", totalSales: 22000.0, purchases: 10, lastPurchase: "12/01/24" },
  { position: 5, client: "Carlos Soto", totalSales: 18000.0, purchases: 7, lastPurchase: "08/01/24" },
]

export const PRODUCT_SUMMARY_DATA: ProductSummary = {
  totalProducts: 520,
  lowStock: 15,
  topSelling: "Laptop Pro X",
}

export const PRODUCT_INVENTORY_DATA: ProductInventory[] = [
  { id: "P001", product: "Laptop Pro X", category: "Electrónica", stock: 15, price: 15000.0, status: "in-stock" },
  { id: "P002", product: 'Monitor 27" 4K', category: "Electrónica", stock: 8, price: 5500.0, status: "low-stock" },
  { id: "P003", product: "Teclado Mecánico", category: "Accesorios", stock: 25, price: 1200.0, status: "in-stock" },
  { id: "P004", product: "Mouse Gaming", category: "Accesorios", stock: 4, price: 450.0, status: "low-stock" },
  { id: "P005", product: "Impresora Láser", category: "Oficina", stock: 0, price: 3000.0, status: "out-of-stock" },
  { id: "P006", product: "Webcam HD", category: "Accesorios", stock: 12, price: 800.0, status: "in-stock" },
  { id: "P007", product: "Router Wi-Fi", category: "Redes", stock: 7, price: 1500.0, status: "low-stock" },
]

export const TOP_SELLING_PRODUCTS_DATA: ProductInventory[] = [
  { id: "P001", product: "Laptop Pro X", category: "Electrónica", stock: 150, price: 15000.0, status: "in-stock" },
  { id: "P002", product: 'Monitor 27" 4K', category: "Electrónica", stock: 120, price: 5500.0, status: "in-stock" },
  { id: "P003", product: "Teclado Mecánico", category: "Accesorios", stock: 95, price: 1200.0, status: "in-stock" },
  { id: "P004", product: "Mouse Gaming", category: "Accesorios", stock: 70, price: 450.0, status: "in-stock" },
  { id: "P006", product: "Webcam HD", category: "Accesorios", stock: 50, price: 800.0, status: "in-stock" },
]

export const LOW_STOCK_PRODUCTS_DATA: ProductInventory[] = [
  { id: "P002", product: 'Monitor 27" 4K', category: "Electrónica", stock: 8, price: 5500.0, status: "low-stock" },
  { id: "P004", product: "Mouse Gaming", category: "Accesorios", stock: 4, price: 450.0, status: "low-stock" },
  { id: "P007", product: "Router Wi-Fi", category: "Redes", stock: 7, price: 1500.0, status: "low-stock" },
  { id: "P010", product: "Audífonos Bluetooth", category: "Audio", stock: 6, price: 800.0, status: "low-stock" },
]

export const PAYMENT_SUMMARY_DATA: PaymentSummary = {
  totalPayments: 125450.0,
  completedPayments: 850,
  pendingPayments: 25,
}

export const PAYMENT_METHOD_DISTRIBUTION_DATA: PaymentMethodDistribution[] = [
  { method: "Transferencia", percentage: 70, colorClass: "transfer" },
  { method: "Tarjeta", percentage: 20, colorClass: "card" },
  { method: "Efectivo", percentage: 8, colorClass: "cash" },
  { method: "Cheque", percentage: 2, colorClass: "check" },
]

export const PAYMENT_TRANSACTIONS_DATA: PaymentTransaction[] = [
  { id: "PAY-001234", date: "15/01/24", amount: 1250.0, method: "Transferencia", status: "completed" },
  { id: "PAY-001233", date: "15/01/24", amount: 3500.0, method: "Tarjeta", status: "completed" },
  { id: "PAY-001232", date: "14/01/24", amount: 800.0, method: "Efectivo", status: "pending" },
  { id: "PAY-001231", date: "14/01/24", amount: 5100.0, method: "Transferencia", status: "completed" },
  { id: "PAY-001230", date: "13/01/24", amount: 250.0, method: "Tarjeta", status: "refunded" },
]

export const DAILY_PAYMENTS_DATA: DailySale[] = [
  // Reusing DailySale interface for structure
  { date: "15/01/2024", netSales: 12500.0, transactions: 15, averagePerTransaction: 833.33 },
  { date: "14/01/2024", netSales: 10200.0, transactions: 12, averagePerTransaction: 850.0 },
  { date: "13/01/2024", netSales: 11800.0, transactions: 14, averagePerTransaction: 842.86 },
  { date: "12/01/2024", netSales: 9500.0, transactions: 10, averagePerTransaction: 950.0 },
  { date: "11/01/2024", netSales: 13000.0, transactions: 18, averagePerTransaction: 722.22 },
]

export const PAYMENTS_BY_METHOD_DATA: SalesByCategory[] = [
  // Reusing SalesByCategory interface for structure
  { category: "Transferencia Bancaria", netSales: 87815.0, percentage: 70, productsSold: 550 },
  { category: "Tarjeta de Crédito/Débito", netSales: 25090.0, percentage: 20, productsSold: 250 },
  { category: "Efectivo", netSales: 10036.0, percentage: 8, productsSold: 80 },
  { category: "Cheque", netSales: 2509.0, percentage: 2, productsSold: 20 },
]

export const REFUNDS_DATA: ReturnTransaction[] = [
  // Reusing ReturnTransaction interface for structure
  {
    id: "REF-001",
    date: "13/01/24",
    client: "Cliente A",
    amount: 250.0,
    product: "N/A",
    reason: "Producto defectuoso",
  },
  {
    id: "REF-002",
    date: "10/01/24",
    client: "Cliente B",
    amount: 1500.0,
    product: "N/A",
    reason: "Cancelación de servicio",
  },
  { id: "REF-003", date: "05/01/24", client: "Cliente C", amount: 80.0, product: "N/A", reason: "Error de cobro" },
]

export const CATEGORIES = ["Electrónica", "Ropa", "Hogar", "Libros", "Accesorios", "Oficina", "Redes", "Audio"]
export const EMPLOYEES = ["Juan Pérez", "María García", "Carlos Ruiz", "Laura Soto"]
export const PAYMENT_METHODS = ["Transferencia", "Tarjeta", "Efectivo", "Cheque"]
export const STATUS_OPTIONS = ["completed", "pending", "refunded", "overdue"]
export const PRODUCT_STATUS_OPTIONS = ["in-stock", "low-stock", "out-of-stock"]
export const RETURN_REASONS = ["Defecto de fábrica", "Cambio de opinión", "No compatible", "Error de cobro"]

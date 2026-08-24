export type RoomStatus = 
  | "OCCUPIED" 
  | "VACANT_CLEAN" 
  | "VACANT_DIRTY" 
  | "VACANT_INSPECTED" 
  | "IN_PROGRESS" 
  | "RESERVED" 
  | "DUE_OUT" 
  | "OUT_OF_ORDER";

export type RoomCategory = 
  | "Superior Twin" 
  | "Deluxe King" 
  | "Executive Suite" 
  | "Grand Penthouse" 
  | "Garden Pool Villa"
  | "Standard Deluxe"
  | "Royal Penthouse";

export interface Room {
  id: string;
  roomNumber: string;
  floor: number;
  category: string;
  basePrice: number; // in IDR
  currentRate: number;
  status: RoomStatus;
  bedType: "King Bed" | "Twin Bed" | "Super King";
  maxOccupancy: number;
  assignedHousekeeper?: string;
  currentGuestName?: string;
  currentReservationId?: string;
  keycardCount?: number;
  lastCleanedAt?: string;
  notes?: string;
  amenities: string[];
}

export type VIPLevel = "STANDARD" | "SILVER" | "GOLD" | "PLATINUM" | "VVIP";

export interface Guest {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  idNumber: string; // KTP / Passport
  nationality: string;
  vipLevel: VIPLevel;
  totalStays: number;
  lifetimeSpend: number;
  preferences: string[];
  dietaryRestrictions?: string;
  notes?: string;
  avatarUrl?: string;
}

export type ChannelSource = 
  | "DIRECT_WEB" 
  | "BOOKING_COM" 
  | "AGODA" 
  | "EXPEDIA" 
  | "CORPORATE_MICE" 
  | "WALK_IN" 
  | "PHONE_RESERVATION";

export type ReservationStatus = 
  | "CONFIRMED" 
  | "CHECKED_IN" 
  | "CHECKED_OUT" 
  | "CANCELLED" 
  | "NO_SHOW";

export interface Reservation {
  id: string;
  bookingCode: string;
  guestId: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  vipLevel: VIPLevel;
  roomId: string;
  roomNumber: string;
  category: string;
  checkInDate: string; // YYYY-MM-DD
  checkOutDate: string; // YYYY-MM-DD
  nights: number;
  adults: number;
  children: number;
  channel: ChannelSource;
  status: ReservationStatus;
  totalAmount: number;
  depositPaid: number;
  balanceDue: number;
  specialRequests?: string;
  createdAt: string;
  folioId: string;
}

export type FolioCategory = "ROOM_CHARGE" | "FNB" | "SPA" | "MINIBAR" | "LAUNDRY" | "TRANSPORT" | "MISC" | "TAX_SERVICE";

export interface FolioItem {
  id: string;
  date: string;
  description: string;
  category: FolioCategory;
  amount: number;
  reference?: string;
  postedBy: string;
}

export type PaymentMethod = "CREDIT_CARD" | "DEBIT_CARD" | "QRIS" | "BANK_TRANSFER" | "CASH" | "CITY_LEDGER";

export interface FolioPayment {
  id: string;
  date: string;
  method: PaymentMethod;
  amount: number;
  referenceNo: string;
  processedBy: string;
}

export interface Folio {
  id: string;
  reservationId: string;
  guestName: string;
  roomNumber: string;
  items: FolioItem[];
  payments: FolioPayment[];
  subtotal: number;
  serviceCharge: number; // 10%
  tax: number; // 11%
  grandTotal: number;
  totalPaid: number;
  balance: number;
  isClosed: boolean;
  closedAt?: string;
}

export type HousekeepingTaskType = 
  | "DEEP_CLEAN" 
  | "DAILY_REFRESH" 
  | "CHECKOUT_TURNOVER" 
  | "TURNDOWN_SERVICE" 
  | "INSPECTION"
  | "FULL_TURNOVER"
  | "STAYOVER_CLEAN";
export type HousekeepingTaskStatus = "PENDING" | "IN_PROGRESS" | "COMPLETED" | "VERIFIED";

export interface HousekeepingTask {
  id: string;
  roomNumber: string;
  roomId: string;
  taskType: HousekeepingTaskType;
  priority: "LOW" | "NORMAL" | "HIGH" | "URGENT";
  status: HousekeepingTaskStatus;
  assignedTo: string;
  startedAt?: string;
  completedAt?: string;
  inspectedBy?: string;
  checklist: { item: string; completed: boolean }[];
  notes?: string;
}

export type WorkOrderCategory = "HVAC_AIR_CONDITIONING" | "PLUMBING" | "ELECTRICAL" | "CARPENTRY" | "AV_ELECTRONICS" | "SAFETY";
export type WorkOrderPriority = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL_URGENT";
export type WorkOrderStatus = "OPEN" | "IN_PROGRESS" | "ON_HOLD" | "RESOLVED";

export interface MaintenanceWorkOrder {
  id: string;
  ticketCode: string;
  roomNumber?: string;
  location: string;
  title: string;
  category: WorkOrderCategory;
  priority: WorkOrderPriority;
  status: WorkOrderStatus;
  reportedBy: string;
  assignedTechnician: string;
  reportedAt: string;
  resolvedAt?: string;
  description: string;
  resolutionNotes?: string;
  estimatedCost?: number;
}

export interface DepartmentChannel {
  id: string;
  name: string;
  description: string;
  isPrivate?: boolean;
  unreadCount?: number;
  icon?: string;
}

export interface InternalMessage {
  id: string;
  channelId: string;
  senderName: string;
  senderRole: string;
  senderAvatar?: string;
  timestamp: string;
  content: string;
  isUrgent?: boolean;
  attachments?: string[];
  reactions?: { emoji: string; count: number; users: string[] }[];
}

export type ShiftType = "Morning (07:00-15:00)" | "Evening (15:00-23:00)" | "Night (23:00-07:00)";
export type DepartmentType = "Management" | "Front Office" | "Housekeeping" | "Engineering" | "Food & Beverage" | "Finance & Accounting" | "Human Resources" | "Security";

export interface ShiftLog {
  id: string;
  date: string;
  shift: ShiftType;
  dutyManager: string;
  department: string;
  keyNotes: string;
  pendingActions: string[];
  isAcknowledged: boolean;
  acknowledgedBy?: string;
}

export interface FnbMenuItem {
  id: string;
  name: string;
  category: "APPETIZER" | "MAIN_COURSE" | "DESSERT" | "BEVERAGE" | "COCKTAIL_WINE" | "Appetizer" | "Main Course" | "Dessert" | "Beverage" | "Cocktail & Wine" | "Kids";
  price: number;
  prepTimeMinutes: number;
  description: string;
  isAvailable?: boolean;
}

export type FnBItem = FnbMenuItem;

export interface FnbOrder {
  id: string;
  orderCode?: string;
  orderNumber?: string;
  orderType: "ROOM_DELIVERY" | "RESTAURANT_TABLE" | "POOL_BAR" | "ROOM_SERVICE" | "RESTAURANT_DINE_IN" | "LOUNGE";
  roomNumber?: string;
  tableNumber?: string;
  guestName?: string;
  items: { menuItemId?: string; name?: string; price?: number; quantity: number; subtotal?: number; item?: FnbMenuItem; notes?: string }[];
  subtotal?: number;
  taxAndService?: number;
  totalAmount: number;
  status: "PLACED" | "PREPARING" | "IN_DELIVERY" | "SERVED" | "CANCELLED" | "BILLED_TO_FOLIO";
  chargedToFolio?: boolean;
  serverStaff?: string;
  notes?: string;
  placedAt?: string;
}

export type FnBOrder = FnbOrder;

export type InventoryCategory = 
  | "GUEST_AMENITY" 
  | "LINEN" 
  | "MINIBAR" 
  | "CLEANING_CHEMICAL" 
  | "ENGINEERING_PARTS" 
  | "FNB_DRY_GOODS"
  | "Guest Room Linen"
  | "Bath Amenities"
  | "Minibar Stock"
  | "Cleaning Supplies"
  | "Food & Beverage"
  | "Engineering Spares";

export interface InventoryItem {
  id: string;
  sku?: string;
  name: string;
  category: InventoryCategory;
  currentStock: number;
  parLevel: number;
  reorderThreshold?: number;
  reorderPoint?: number;
  unit: string;
  unitCost: number;
  supplier: string;
  lastRestocked: string;
}

export interface PurchaseOrder {
  id: string;
  poNumber: string;
  supplier: string;
  category: string;
  items: { itemName: string; quantity: number; unitCost: number; subtotal: number }[];
  totalAmount: number;
  status: "DRAFT" | "PENDING_GM_APPROVAL" | "APPROVED" | "ORDERED" | "RECEIVED";
  requestedBy: string;
  requestedDate: string;
}

export interface StaffMember {
  id: string;
  employeeId?: string;
  fullName: string;
  role?: string;
  title?: string;
  department: string;
  email: string;
  phone: string;
  status: "ACTIVE_ON_DUTY" | "ON_DUTY" | "OFF_DUTY" | "ON_LEAVE" | "BREAK";
  shift: "Morning" | "Evening" | "Night" | "General";
  performanceRating?: number;
  performanceScore?: number;
  avatarUrl?: string;
}

export interface NightAuditRecord {
  id: string;
  auditDate: string;
  auditorName: string;
  totalOccupiedRooms: number;
  occupancyRatePercent: number;
  totalRoomRevenue: number;
  totalFnbRevenue: number;
  totalOtherRevenue: number;
  totalGrossRevenue: number;
  adr: number;
  revPar: number;
  pendingFoliosResolved: number;
  discrepanciesCount: number;
  completedAt: string;
  status: "SUCCESSFUL" | "AUDIT_WARNING";
}

export interface NightAuditReport {
  id: string;
  date: string;
  grossRevenue: number;
  totalRoomRevenue: number;
  totalFnbRevenue: number;
  totalTaxCollected: number;
  adr: number;
  revPar: number;
  occupancyRate: number;
  auditorName: string;
  status: "BALANCED" | "COMPLETED";
}

export type UserRole = 
  | "GENERAL_MANAGER" 
  | "FRONT_OFFICE_MANAGER" 
  | "EXECUTIVE_HOUSEKEEPER" 
  | "CHIEF_ENGINEER" 
  | "FINANCIAL_CONTROLLER" 
  | "HR_DIRECTOR";

export interface UserRoleProfile {
  role: UserRole;
  title: string;
  name: string;
  department: string;
  badgeColor: string;
  description: string;
}

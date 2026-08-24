import React, { createContext, useContext, useState, useEffect } from "react";
import confetti from "canvas-confetti";
import { 
  Room, 
  RoomStatus, 
  Reservation, 
  Guest, 
  Folio, 
  FolioItem, 
  FolioPayment, 
  HousekeepingTask, 
  MaintenanceWorkOrder, 
  DepartmentChannel, 
  InternalMessage, 
  ShiftLog, 
  FnBItem, 
  FnBOrder, 
  InventoryItem, 
  PurchaseOrder, 
  StaffMember, 
  NightAuditRecord,
  NightAuditReport,
  FnbMenuItem,
  UserRole,
  UserRoleProfile 
} from "../types";
import { 
  Language, 
  translations, 
  LANGUAGE_OPTIONS 
} from "../i18n/translations";
import { 
  USER_ROLES, 
  INITIAL_ROOMS, 
  INITIAL_GUESTS, 
  INITIAL_RESERVATIONS, 
  INITIAL_FOLIOS, 
  INITIAL_HOUSEKEEPING_TASKS, 
  INITIAL_WORK_ORDERS, 
  INITIAL_CHANNELS, 
  INITIAL_MESSAGES, 
  INITIAL_SHIFT_LOGS, 
  INITIAL_FNB_ITEMS, 
  INITIAL_FNB_ORDERS, 
  INITIAL_INVENTORY, 
  INITIAL_PURCHASE_ORDERS, 
  INITIAL_STAFF, 
  INITIAL_NIGHT_AUDITS 
} from "../mockData";

export type ActiveView = 
  | "dashboard" 
  | "room-matrix" 
  | "reservations" 
  | "housekeeping" 
  | "maintenance" 
  | "comms" 
  | "fnb-pos" 
  | "finance" 
  | "inventory" 
  | "staff" 
  | "ai-intelligence" 
  | "blueprint";

interface HotelContextType {
  // Language & i18n
  language: Language;
  setLanguage: (lang: Language) => void;
  t: typeof translations.id;

  activeRole: UserRole;
  setActiveRole: (role: UserRole) => void;
  activeRoleProfile: UserRoleProfile;
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
  
  // Data
  rooms: Room[];
  reservations: Reservation[];
  guests: Guest[];
  folios: Folio[];
  housekeepingTasks: HousekeepingTask[];
  workOrders: MaintenanceWorkOrder[];
  channels: DepartmentChannel[];
  messages: InternalMessage[];
  shiftLogs: ShiftLog[];
  fnbItems: FnBItem[];
  fnbOrders: FnBOrder[];
  inventory: InventoryItem[];
  purchaseOrders: PurchaseOrder[];
  staff: StaffMember[];
  nightAudits: NightAuditRecord[];
  nightAuditReports: NightAuditReport[];
  departmentMessages: { id: string; senderName: string; senderRole: string; channel: string; message: string; timestamp: string; isUrgent?: boolean }[];
  fnbMenu: FnbMenuItem[];
  
  // Modal / Drawer Selection
  selectedRoom: Room | null;
  setSelectedRoom: (room: Room | null) => void;
  selectedFolio: Folio | null;
  setSelectedFolio: (folio: Folio | null) => void;
  selectedGuest: Guest | null;
  setSelectedGuest: (guest: Guest | null) => void;
  activeChannelId: string;
  setActiveChannelId: (id: string) => void;
  
  // Quick Search & Notification Toast
  toastMessage: { text: string; type: "success" | "info" | "warning" } | null;
  showToast: (text: string, type?: "success" | "info" | "warning") => void;
  
  // Actions
  updateRoomStatus: (roomId: string, newStatus: RoomStatus, assignedHousekeeper?: string, notes?: string) => void;
  createReservation: (res: Omit<Reservation, "id" | "bookingCode" | "createdAt" | "folioId">) => void;
  checkInReservation: (resId: string) => void;
  checkOutReservation: (resId: string) => void;
  addFolioItem: (folioId: string, item: Omit<FolioItem, "id" | "date">) => void;
  addFolioPayment: (folioId: string, payment: Omit<FolioPayment, "id" | "date">) => void;
  closeFolio: (folioId: string) => void;
  createHousekeepingTask: (task: Omit<HousekeepingTask, "id">) => void;
  updateHousekeepingStatus: (taskId: string, status: HousekeepingTask["status"], checklist?: HousekeepingTask["checklist"]) => void;
  updateHousekeepingTask: (taskId: string, status: HousekeepingTask["status"], checklist?: HousekeepingTask["checklist"]) => void;
  createWorkOrder: (order: Omit<MaintenanceWorkOrder, "id" | "ticketCode" | "reportedAt">) => void;
  updateWorkOrderStatus: (orderId: string, status: MaintenanceWorkOrder["status"], resolutionNotes?: string) => void;
  updateWorkOrder: (orderId: string, status: MaintenanceWorkOrder["status"], resolutionNotes?: string) => void;
  sendInternalMessage: (channelId: string, content: string, isUrgent?: boolean) => void;
  sendDepartmentMessage: (msg: { senderName: string; senderRole: string; channel: string; message: string; isUrgent?: boolean }) => void;
  addShiftLog: (log: Omit<ShiftLog, "id" | "date" | "isAcknowledged">) => void;
  placeFnBOrder: (order: Omit<FnBOrder, "id" | "orderNumber" | "placedAt">) => void;
  createFnbOrder: (order: any) => void;
  updateFnBOrderStatus: (orderId: string, status: FnBOrder["status"]) => void;
  updateFnbOrderStatus: (orderId: string, status: any) => void;
  createPurchaseOrder: (po: Omit<PurchaseOrder, "id" | "poNumber" | "requestedDate">) => void;
  updatePurchaseOrderStatus: (poId: string, status: PurchaseOrder["status"]) => void;
  addInventoryItem: (item: Omit<InventoryItem, "id">) => void;
  updateInventoryQuantity: (id: string, qty: number) => void;
  runNightAudit: () => void;
  resetAllData: () => void;
}

const HotelContext = createContext<HotelContextType | undefined>(undefined);

export const HotelProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem("maximuz_language");
    return (saved === "en" || saved === "id") ? saved : "id";
  });

  const [activeRole, setActiveRole] = useState<UserRole>("GENERAL_MANAGER");
  const [activeView, setActiveView] = useState<ActiveView>("dashboard");
  const [activeChannelId, setActiveChannelId] = useState<string>("ch-ops");

  // State with LocalStorage Caching for persistence across tabs
  const [rooms, setRooms] = useState<Room[]>(() => {
    const saved = localStorage.getItem("maximuz_rooms");
    return saved ? JSON.parse(saved) : INITIAL_ROOMS;
  });

  const [reservations, setReservations] = useState<Reservation[]>(() => {
    const saved = localStorage.getItem("maximuz_reservations");
    return saved ? JSON.parse(saved) : INITIAL_RESERVATIONS;
  });

  const [guests, setGuests] = useState<Guest[]>(() => {
    const saved = localStorage.getItem("maximuz_guests");
    return saved ? JSON.parse(saved) : INITIAL_GUESTS;
  });

  const [folios, setFolios] = useState<Folio[]>(() => {
    const saved = localStorage.getItem("maximuz_folios");
    return saved ? JSON.parse(saved) : INITIAL_FOLIOS;
  });

  const [housekeepingTasks, setHousekeepingTasks] = useState<HousekeepingTask[]>(() => {
    const saved = localStorage.getItem("maximuz_hk_tasks");
    return saved ? JSON.parse(saved) : INITIAL_HOUSEKEEPING_TASKS;
  });

  const [workOrders, setWorkOrders] = useState<MaintenanceWorkOrder[]>(() => {
    const saved = localStorage.getItem("maximuz_work_orders");
    return saved ? JSON.parse(saved) : INITIAL_WORK_ORDERS;
  });

  const [channels] = useState<DepartmentChannel[]>(INITIAL_CHANNELS);
  const [messages, setMessages] = useState<InternalMessage[]>(() => {
    const saved = localStorage.getItem("maximuz_messages");
    return saved ? JSON.parse(saved) : INITIAL_MESSAGES;
  });

  const [shiftLogs, setShiftLogs] = useState<ShiftLog[]>(() => {
    const saved = localStorage.getItem("maximuz_shift_logs");
    return saved ? JSON.parse(saved) : INITIAL_SHIFT_LOGS;
  });

  const [fnbItems] = useState<FnBItem[]>(INITIAL_FNB_ITEMS);
  const [fnbOrders, setFnbOrders] = useState<FnBOrder[]>(() => {
    const saved = localStorage.getItem("maximuz_fnb_orders");
    return saved ? JSON.parse(saved) : INITIAL_FNB_ORDERS;
  });

  const [inventory, setInventory] = useState<InventoryItem[]>(() => {
    const saved = localStorage.getItem("maximuz_inventory");
    return saved ? JSON.parse(saved) : INITIAL_INVENTORY;
  });

  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>(() => {
    const saved = localStorage.getItem("maximuz_purchase_orders");
    return saved ? JSON.parse(saved) : INITIAL_PURCHASE_ORDERS;
  });

  const [staff] = useState<StaffMember[]>(INITIAL_STAFF);
  const [nightAudits, setNightAudits] = useState<NightAuditRecord[]>(() => {
    const saved = localStorage.getItem("maximuz_night_audits");
    return saved ? JSON.parse(saved) : INITIAL_NIGHT_AUDITS;
  });

  // Modal selections
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [selectedFolio, setSelectedFolio] = useState<Folio | null>(null);
  const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null);

  // Notification toast
  const [toastMessage, setToastMessage] = useState<{ text: string; type: "success" | "info" | "warning" } | null>(null);

  const showToast = (text: string, type: "success" | "info" | "warning" = "success") => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const setLanguage = (newLang: Language) => {
    setLanguageState(newLang);
    localStorage.setItem("maximuz_language", newLang);
    showToast(
      newLang === "id"
        ? "Bahasa berhasil diubah ke Bahasa Indonesia 🇮🇩"
        : "Language successfully switched to English (US) 🇺🇸",
      "success"
    );
  };

  const t = translations[language] || translations.id;

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem("maximuz_rooms", JSON.stringify(rooms));
  }, [rooms]);
  useEffect(() => {
    localStorage.setItem("maximuz_reservations", JSON.stringify(reservations));
  }, [reservations]);
  useEffect(() => {
    localStorage.setItem("maximuz_guests", JSON.stringify(guests));
  }, [guests]);
  useEffect(() => {
    localStorage.setItem("maximuz_folios", JSON.stringify(folios));
  }, [folios]);
  useEffect(() => {
    localStorage.setItem("maximuz_hk_tasks", JSON.stringify(housekeepingTasks));
  }, [housekeepingTasks]);
  useEffect(() => {
    localStorage.setItem("maximuz_work_orders", JSON.stringify(workOrders));
  }, [workOrders]);
  useEffect(() => {
    localStorage.setItem("maximuz_messages", JSON.stringify(messages));
  }, [messages]);
  useEffect(() => {
    localStorage.setItem("maximuz_shift_logs", JSON.stringify(shiftLogs));
  }, [shiftLogs]);
  useEffect(() => {
    localStorage.setItem("maximuz_fnb_orders", JSON.stringify(fnbOrders));
  }, [fnbOrders]);
  useEffect(() => {
    localStorage.setItem("maximuz_inventory", JSON.stringify(inventory));
  }, [inventory]);
  useEffect(() => {
    localStorage.setItem("maximuz_purchase_orders", JSON.stringify(purchaseOrders));
  }, [purchaseOrders]);
  useEffect(() => {
    localStorage.setItem("maximuz_night_audits", JSON.stringify(nightAudits));
  }, [nightAudits]);

  const activeRoleProfile = USER_ROLES.find(r => r.role === activeRole) || USER_ROLES[0];

  // Actions
  const updateRoomStatus = (roomId: string, newStatus: RoomStatus, assignedHousekeeper?: string, notes?: string) => {
    setRooms(prev => prev.map(room => {
      if (room.id === roomId) {
        return {
          ...room,
          status: newStatus,
          assignedHousekeeper: assignedHousekeeper !== undefined ? assignedHousekeeper : room.assignedHousekeeper,
          notes: notes !== undefined ? notes : room.notes,
          lastCleanedAt: newStatus === "VACANT_CLEAN" || newStatus === "VACANT_INSPECTED" 
            ? new Date().toISOString().replace("T", " ").substring(0, 16) 
            : room.lastCleanedAt,
        };
      }
      return room;
    }));
    showToast(`Room status updated to ${newStatus.replace(/_/g, " ")}`);
  };

  const createReservation = (newResData: Omit<Reservation, "id" | "bookingCode" | "createdAt" | "folioId">) => {
    const bookingCode = `MXZ-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, "0")}-${Math.floor(1000 + Math.random() * 9000)}`;
    const newId = `res-${Date.now()}`;
    const newFolioId = `fol-${Date.now()}`;

    const newReservation: Reservation = {
      ...newResData,
      id: newId,
      bookingCode,
      createdAt: new Date().toISOString().replace("T", " ").substring(0, 16),
      folioId: newFolioId,
    };

    // Create associated Folio
    const initialItem: FolioItem = {
      id: `fi-${Date.now()}`,
      date: newResData.checkInDate,
      description: `Room Charge - ${newResData.category} (${newResData.nights} Nights)`,
      category: "ROOM_CHARGE",
      amount: newResData.totalAmount,
      postedBy: activeRoleProfile.name,
    };

    const initialPayment: FolioPayment | null = newResData.depositPaid > 0 ? {
      id: `pay-${Date.now()}`,
      date: new Date().toISOString().substring(0, 10),
      method: "CREDIT_CARD",
      amount: newResData.depositPaid,
      referenceNo: `DEP-${bookingCode}`,
      processedBy: activeRoleProfile.name,
    } : null;

    const subtotal = newResData.totalAmount;
    const serviceCharge = Math.round(subtotal * 0.10);
    const tax = Math.round(subtotal * 0.11);
    const grandTotal = subtotal + serviceCharge + tax;

    const newFolio: Folio = {
      id: newFolioId,
      reservationId: newId,
      guestName: newResData.guestName,
      roomNumber: newResData.roomNumber,
      items: [initialItem],
      payments: initialPayment ? [initialPayment] : [],
      subtotal,
      serviceCharge,
      tax,
      grandTotal,
      totalPaid: newResData.depositPaid,
      balance: grandTotal - newResData.depositPaid,
      isClosed: false,
    };

    setReservations(prev => [newReservation, ...prev]);
    setFolios(prev => [newFolio, ...prev]);

    // Update room if today
    setRooms(prev => prev.map(r => {
      if (r.id === newResData.roomId) {
        return { ...r, status: "RESERVED", currentGuestName: newResData.guestName, currentReservationId: newId };
      }
      return r;
    }));

    confetti({ particleCount: 50, spread: 60, origin: { y: 0.8 } });
    showToast(`Reservation ${bookingCode} created successfully!`, "success");
  };

  const checkInReservation = (resId: string) => {
    const res = reservations.find(r => r.id === resId);
    if (!res) return;

    setReservations(prev => prev.map(r => r.id === resId ? { ...r, status: "CHECKED_IN" } : r));
    setRooms(prev => prev.map(room => {
      if (room.id === res.roomId || room.roomNumber === res.roomNumber) {
        return {
          ...room,
          status: "OCCUPIED",
          currentGuestName: res.guestName,
          currentReservationId: res.id,
          keycardCount: 2,
        };
      }
      return room;
    }));

    confetti({ particleCount: 70, spread: 70, origin: { y: 0.7 } });
    showToast(`Guest ${res.guestName} checked in to Room ${res.roomNumber}`, "success");
  };

  const checkOutReservation = (resId: string) => {
    const res = reservations.find(r => r.id === resId);
    if (!res) return;

    setReservations(prev => prev.map(r => r.id === resId ? { ...r, status: "CHECKED_OUT" } : r));
    setRooms(prev => prev.map(room => {
      if (room.id === res.roomId || room.roomNumber === res.roomNumber) {
        return {
          ...room,
          status: "VACANT_DIRTY",
          currentGuestName: undefined,
          currentReservationId: undefined,
          keycardCount: 0,
        };
      }
      return room;
    }));

    // Auto generate Housekeeping Turnover Task
    const newHkTask: HousekeepingTask = {
      id: `hk-${Date.now()}`,
      roomNumber: res.roomNumber,
      roomId: res.roomId,
      taskType: "CHECKOUT_TURNOVER",
      priority: "HIGH",
      status: "PENDING",
      assignedTo: "Unassigned",
      checklist: [
        { item: "Strip & replace bed sheets (Par 3 crisp cotton)", completed: false },
        { item: "Sanitize bathroom and replace towels", completed: false },
        { item: "Replenish luxury botanical amenities", completed: false },
        { item: "Vacuum & dust all surfaces", completed: false },
        { item: "Minibar inspection & restocking", completed: false },
      ],
      notes: `Checkout turnover for ${res.guestName}. Please inspect promptly.`,
    };
    setHousekeepingTasks(prev => [newHkTask, ...prev]);

    showToast(`Room ${res.roomNumber} checked out and flagged for Housekeeping!`, "info");
  };

  const addFolioItem = (folioId: string, item: Omit<FolioItem, "id" | "date">) => {
    const newItem: FolioItem = {
      ...item,
      id: `fi-${Date.now()}`,
      date: new Date().toISOString().substring(0, 10),
    };

    setFolios(prev => prev.map(f => {
      if (f.id === folioId) {
        const updatedItems = [...f.items, newItem];
        const subtotal = updatedItems.reduce((sum, it) => sum + it.amount, 0);
        const serviceCharge = Math.round(subtotal * 0.10);
        const tax = Math.round(subtotal * 0.11);
        const grandTotal = subtotal + serviceCharge + tax;
        return {
          ...f,
          items: updatedItems,
          subtotal,
          serviceCharge,
          tax,
          grandTotal,
          balance: grandTotal - f.totalPaid,
        };
      }
      return f;
    }));

    showToast(`Added ${item.description} to folio (+Rp ${item.amount.toLocaleString()})`);
  };

  const addFolioPayment = (folioId: string, payment: Omit<FolioPayment, "id" | "date">) => {
    const newPayment: FolioPayment = {
      ...payment,
      id: `pay-${Date.now()}`,
      date: new Date().toISOString().substring(0, 10),
    };

    setFolios(prev => prev.map(f => {
      if (f.id === folioId) {
        const updatedPayments = [...f.payments, newPayment];
        const totalPaid = updatedPayments.reduce((sum, p) => sum + p.amount, 0);
        const balance = f.grandTotal - totalPaid;
        return {
          ...f,
          payments: updatedPayments,
          totalPaid,
          balance,
        };
      }
      return f;
    }));

    confetti({ particleCount: 40, spread: 50 });
    showToast(`Payment of Rp ${payment.amount.toLocaleString()} received!`, "success");
  };

  const closeFolio = (folioId: string) => {
    setFolios(prev => prev.map(f => {
      if (f.id === folioId) {
        return {
          ...f,
          isClosed: true,
          closedAt: new Date().toISOString().replace("T", " ").substring(0, 16),
        };
      }
      return f;
    }));
    showToast("Folio settled and closed successfully!");
  };

  const createHousekeepingTask = (task: Omit<HousekeepingTask, "id">) => {
    const newTask: HousekeepingTask = {
      ...task,
      id: `hk-${Date.now()}`,
    };
    setHousekeepingTasks(prev => [newTask, ...prev]);
    showToast(`Housekeeping task created for Room ${task.roomNumber}`);
  };

  const updateHousekeepingStatus = (taskId: string, status: HousekeepingTask["status"], checklist?: HousekeepingTask["checklist"]) => {
    setHousekeepingTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        const updated = {
          ...t,
          status,
          checklist: checklist || t.checklist,
          completedAt: status === "COMPLETED" || status === "VERIFIED" ? new Date().toISOString().replace("T", " ").substring(0, 16) : t.completedAt,
        };
        // If verified, update room status
        if (status === "VERIFIED") {
          setRooms(rmList => rmList.map(r => r.roomNumber === t.roomNumber ? { ...r, status: "VACANT_INSPECTED" } : r));
        } else if (status === "COMPLETED") {
          setRooms(rmList => rmList.map(r => r.roomNumber === t.roomNumber && r.status === "VACANT_DIRTY" ? { ...r, status: "VACANT_CLEAN" } : r));
        }
        return updated;
      }
      return t;
    }));
    showToast(`Housekeeping task marked as ${status}`);
  };

  const createWorkOrder = (order: Omit<MaintenanceWorkOrder, "id" | "ticketCode" | "reportedAt">) => {
    const newOrder: MaintenanceWorkOrder = {
      ...order,
      id: `wo-${Date.now()}`,
      ticketCode: `ENG-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, "0")}-${Math.floor(100 + Math.random() * 900)}`,
      reportedAt: new Date().toISOString().replace("T", " ").substring(0, 16),
    };
    setWorkOrders(prev => [newOrder, ...prev]);
    showToast(`Maintenance Ticket #${newOrder.ticketCode} created`);
  };

  const updateWorkOrderStatus = (orderId: string, status: MaintenanceWorkOrder["status"], resolutionNotes?: string) => {
    setWorkOrders(prev => prev.map(wo => {
      if (wo.id === orderId) {
        return {
          ...wo,
          status,
          resolutionNotes: resolutionNotes || wo.resolutionNotes,
          resolvedAt: status === "RESOLVED" ? new Date().toISOString().replace("T", " ").substring(0, 16) : wo.resolvedAt,
        };
      }
      return wo;
    }));
    showToast(`Work Order updated to ${status}`);
  };

  const sendInternalMessage = (channelId: string, content: string, isUrgent: boolean = false) => {
    const newMsg: InternalMessage = {
      id: `msg-${Date.now()}`,
      channelId,
      senderName: activeRoleProfile.name,
      senderRole: activeRoleProfile.title,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      content,
      isUrgent,
    };
    setMessages(prev => [...prev, newMsg]);
    showToast(`Message sent to #${channelId.replace("ch-", "")}`);
  };

  const addShiftLog = (log: Omit<ShiftLog, "id" | "date" | "isAcknowledged">) => {
    const newLog: ShiftLog = {
      ...log,
      id: `sl-${Date.now()}`,
      date: new Date().toISOString().substring(0, 10),
      isAcknowledged: false,
    };
    setShiftLogs(prev => [newLog, ...prev]);
    showToast("Shift Handover log signed and recorded!");
  };

  const placeFnBOrder = (order: Omit<FnBOrder, "id" | "orderNumber" | "placedAt">) => {
    const orderNumber = `ORD-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, "0")}-${Math.floor(100 + Math.random() * 900)}`;
    const newOrder: FnBOrder = {
      ...order,
      id: `ord-${Date.now()}`,
      orderNumber,
      placedAt: new Date().toISOString().replace("T", " ").substring(0, 16),
    };
    setFnbOrders(prev => [newOrder, ...prev]);

    // If room number provided, automatically add to room folio
    if (order.roomNumber && order.orderType === "ROOM_SERVICE") {
      const targetFolio = folios.find(f => f.roomNumber === order.roomNumber && !f.isClosed);
      if (targetFolio) {
        addFolioItem(targetFolio.id, {
          description: `In-Room Dining (${orderNumber})`,
          category: "FNB",
          amount: order.totalAmount,
          reference: orderNumber,
          postedBy: "FNB_KITCHEN",
        });
      }
    }

    confetti({ particleCount: 35, spread: 45 });
    showToast(`F&B Order ${orderNumber} placed successfully!`, "success");
  };

  const updateFnBOrderStatus = (orderId: string, status: FnBOrder["status"]) => {
    setFnbOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
    showToast(`Order status updated to ${status}`);
  };

  const createPurchaseOrder = (po: Omit<PurchaseOrder, "id" | "poNumber" | "requestedDate">) => {
    const poNumber = `PO-${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, "0")}-${Math.floor(100 + Math.random() * 900)}`;
    const newPO: PurchaseOrder = {
      ...po,
      id: `po-${Date.now()}`,
      poNumber,
      requestedDate: new Date().toISOString().substring(0, 10),
    };
    setPurchaseOrders(prev => [newPO, ...prev]);
    showToast(`Purchase Order ${poNumber} submitted!`);
  };

  const updatePurchaseOrderStatus = (poId: string, status: PurchaseOrder["status"]) => {
    setPurchaseOrders(prev => prev.map(po => po.id === poId ? { ...po, status } : po));
    showToast(`Purchase order status updated to ${status}`);
  };

  const runNightAudit = () => {
    const occupiedCount = rooms.filter(r => r.status === "OCCUPIED").length;
    const totalRooms = rooms.length;
    const occupancyRatePercent = Number(((occupiedCount / totalRooms) * 100).toFixed(1));
    const totalRoomRevenue = rooms.filter(r => r.status === "OCCUPIED").reduce((sum, r) => sum + r.currentRate, 0);
    const totalFnbRevenue = fnbOrders.reduce((sum, o) => sum + o.totalAmount, 0);
    const totalOtherRevenue = 3200000;
    const totalGrossRevenue = totalRoomRevenue + totalFnbRevenue + totalOtherRevenue;
    const adr = occupiedCount > 0 ? Math.round(totalRoomRevenue / occupiedCount) : 0;
    const revPar = Math.round(totalRoomRevenue / totalRooms);

    const auditRecord: NightAuditRecord = {
      id: `na-${Date.now()}`,
      auditDate: new Date().toISOString().substring(0, 10),
      auditorName: activeRoleProfile.name,
      totalOccupiedRooms: occupiedCount,
      occupancyRatePercent,
      totalRoomRevenue,
      totalFnbRevenue,
      totalOtherRevenue,
      totalGrossRevenue,
      adr,
      revPar,
      pendingFoliosResolved: 5,
      discrepanciesCount: 0,
      completedAt: new Date().toISOString().replace("T", " ").substring(0, 16),
      status: "SUCCESSFUL",
    };

    setNightAudits(prev => [auditRecord, ...prev]);
    confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
    showToast(`Night Audit closed successfully! Gross Revenue: Rp ${totalGrossRevenue.toLocaleString()}`, "success");
  };

  const resetAllData = () => {
    localStorage.clear();
    setRooms(INITIAL_ROOMS);
    setReservations(INITIAL_RESERVATIONS);
    setGuests(INITIAL_GUESTS);
    setFolios(INITIAL_FOLIOS);
    setHousekeepingTasks(INITIAL_HOUSEKEEPING_TASKS);
    setWorkOrders(INITIAL_WORK_ORDERS);
    setMessages(INITIAL_MESSAGES);
    setShiftLogs(INITIAL_SHIFT_LOGS);
    setFnbOrders(INITIAL_FNB_ORDERS);
    setInventory(INITIAL_INVENTORY);
    setPurchaseOrders(INITIAL_PURCHASE_ORDERS);
    setNightAudits(INITIAL_NIGHT_AUDITS);
    showToast("Demo data reset to original factory state", "info");
  };

  const addInventoryItem = (item: Omit<InventoryItem, "id">) => {
    const newItem: InventoryItem = {
      ...item,
      id: `inv-${Date.now()}`,
    };
    setInventory(prev => [newItem, ...prev]);
    showToast(`Inventory SKU '${item.name}' added successfully!`);
  };

  const updateInventoryQuantity = (id: string, qty: number) => {
    setInventory(prev => prev.map(i => i.id === id ? { ...i, currentStock: Math.max(0, qty) } : i));
    showToast("Stock quantity updated");
  };

  const updateHousekeepingTask = (taskId: string, status: HousekeepingTask["status"], checklist?: HousekeepingTask["checklist"]) => {
    updateHousekeepingStatus(taskId, status, checklist);
  };

  const updateWorkOrder = (orderId: string, status: MaintenanceWorkOrder["status"], resolutionNotes?: string) => {
    updateWorkOrderStatus(orderId, status, resolutionNotes);
  };

  const sendDepartmentMessage = (msg: { senderName: string; senderRole: string; channel: string; message: string; isUrgent?: boolean }) => {
    sendInternalMessage(msg.channel, msg.message, msg.isUrgent);
  };

  const departmentMessages = messages.map(m => ({
    id: m.id,
    senderName: m.senderName,
    senderRole: m.senderRole,
    channel: m.channelId,
    message: m.content,
    timestamp: m.timestamp,
    isUrgent: m.isUrgent,
  }));

  const fnbMenu: FnbMenuItem[] = fnbItems.map(i => ({
    id: i.id,
    name: i.name,
    category: i.category === "Appetizer" ? "APPETIZER" : i.category === "Main Course" ? "MAIN_COURSE" : i.category === "Dessert" ? "DESSERT" : i.category === "Beverage" ? "BEVERAGE" : "COCKTAIL_WINE",
    price: i.price,
    prepTimeMinutes: i.prepTimeMinutes,
    description: i.description,
  }));

  const createFnbOrder = (order: any) => {
    placeFnBOrder({
      roomNumber: order.roomNumber,
      tableNumber: order.tableNumber,
      orderType: order.orderType === "ROOM_DELIVERY" ? "ROOM_SERVICE" : "RESTAURANT_DINE_IN",
      items: order.items.map((it: any) => ({
        item: {
          id: it.menuItemId,
          name: it.name,
          category: "Main Course",
          price: it.price,
          isAvailable: true,
          prepTimeMinutes: 15,
          description: "",
        },
        quantity: it.quantity,
      })),
      status: "PLACED",
      totalAmount: order.totalAmount,
      guestName: order.guestName,
    });
  };

  const updateFnbOrderStatus = (orderId: string, status: any) => {
    updateFnBOrderStatus(orderId, status);
  };

  const nightAuditReports: NightAuditReport[] = nightAudits.map(n => ({
    id: n.id,
    date: n.auditDate,
    grossRevenue: n.totalGrossRevenue,
    totalRoomRevenue: n.totalRoomRevenue,
    totalFnbRevenue: n.totalFnbRevenue,
    totalTaxCollected: Math.round(n.totalGrossRevenue * 0.11),
    adr: n.adr,
    revPar: n.revPar,
    occupancyRate: n.occupancyRatePercent,
    auditorName: n.auditorName,
    status: "BALANCED",
  }));

  return (
    <HotelContext.Provider
      value={{
        language,
        setLanguage,
        t,
        activeRole,
        setActiveRole,
        activeRoleProfile,
        activeView,
        setActiveView,
        rooms,
        reservations,
        guests,
        folios,
        housekeepingTasks,
        workOrders,
        channels,
        messages,
        shiftLogs,
        fnbItems,
        fnbOrders,
        inventory,
        purchaseOrders,
        staff,
        nightAudits,
        nightAuditReports,
        departmentMessages,
        fnbMenu,
        selectedRoom,
        setSelectedRoom,
        selectedFolio,
        setSelectedFolio,
        selectedGuest,
        setSelectedGuest,
        activeChannelId,
        setActiveChannelId,
        toastMessage,
        showToast,
        updateRoomStatus,
        createReservation,
        checkInReservation,
        checkOutReservation,
        addFolioItem,
        addFolioPayment,
        closeFolio,
        createHousekeepingTask,
        updateHousekeepingStatus,
        updateHousekeepingTask,
        createWorkOrder,
        updateWorkOrderStatus,
        updateWorkOrder,
        sendInternalMessage,
        sendDepartmentMessage,
        addShiftLog,
        placeFnBOrder,
        createFnbOrder,
        updateFnBOrderStatus,
        updateFnbOrderStatus,
        createPurchaseOrder,
        updatePurchaseOrderStatus,
        addInventoryItem,
        updateInventoryQuantity,
        runNightAudit,
        resetAllData,
      }}
    >
      {children}
    </HotelContext.Provider>
  );
};

export const useHotel = () => {
  const context = useContext(HotelContext);
  if (!context) {
    throw new Error("useHotel must be used within a HotelProvider");
  }
  return context;
};

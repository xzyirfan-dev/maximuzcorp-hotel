export type Language = "id" | "en";

export interface LanguageOption {
  code: Language;
  label: string;
  nativeLabel: string;
  flag: string;
  sublabel: string;
}

export const LANGUAGE_OPTIONS: LanguageOption[] = [
  {
    code: "id",
    label: "Bahasa Indonesia",
    nativeLabel: "Bahasa Indonesia",
    flag: "🇮🇩",
    sublabel: "Indonesia (ID)"
  },
  {
    code: "en",
    label: "English (US)",
    nativeLabel: "English (US)",
    flag: "🇺🇸",
    sublabel: "United States (EN)"
  }
];

export const translations = {
  id: {
    // Brand & App
    appName: "MaximuzCorp - Grub",
    appSubname: "Grand Heritage Resort",
    activeRolePerspective: "Perspektif Pengguna Aktif",
    switchLanguage: "Pilih Bahasa",
    currentLanguage: "Bahasa Indonesia",
    liveSync: "Sinkronisasi Langsung",
    quickSearchPlaceholder: "Cari kamar (contoh: 101), tamu, kode booking (MXZ-...), atau menu...",
    quickNavTitle: "Navigasi Cepat Workspace",
    pressCmdK: "Tekan ⌘K untuk pencarian instan",
    allRooms: "Semua Kamar",
    allGuests: "Semua Tamu",
    allReservations: "Semua Reservasi",
    noResultsFound: "Tidak ditemukan hasil untuk",

    // Navigation Items
    nav: {
      operations: "Operasional Hotel",
      dashboard: "Ringkasan Eksekutif",
      roomMatrix: "Tape Chart & Rak Kamar",
      reservations: "Front Desk & Reservasi",
      housekeeping: "Tata Graha & Kebersihan",
      maintenance: "Teknik & Pemeliharaan",
      comms: "Komunikasi & Log Shift",
      fnbPos: "POS Restoran & Room Dining",
      finance: "Keuangan & Night Audit",
      inventory: "Inventaris & Pengadaan",
      staff: "Jadwal Staf & SDM",
      aiIntelligence: "Kecerdasan AI Maximuz",
      blueprint: "Spesifikasi & Blueprint Sistem",
    },

    // Nav Subtitles / Headers
    navSubtitles: {
      dashboard: "Kinerja operasional dan performa finansial hotel secara real-time",
      roomMatrix: "Manajemen inventaris kamar langsung, status kebersihan & tape chart 7-hari visual",
      reservations: "Kedatangan tamu, keberangkatan, check-in cepat, folio tagihan & CRM",
      housekeeping: "Disposisi pembersihan, pelacakan turn-over kamar & manajemen stok linen",
      maintenance: "Work order fasilitas, pemeliharaan HVAC, kelistrikan & penugasan teknisi",
      comms: "Koordinasi antar-departemen berbasis channel & log serah terima giliran kerja",
      fnbPos: "Pemesanan kuliner restoran, room service & pembebanan langsung ke folio kamar",
      finance: "Laporan harian hotel, analitik RevPAR/ADR, laba-rugi & audit malam otomatis",
      inventory: "Bahan habis pakai hotel, pemenuhan linen, dan alur purchase order (PO)",
      staff: "Jadwal shift kerja departemen, daftar hadir & evaluasi kinerja staf",
      aiIntelligence: "Pengoptimal tarif dinamis, sentimen ulasan & model perkiraan strategis",
      blueprint: "Arsitektur perusahaan, rancangan UX/UI, skema basis data & spesifikasi",
    },

    // Header Actions
    header: {
      quickSearch: "Pencarian Cepat...",
      businessDate: "Tanggal Operasional",
      morningShift: "Shift Pagi",
      eveningShift: "Shift Sore",
      nightShift: "Shift Malam",
      newBooking: "Reservasi Baru",
      aiHub: "Kecerdasan AI",
      nightAudit: "Audit Malam",
      notifications: "Pemberitahuan Sistem",
      operationalAlerts: "Peringatan Operasional Hotel",
      otaSyncActive: "Sinkronisasi OTA Aktif",
      otaSyncDesc: "Inventaris kamar terhubung dengan Booking.com, Agoda, dan Direct Web.",
      assignedTo: "Ditugaskan ke",
      vipTurndown: "Persiapan VIP Turndown",
    },

    // Common Buttons & Statuses
    common: {
      save: "Simpan",
      cancel: "Batal",
      delete: "Hapus",
      edit: "Ubah",
      close: "Tutup",
      filter: "Filter",
      search: "Cari",
      export: "Ekspor Data",
      print: "Cetak",
      refresh: "Segarkan",
      resetDemoData: "Reset Data Simulasi",
      resetSuccess: "Data simulasi hotel berhasil direset ke kondisi awal.",
      active: "Aktif",
      pending: "Menunggu",
      inProgress: "Sedang Dikerjakan",
      completed: "Selesai",
      resolved: "Teratasi",
      open: "Terbuka",
      verified: "Terverifikasi",
      urgent: "Mendesak",
      high: "Tinggi",
      medium: "Sedang",
      low: "Rendah",
      all: "Semua",
      actions: "Aksi",
      status: "Status",
      category: "Kategori",
      room: "Kamar",
      guest: "Tamu",
      date: "Tanggal",
      amount: "Jumlah",
      total: "Total",
      notes: "Catatan",
      priority: "Prioritas",
      viewDetails: "Lihat Rincian",
      back: "Kembali",
      confirm: "Konfirmasi",
      copy: "Salin",
      copied: "Berhasil Disalin!",
    },

    // Room Statuses
    roomStatus: {
      OCCUPIED: "Terisi (Occupied)",
      VACANT_CLEAN: "Kosong Bersih (Clean)",
      VACANT_DIRTY: "Kosong Kotor (Dirty)",
      VACANT_INSPECTED: "Inspeksi Bersih (Inspected)",
      IN_PROGRESS: "Sedang Dibersihkan",
      RESERVED: "Dipesan (Reserved)",
      DUE_OUT: "Check-Out Hari Ini",
      OUT_OF_ORDER: "Perbaikan (OOO)",
    },

    // Dashboard View Strings
    dashboard: {
      kpiOccupancy: "Tingkat Okupansi",
      kpiAdr: "Tarif Harian Rata-rata (ADR)",
      kpiRevpar: "Pendapatan per Kamar (RevPAR)",
      kpiRevenueToday: "Pendapatan Hari Ini",
      kpiProjectedMonth: "Proyeksi Akhir Bulan",
      kpiAvailableRooms: "Kamar Tersedia",
      kpiOccupiedRooms: "Kamar Terisi",
      kpiDirtyRooms: "Kamar Kotor",
      kpiMaintenanceRooms: "Dalam Perbaikan",
      quickActions: "Aksi Cepat Manajemen",
      revenueTrend: "Tren Pendapatan & Okupansi 7 Hari Terakhir",
      todayArrivals: "Kedatangan Hari Ini (Check-In)",
      todayDepartures: "Keberangkatan Hari Ini (Check-Out)",
      liveHousekeepingStatus: "Status Langsung Tata Graha",
      liveWorkOrders: "Work Order Pemeliharaan Aktif",
      recentGuests: "Tamu Terbaru Check-In",
      vipGuestsInHouse: "Tamu VIP Menginap",
      channelBreakdown: "Kontribusi Kanal Pemesanan",
      directBookingPromo: "Tingkatkan Pemesanan Langsung via WhatsApp & Website",
    },

    // Front Desk & Reservations
    reservations: {
      tabAll: "Semua Reservasi",
      tabArrivals: "Kedatangan Hari Ini",
      tabDepartures: "Keberangkatan Hari Ini",
      tabInHouse: "Sedang Menginap (In-House)",
      tabCancelled: "Dibatalkan / No Show",
      createNewReservation: "Buat Reservasi Baru",
      bookingCode: "Kode Booking",
      checkIn: "Check-In",
      checkOut: "Check-Out",
      nights: "Malam",
      guestDetails: "Data Tamu",
      roomAssigned: "Kamar Dialokasikan",
      channel: "Kanal",
      depositPaid: "Deposit Dibayar",
      balanceDue: "Sisa Tagihan",
      actionCheckIn: "Proses Check-In",
      actionCheckOut: "Proses Check-Out",
      actionViewFolio: "Lihat Folio Tagihan",
      actionCancelBooking: "Batalkan Booking",
      confirmCheckInTitle: "Konfirmasi Check-In Tamu",
      confirmCheckOutTitle: "Konfirmasi Check-Out & Pelunasan",
      guestFolioBilling: "Folio & Rincian Tagihan Tamu",
      printInvoice: "Cetak Invoice / Struk",
    },

    // Housekeeping
    housekeeping: {
      title: "Manajemen Tata Graha & Kebersihan Kamar",
      subtitle: "Alur turn-around kebersihan kamar, penugasan staf room attendant & par stock linen",
      assignAttendant: "Tugaskan Room Attendant",
      markClean: "Tandai Bersih",
      markInspected: "Inspeksi & Siap Jual",
      startCleaning: "Mulai Pembersihan",
      cleaningChecklist: "Daftar Periksa Kebersihan",
      linenParStock: "Stok Linen & Perlengkapan Kamar",
      quickTurnaround: "Prioritaskan Kamar Tamu VIP",
    },

    // Maintenance & Engineering
    maintenance: {
      title: "Teknik & Pemeliharaan Fasilitas",
      subtitle: "Pencatatan gangguan, perawatan preventif HVAC & pelacakan status teknisi",
      newWorkOrder: "Buat Work Order Baru",
      reportedBy: "Dilaporkan Oleh",
      location: "Lokasi / Nomor Kamar",
      issueDescription: "Deskripsi Kendala",
      assignedTech: "Teknisi Bertanggung Jawab",
      categoryHvac: "AC & Ventilasi (HVAC)",
      categoryPlumbing: "Saluran Air & Plumbing",
      categoryElectrical: "Kelistrikan & Penerangan",
      categoryCivil: "Sipil & Furnitur",
      categoryNetwork: "WiFi & Jaringan",
    },

    // Language switcher modal / toast
    languageNotice: {
      switchedTitle: "Bahasa Diubah ke Bahasa Indonesia",
      switchedDesc: "Antarmuka sistem MaximuzCorp - Grub sekarang ditampilkan dalam Bahasa Indonesia.",
    }
  },

  en: {
    // Brand & App
    appName: "MaximuzCorp - Grub",
    appSubname: "Grand Heritage Resort",
    activeRolePerspective: "Active User Perspective",
    switchLanguage: "Language Selection",
    currentLanguage: "English (US)",
    liveSync: "Live Cloud Sync",
    quickSearchPlaceholder: "Search rooms (e.g. 101), guests, booking codes (MXZ-...), or jump to views...",
    quickNavTitle: "Quick Navigation Workspaces",
    pressCmdK: "Press ⌘K for instant search",
    allRooms: "All Rooms",
    allGuests: "All Guests",
    allReservations: "All Reservations",
    noResultsFound: "No matching results found for",

    // Navigation Items
    nav: {
      operations: "Hotel Operations",
      dashboard: "Executive Overview",
      roomMatrix: "Room Rack & Tape Chart",
      reservations: "Front Desk & Bookings",
      housekeeping: "Housekeeping & Rooms",
      maintenance: "Engineering & Facilities",
      comms: "Department Channels",
      fnbPos: "F&B POS & Room Dining",
      finance: "Finance & Night Audit",
      inventory: "Procurement & Par Stock",
      staff: "Staff Roster & HR",
      aiIntelligence: "Maximuz AI Intelligence",
      blueprint: "System Blueprint & Specs",
    },

    // Nav Subtitles / Headers
    navSubtitles: {
      dashboard: "Real-time hotel operational & financial performance metrics",
      roomMatrix: "Live room inventory, housekeeping status & 7-day visual tape chart",
      reservations: "Guest arrivals, departures, fast check-in, guest folios & CRM",
      housekeeping: "Cleanliness dispatch, room turnover tracking & linen par stock",
      maintenance: "Facility work orders, HVAC maintenance & technician dispatch",
      comms: "Channel-based inter-department coordination & shift handover logs",
      fnbPos: "Restaurant ordering, room dining dispatch & direct guest folio billing",
      finance: "Daily flash reports, RevPAR/ADR analytics, P&L & automated night audit",
      inventory: "Hotel consumables, linen replenishment & purchase order workflows",
      staff: "Department shift schedules, duty rosters & staff performance tracking",
      aiIntelligence: "Dynamic pricing optimizer, review sentiment & strategic forecasting",
      blueprint: "Enterprise architecture, UX/UI blueprints, DB schema & system specs",
    },

    // Header Actions
    header: {
      quickSearch: "Quick Search...",
      businessDate: "Business Date",
      morningShift: "Morning Shift",
      eveningShift: "Evening Shift",
      nightShift: "Night Shift",
      newBooking: "New Booking",
      aiHub: "AI Intelligence",
      nightAudit: "Night Audit",
      notifications: "System Notifications",
      operationalAlerts: "Hotel Operational Alerts",
      otaSyncActive: "OTA Sync Active",
      otaSyncDesc: "Booking.com, Agoda & Direct Web inventory synchronized.",
      assignedTo: "Assigned to",
      vipTurndown: "VIP Turndown Service",
    },

    // Common Buttons & Statuses
    common: {
      save: "Save",
      cancel: "Cancel",
      delete: "Delete",
      edit: "Edit",
      close: "Close",
      filter: "Filter",
      search: "Search",
      export: "Export Data",
      print: "Print",
      refresh: "Refresh",
      resetDemoData: "Reset Demo Data",
      resetSuccess: "Hotel simulation database successfully reset to default state.",
      active: "Active",
      pending: "Pending",
      inProgress: "In Progress",
      completed: "Completed",
      resolved: "Resolved",
      open: "Open",
      verified: "Verified",
      urgent: "Urgent",
      high: "High",
      medium: "Medium",
      low: "Low",
      all: "All",
      actions: "Actions",
      status: "Status",
      category: "Category",
      room: "Room",
      guest: "Guest",
      date: "Date",
      amount: "Amount",
      total: "Total",
      notes: "Notes",
      priority: "Priority",
      viewDetails: "View Details",
      back: "Back",
      confirm: "Confirm",
      copy: "Copy",
      copied: "Copied to clipboard!",
    },

    // Room Statuses
    roomStatus: {
      OCCUPIED: "Occupied",
      VACANT_CLEAN: "Vacant Clean",
      VACANT_DIRTY: "Vacant Dirty",
      VACANT_INSPECTED: "Vacant Inspected",
      IN_PROGRESS: "Cleaning In Progress",
      RESERVED: "Reserved",
      DUE_OUT: "Due Out Today",
      OUT_OF_ORDER: "Out of Order",
    },

    // Dashboard View Strings
    dashboard: {
      kpiOccupancy: "Occupancy Rate",
      kpiAdr: "Average Daily Rate (ADR)",
      kpiRevpar: "Revenue Per Available Room (RevPAR)",
      kpiRevenueToday: "Today's Revenue",
      kpiProjectedMonth: "Month-End Projected Revenue",
      kpiAvailableRooms: "Available Rooms",
      kpiOccupiedRooms: "Occupied Rooms",
      kpiDirtyRooms: "Dirty Rooms",
      kpiMaintenanceRooms: "In Maintenance",
      quickActions: "Management Quick Actions",
      revenueTrend: "7-Day Revenue & Occupancy Trend",
      todayArrivals: "Today's Arrivals (Check-In)",
      todayDepartures: "Today's Departures (Check-Out)",
      liveHousekeepingStatus: "Live Housekeeping Status",
      liveWorkOrders: "Active Engineering Work Orders",
      recentGuests: "Recent Guest Check-Ins",
      vipGuestsInHouse: "VIP Guests In-House",
      channelBreakdown: "Distribution Channels Share",
      directBookingPromo: "Boost Direct Bookings via WhatsApp & Website",
    },

    // Front Desk & Reservations
    reservations: {
      tabAll: "All Reservations",
      tabArrivals: "Today's Arrivals",
      tabDepartures: "Today's Departures",
      tabInHouse: "Currently In-House",
      tabCancelled: "Cancelled / No-Show",
      createNewReservation: "Create New Reservation",
      bookingCode: "Booking Code",
      checkIn: "Check-In",
      checkOut: "Check-Out",
      nights: "Nights",
      guestDetails: "Guest Details",
      roomAssigned: "Assigned Room",
      channel: "Channel",
      depositPaid: "Deposit Paid",
      balanceDue: "Balance Due",
      actionCheckIn: "Process Check-In",
      actionCheckOut: "Process Check-Out",
      actionViewFolio: "View Billing Folio",
      actionCancelBooking: "Cancel Reservation",
      confirmCheckInTitle: "Confirm Guest Check-In",
      confirmCheckOutTitle: "Confirm Guest Check-Out & Settlement",
      guestFolioBilling: "Guest Billing Folio & Charges",
      printInvoice: "Print Invoice / Receipt",
    },

    // Housekeeping
    housekeeping: {
      title: "Housekeeping & Room Turnaround Management",
      subtitle: "Room turnaround workflow, attendant dispatch & linen par stock tracking",
      assignAttendant: "Assign Room Attendant",
      markClean: "Mark Clean",
      markInspected: "Inspect & Ready for Sale",
      startCleaning: "Start Cleaning",
      cleaningChecklist: "Room Turnaround Checklist",
      linenParStock: "Linen & Amenities Par Stock",
      quickTurnaround: "Prioritize VIP Guest Rooms",
    },

    // Maintenance & Engineering
    maintenance: {
      title: "Engineering & Facility Maintenance",
      subtitle: "Defect logging, HVAC preventative maintenance & technician status",
      newWorkOrder: "Create Work Order",
      reportedBy: "Reported By",
      location: "Location / Room Number",
      issueDescription: "Issue Description",
      assignedTech: "Assigned Technician",
      categoryHvac: "HVAC & Ventilation",
      categoryPlumbing: "Plumbing & Drainage",
      categoryElectrical: "Electrical & Lighting",
      categoryCivil: "Civil & Furniture",
      categoryNetwork: "WiFi & Network",
    },

    // Language switcher modal / toast
    languageNotice: {
      switchedTitle: "Language Changed to English (US)",
      switchedDesc: "MaximuzCorp - Grub user interface is now displayed in English (US).",
    }
  }
};

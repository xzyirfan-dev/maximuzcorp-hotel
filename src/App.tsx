/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { HotelProvider, useHotel } from "./context/HotelContext";
import { Sidebar } from "./components/Sidebar";
import { Header } from "./components/Header";
import { CommandPalette } from "./components/CommandPalette";
import { DashboardView } from "./components/views/DashboardView";
import { RoomMatrixView } from "./components/views/RoomMatrixView";
import { ReservationsView } from "./components/views/ReservationsView";
import { HousekeepingView } from "./components/views/HousekeepingView";
import { MaintenanceView } from "./components/views/MaintenanceView";
import { DepartmentCommsView } from "./components/views/DepartmentCommsView";
import { FnBPosView } from "./components/views/FnBPosView";
import { FinanceView } from "./components/views/FinanceView";
import { InventoryView } from "./components/views/InventoryView";
import { StaffHrView } from "./components/views/StaffHrView";
import { AiIntelligenceView } from "./components/views/AiIntelligenceView";
import { BlueprintView } from "./components/views/BlueprintView";
import { GuestFolioModal } from "./components/views/GuestFolioModal";

const MainContent: React.FC = () => {
  const { activeView, selectedFolio, setSelectedFolio } = useHotel();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [newBookingModalOpen, setNewBookingModalOpen] = useState(false);

  const renderActiveView = () => {
    switch (activeView) {
      case "dashboard":
        return <DashboardView onOpenNewBooking={() => setNewBookingModalOpen(true)} />;
      case "room-matrix":
        return <RoomMatrixView />;
      case "reservations":
        return (
          <ReservationsView 
            isNewBookingOpen={newBookingModalOpen} 
            setIsNewBookingOpen={setNewBookingModalOpen} 
          />
        );
      case "housekeeping":
        return <HousekeepingView />;
      case "maintenance":
        return <MaintenanceView />;
      case "comms":
        return <DepartmentCommsView />;
      case "fnb-pos":
        return <FnBPosView />;
      case "finance":
        return <FinanceView />;
      case "inventory":
        return <InventoryView />;
      case "staff":
        return <StaffHrView />;
      case "ai-intelligence":
        return <AiIntelligenceView />;
      case "blueprint":
        return <BlueprintView />;
      default:
        return <DashboardView onOpenNewBooking={() => setNewBookingModalOpen(true)} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f5f0] flex text-stone-900 font-sans antialiased selection:bg-emerald-800 selection:text-white">
      {/* Sidebar Navigation */}
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      {/* Main Workspace Frame */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-72">
        {/* Sticky Notion-style Header */}
        <Header 
          onOpenMobileMenu={() => setSidebarOpen(true)}
          onOpenCommandPalette={() => setCommandPaletteOpen(true)}
          onOpenNewBookingModal={() => setNewBookingModalOpen(true)}
        />

        {/* View Workspace Container */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {renderActiveView()}
        </main>
      </div>

      {/* Quick Search Palette (Cmd+K) */}
      <CommandPalette 
        isOpen={commandPaletteOpen} 
        onClose={() => setCommandPaletteOpen(false)} 
      />

      {/* Guest Billing Folio Modal */}
      {selectedFolio && (
        <GuestFolioModal 
          folio={selectedFolio} 
          onClose={() => setSelectedFolio(null)} 
        />
      )}
    </div>
  );
};

export default function App() {
  return (
    <HotelProvider>
      <MainContent />
    </HotelProvider>
  );
}

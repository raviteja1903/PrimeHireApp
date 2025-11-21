import React from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "@/components/AppSidebar";
import MainContent from "@/components/MainContent";
import { useMainContent } from "@/hooks/useMainContent";
import Header from "@/common/Header"; // ✅ Import Header at top level

const Index = () => {
  const mainContent = useMainContent();
  const {
    selectedFeature,
    selectedTask,
    isLoading,
    handleFeatureClick,
    handleTaskSelect,
    handleRefresh, // ✅ So we can refresh from header
  } = mainContent;

  return (
    <SidebarProvider>
      {/* ✅ Sidebar + Main Layout */}
      <div className="flex min-h-screen w-full bg-background overflow-hidden">
        {/* Sidebar */}
        <AppSidebar
          selectedFeature={selectedFeature}
          selectedTask={selectedTask}
          isLoading={isLoading}
          onFeatureSelect={handleFeatureClick}
          onTaskSelect={handleTaskSelect}
        />

        {/* Main Area */}
        <div className="flex-1 flex flex-col h-screen overflow-hidden">
          <Header onRefresh={handleRefresh} />

          {/* ✅ Main Chat & Features */}
          <MainContent {...mainContent} />
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Index;

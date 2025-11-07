import React from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
// import AppSidebar from "@/components/AppSidebar";
import MainContent from "@/components/MainContent";
// import "./IndexOne.css";

const Index = () => {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        {/* <AppSidebar /> */}
        <MainContent />
      </div>
    </SidebarProvider>
  );
};

export default Index;
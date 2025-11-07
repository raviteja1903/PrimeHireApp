// import { Link as LinkIcon, Brain as BrainIcon, Cpu as CpuIcon } from "lucide-react";
// import {
//   Sidebar,
//   SidebarContent,
//   SidebarGroup,
//   SidebarGroupContent,
//   SidebarGroupLabel,
//   SidebarMenu,
//   SidebarMenuButton,
//   SidebarMenuItem,
//   useSidebar,
// } from "@/components/ui/sidebar";

// const features = [
//   { id: "zoho", label: "ZohoBridge", icon: <LinkIcon className="h-4 w-4" /> },
//   { id: "mailmind", label: "MailMind", icon: <BrainIcon className="h-4 w-4" /> },
//   { id: "primehire", label: "PrimeHire Brain", icon: <CpuIcon className="h-4 w-4" /> },
// ];

// export function AppSidebar() {
//   const { open } = useSidebar();

//   const handleFeatureClick = (featureId) => {
//     console.log("Feature clicked:", featureId);
//     // You can also send this event to parent via props or context
//   };

//   return (
//     <Sidebar collapsible="icon">
//       <SidebarContent>
//         <SidebarGroup>
//           <SidebarGroupLabel className="flex items-center justify-between">
//             {open && <span>Features</span>}
//           </SidebarGroupLabel>
//           <SidebarGroupContent>
//             <SidebarMenu>
//               {features.map((feature) => (
//                 <SidebarMenuItem key={feature.id}>
//                   <SidebarMenuButton asChild>
//                     <button
//                       className="w-full flex items-center gap-2 hover:bg-muted px-2 py-1 rounded-md"
//                       onClick={() => handleFeatureClick(feature.id)}
//                     >
//                       {feature.icon}
//                       {open && <span>{feature.label}</span>}
//                     </button>
//                   </SidebarMenuButton>
//                 </SidebarMenuItem>
//               ))}
//             </SidebarMenu>
//           </SidebarGroupContent>
//         </SidebarGroup>
//       </SidebarContent>
//     </Sidebar>
//   );
// }

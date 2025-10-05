import { MessageSquare, Plus } from "lucide-react";
import { NavLink } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";

const conversations = [
  { id: "1", title: "Welcome conversation", url: "/" },
  { id: "2", title: "Previous chat", url: "/" },
  { id: "3", title: "Another discussion", url: "/" },
];

export function AppSidebar() {
  const { open } = useSidebar();

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="flex items-center justify-between">
            {open && <span>Conversations</span>}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <button className="w-full flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    {open && <span>New Chat</span>}
                  </button>
                </SidebarMenuButton>
              </SidebarMenuItem>
              {conversations.map((conv) => (
                <SidebarMenuItem key={conv.id}>
                  <SidebarMenuButton asChild>
                    <NavLink to={conv.url} className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4" />
                      {open && <span className="truncate">{conv.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

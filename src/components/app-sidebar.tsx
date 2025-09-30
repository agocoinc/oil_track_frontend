"use client"

import * as React from "react"
import {
  IconDashboard,
  IconDatabase,
  IconInnerShadowTop,
  IconTable
} from "@tabler/icons-react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useAuth } from "@/hooks/useAuth"

const data = {
  navMain: [
    {
      title: "الصفحة الرئيسية",
      url:  "/dashboard",
      icon: IconDashboard,
      role: "user"
    },
    {
      title: "المعدات",
      url: "/equipments",
      icon: IconDatabase,
      role: "user"
    },
    {
      title: "الشركات",
      url: "/companies",
      icon: IconTable,
      role: "admin"
    },
   
   
  ],
  
  
}




export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuth();

  return (
    <Sidebar collapsible="offcanvas" {...props} dir="rtl" side="right">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="#">
                <IconInnerShadowTop className="!size-5" />
                <span className="text-base font-semibold">شركة الخليج</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} user={{name: user?.name || "", email: user?.email || "", role: user?.role || ""}} />
      </SidebarContent>
      <SidebarFooter>
        {user ? <NavUser user={{
          name: user?.name,
          email: user?.email
        }} /> : ""}
      </SidebarFooter>
    </Sidebar>
  )
}
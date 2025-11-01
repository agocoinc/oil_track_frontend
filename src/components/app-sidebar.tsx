"use client"

import * as React from "react"
import {
  IconBusinessplan,
  IconCategory,
  IconDashboard,
  IconDatabase,
  IconInnerShadowTop,
  IconMap,
  IconTable,
  IconUsersGroup
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
      title: "الصفحة الرئيسية",
      url:  "/dashboard",
      icon: IconDashboard,
      role: "admin"
    },
    {
      title: "الشركات",
      url: "/companies",
      icon: IconTable,
      role: "admin"
    },
    {
      title: "التصنيفات",
      url: "/categories",
      icon: IconCategory,
      role: "admin"
    },
    {
      title: "التصنيفات",
      url: "/u/categories",
      icon: IconCategory,
      role: "user"
    },
    {
      title: "المستخدمين",
      url: "/users",
      icon: IconUsersGroup,
      role: "admin"
    },
    {
      title: "مخطط الشركة",
      url: "/u/management-structure",
      icon: IconMap,
      role: "user"
    }
   
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
                <span className="text-base font-semibold">نظام التتبع</span>
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
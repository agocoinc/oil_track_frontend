"use client"

import { IconCirclePlusFilled,  type Icon } from "@tabler/icons-react"


import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import Link from "next/link"

export function NavMain({
  items,
  user
}: {
  items: {
    title: string
    url: string
    icon?: Icon
    role: string
  }[]
  user: {
    name: string,
    email: string,
    role: string
  }
}) {
  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center gap-2">
            {/* <SidebarMenuButton
              tooltip="Quick Create"
              className="bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground min-w-8 duration-200 ease-linear"
            
            >
              <IconCirclePlusFilled />
              <span>إضافة سريعة</span>
            </SidebarMenuButton> */}
            
              
              
            
          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarMenu>
          {items
            .filter(item => user.role === 'admin' || item.role !== 'admin')
            .map(item => (
              <SidebarMenuItem
                key={item.title}
                className={user.role === 'admin' && item.role === 'admin' ? '' : undefined}
              >
                <SidebarMenuButton tooltip={item.role === 'admin' ? `${item.title} (Admin)` : item.title}>
                  {item.icon && <item.icon />}
                  <Link href={item.url}>{item.title}</Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
        </SidebarMenu>

      </SidebarGroupContent>
    </SidebarGroup>
  )
}

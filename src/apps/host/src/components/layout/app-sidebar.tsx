'use client';

import * as React from 'react';
import { HomeIcon, LineChartIcon, RabbitIcon } from 'lucide-react';
import { Link, useLocation } from '@tanstack/react-router';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarRail,
} from '@repo/ui/components/ui/sidebar';
import { NavMain } from '../nav/nav-main';

// This is sample data.
const data = {
  navMain: [
    {
      title: 'Home',
      url: '/',
      icon: HomeIcon,
    },
    {
      title: 'About',
      url: '/about',
      icon: LineChartIcon,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const location = useLocation();
  const isActive = (item: { url: string }) => location.pathname === item.url;
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="p-0 h-[64px] flex justify-center border-b">
        <div className="flex overflow-hidden px-2">
          <Link
            to="/"
            className="flex flex-nowrap items-center overflow-hidden gap-4"
          >
            <RabbitIcon className="h-8 w-8 shrink-0 bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-full p-1" />
            <div className="text-muted-foreground font-semibold text-[12px] tracking-widest">
              <div className="truncate">NX MOD</div>
              <div className="truncate">DYNAMIC FED</div>
            </div>
          </Link>
        </div>
      </SidebarHeader>

      <SidebarContent className="pt-1">
        <SidebarGroup className="pb-1">
          <SidebarGroupLabel>Platform</SidebarGroupLabel>
          <NavMain items={data.navMain} isActive={isActive} />
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t"></SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

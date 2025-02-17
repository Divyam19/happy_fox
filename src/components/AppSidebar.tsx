"use client"
import React, { useState, useEffect } from 'react';
import { Calendar, Home, Inbox, Search, Settings, User } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
import debounce from 'lodash/debounce';

// Static menu items
const staticItems = [
  { title: "Home", url: "#", icon: Home },
  { title: "Inbox", url: "#", icon: Inbox },
  { title: "Calendar", url: "#", icon: Calendar },
  { title: "Settings", url: "#", icon: Settings },
];

export function AppSidebar() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchEmployees = async (query) => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/search-employees?q=${encodeURIComponent(query)}`);
      const data = await response.json();
      setFilteredEmployees(data);
    } catch (error) {
      console.error('Error fetching employees:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const debouncedSearch = debounce(fetchEmployees, 300);

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (query.length >= 2) {
      debouncedSearch(query);
    } else {
      setFilteredEmployees([]);
    }
  };

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Search Employees</SidebarGroupLabel>
          <SidebarGroupContent>
            <div className="px-3 py-2">
              <Input
                className="w-full"
                placeholder="Search employees..."
                value={searchQuery}
                onChange={handleSearchChange}
              />
            </div>
            <SidebarMenu>
              {isLoading ? (
                <div className="px-3 py-2 text-sm text-gray-500">Loading...</div>
              ) : (
                <>
                  {filteredEmployees.length > 0 ? (
                    filteredEmployees.map((employee) => (
                      <SidebarMenuItem key={employee.id}>
                        <SidebarMenuButton asChild>
                          <a href={`/employee/${employee.id}`} className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            <div className="flex flex-col">
                              <span className="text-sm font-medium">{employee.name}</span>
                              <span className="text-xs text-gray-500">
                                {employee.designation} • {employee.team}
                              </span>
                            </div>
                          </a>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))
                  ) : searchQuery.length >= 2 && (
                    <div className="px-3 py-2 text-sm text-gray-500">No results found</div>
                  )}
                </>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {staticItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url} className="flex items-center gap-2">
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </a>
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

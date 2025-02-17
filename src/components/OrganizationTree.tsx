"use client"
import React, { useState, useEffect } from 'react';
import { User, ChevronRight, ChevronDown } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const TreeNode = ({ employee, level = 0 }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const hasSubordinates = employee.subordinates && employee.subordinates.length > 0;

  return (
    <div className="ml-4">
      <div 
        className="flex items-center gap-2 py-2 cursor-pointer hover:bg-gray-50"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {hasSubordinates && (
          <button className="w-4 h-4 flex items-center justify-center">
            {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>
        )}
        {!hasSubordinates && <div className="w-4" />}
        <div className="flex items-center gap-2">
          <User className="w-4 h-4 text-gray-500" />
          <div className="flex flex-col">
            <span className="text-sm font-medium">{employee.name}</span>
            <span className="text-xs text-gray-500">
              {employee.designation} • {employee.team}
            </span>
          </div>
        </div>
      </div>
      {isExpanded && hasSubordinates && (
        <div className="border-l border-gray-200">
          {employee.subordinates.map((subordinate) => (
            <TreeNode 
              key={subordinate.id} 
              employee={subordinate} 
              level={level + 1} 
            />
          ))}
        </div>
      )}
    </div>
  );
};

export function OrganizationTree() {
  const [organizationTree, setOrganizationTree] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchOrganizationTree = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/organization-tree');
        const data = await response.json();
        setOrganizationTree(data);
      } catch (error) {
        console.error('Error fetching organization tree:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrganizationTree();
  }, []);

  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle>Organization Structure</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-gray-500">Loading organization structure...</div>
          ) : (
            organizationTree.map((employee) => (
              <TreeNode key={employee.id} employee={employee} />
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}

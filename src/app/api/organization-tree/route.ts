import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // First, find all employees who don't have a manager (top-level managers)
    const rootEmployees = await prisma.employee.findMany({
      where: {
        managerId: null,
      },
      include: {
        subordinates: true,
      },
    });

    // Recursive function to build the tree
    async function buildEmployeeTree(employees) {
      const tree = [];
      for (const employee of employees) {
        const subordinates = await prisma.employee.findMany({
          where: {
            managerId: employee.id,
          },
          include: {
            subordinates: true,
          },
        });

        const employeeNode = {
          ...employee,
          subordinates: subordinates.length > 0 ? await buildEmployeeTree(subordinates) : [],
        };

        tree.push(employeeNode);
      }
      return tree;
    }

    const organizationTree = await buildEmployeeTree(rootEmployees);
    return NextResponse.json(organizationTree);
  } catch (error) {
    console.error('Error fetching organization tree:', error);
    return NextResponse.error();
  }
}

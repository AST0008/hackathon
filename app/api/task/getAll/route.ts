import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const assigneeId = searchParams.get("assigneeId");

  try {
    const prisma = new PrismaClient();
    let tasks:any = [];
    // Fetch tasks assigned to the specified assignee
    if (assigneeId)
    {
       tasks = await prisma.task.findMany({
        where: {
          assigneeId: assigneeId,
        },
        include: {
          user: true, 
          assignee: true, 
        },
      });
    }
    else 
    {
      tasks = await prisma.task.findMany({
        include: {
          user: true, 
          assignee: true, 
        },
      });
    }

    await prisma.$disconnect();

    return NextResponse.json(tasks, { status: 200 });
  } catch (err) {
    console.log("ERROR fetching tasks:", err);
    return NextResponse.json({ message: "Error fetching tasks" }, { status: 500 });
  }
}

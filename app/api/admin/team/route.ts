import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET() {
  try {
    const team = await db.teamMember.findMany({
      orderBy: { order: "asc" },
    });
    return NextResponse.json(team);
  } catch (error) {
    console.error("GET Admin Team API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch team members." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { name, role, category, bio, imageUrl, order } = await request.json();

    if (!name || !role || !category) {
      return NextResponse.json(
        { error: "Name, role, and category are required." },
        { status: 400 }
      );
    }

    const member = await db.teamMember.create({
      data: {
        name,
        role,
        category,
        bio,
        imageUrl,
        order: typeof order === "number" ? order : 0,
      },
    });

    return NextResponse.json(
      { success: true, member },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST Admin Team API Error:", error);
    return NextResponse.json(
      { error: "Failed to create team member." },
      { status: 500 }
    );
  }
}

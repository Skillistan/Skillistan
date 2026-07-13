import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET() {
  try {
    const programs = await db.program.findMany({
      orderBy: { number: "asc" },
    });
    return NextResponse.json(programs);
  } catch (error) {
    console.error("GET Admin Programs API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch programs." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { number, title, description } = await request.json();

    if (!number || !title || !description) {
      return NextResponse.json(
        { error: "Number, title, and description are required." },
        { status: 400 }
      );
    }

    const program = await db.program.create({
      data: {
        number,
        title,
        description,
      },
    });

    return NextResponse.json(
      { success: true, program },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST Admin Programs API Error:", error);
    return NextResponse.json(
      { error: "Failed to create program." },
      { status: 500 }
    );
  }
}

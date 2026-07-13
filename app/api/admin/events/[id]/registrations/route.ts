import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const registrations = await db.eventRegistration.findMany({
      where: { eventId: id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(registrations);
  } catch (error) {
    console.error("GET Admin Event Registrations API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch event registrations." },
      { status: 500 }
    );
  }
}

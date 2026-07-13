import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET() {
  try {
    const events = await db.event.findMany({
      orderBy: { eventDate: "desc" },
      include: {
        _count: {
          select: { registrations: true },
        },
      },
    });
    return NextResponse.json(events);
  } catch (error) {
    console.error("GET Admin Events API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch events." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const {
      title,
      slug,
      description,
      eventDate,
      location,
      imageUrl,
      registrationEnabled,
      status,
    } = await request.json();

    if (!title || !slug || !eventDate) {
      return NextResponse.json(
        { error: "Title, slug, and event date are required." },
        { status: 400 }
      );
    }

    const event = await db.event.create({
      data: {
        title,
        slug,
        description: description || "",
        eventDate: new Date(eventDate),
        location: location || "",
        imageUrl,
        registrationEnabled: typeof registrationEnabled === "boolean" ? registrationEnabled : false,
        status: status || "draft",
      },
    });

    return NextResponse.json(
      { success: true, event },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST Admin Events API Error:", error);
    
    // Check if slug duplication occurs
    if ((error as any).code === "P2002") {
      return NextResponse.json(
        { error: "An event with this slug URL already exists." },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "Failed to create event." },
      { status: 500 }
    );
  }
}

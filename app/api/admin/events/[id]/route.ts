import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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

    const updatedEvent = await db.event.update({
      where: { id },
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

    return NextResponse.json({ success: true, event: updatedEvent });
  } catch (error) {
    console.error("PUT Admin Events ID API Error:", error);
    
    if ((error as any).code === "P2002") {
      return NextResponse.json(
        { error: "An event with this slug URL already exists." },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "Failed to update event." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Database schema specifies "onDelete: Cascade" for event_registrations
    await db.event.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: "Event deleted successfully." });
  } catch (error) {
    console.error("DELETE Admin Events ID API Error:", error);
    return NextResponse.json(
      { error: "Failed to delete event." },
      { status: 500 }
    );
  }
}

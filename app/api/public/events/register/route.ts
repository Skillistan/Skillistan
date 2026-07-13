import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function POST(request: Request) {
  try {
    const { eventId, firstName, lastName, email, mobile, message } = await request.json();

    if (!eventId || !firstName || !lastName || !email || !mobile) {
      return NextResponse.json(
        { error: "Required fields (Event ID, First name, Last name, Email, Mobile) are missing." },
        { status: 400 }
      );
    }

    // Verify event exists and is active for registration
    const event = await db.event.findUnique({
      where: { id: eventId },
    });

    if (!event) {
      return NextResponse.json(
        { error: "Target event was not found in our database." },
        { status: 404 }
      );
    }

    if (!event.registrationEnabled || event.status !== "published") {
      return NextResponse.json(
        { error: "Registration for this event is closed or unavailable." },
        { status: 400 }
      );
    }

    // Check if user is already registered for this event with this email
    const existingRegistration = await db.eventRegistration.findUnique({
      where: {
        eventId_email: {
          eventId,
          email,
        },
      },
    });

    if (existingRegistration) {
      return NextResponse.json(
        { error: "You are already registered for this event with this email address." },
        { status: 409 }
      );
    }

    const registration = await db.eventRegistration.create({
      data: {
        eventId,
        firstName,
        lastName,
        email,
        mobile,
        message,
      },
    });

    return NextResponse.json(
      { success: true, message: "Registered for the event successfully.", id: registration.id },
      { status: 201 }
    );
  } catch (error) {
    console.error("Public Event Registration API Error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred while saving the registration." },
      { status: 500 }
    );
  }
}

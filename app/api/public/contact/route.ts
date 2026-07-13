import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function POST(request: Request) {
  try {
    const { firstName, lastName, email, mobile, message } = await request.json();

    if (!firstName || !lastName || !email || !mobile || !message) {
      return NextResponse.json(
        { error: "All fields are required." },
        { status: 400 }
      );
    }

    const newMessage = await db.contactMessage.create({
      data: {
        firstName,
        lastName,
        email,
        mobile,
        message,
      },
    });

    return NextResponse.json(
      { success: true, message: "Message received successfully.", id: newMessage.id },
      { status: 201 }
    );
  } catch (error) {
    console.error("Public Contact API Error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred while saving the message." },
      { status: 500 }
    );
  }
}

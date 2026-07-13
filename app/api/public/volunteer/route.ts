import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function POST(request: Request) {
  try {
    const { firstName, lastName, email, mobile, message } = await request.json();

    if (!firstName || !lastName || !email || !mobile) {
      return NextResponse.json(
        { error: "Required fields (First name, Last name, Email, Mobile) are missing." },
        { status: 400 }
      );
    }

    const application = await db.volunteerApplication.create({
      data: {
        firstName,
        lastName,
        email,
        mobile,
        message, // optional field
      },
    });

    return NextResponse.json(
      { success: true, message: "Application received successfully.", id: application.id },
      { status: 201 }
    );
  } catch (error) {
    console.error("Public Volunteer API Error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred while saving the application." },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email is required." },
        { status: 400 }
      );
    }

    // Check if subscriber already exists
    const existing = await db.newsletterSubscriber.findUnique({
      where: { email },
    });

    if (existing) {
      return NextResponse.json(
        { success: true, message: "You are already subscribed to the newsletter." },
        { status: 200 }
      );
    }

    const subscriber = await db.newsletterSubscriber.create({
      data: { email },
    });

    return NextResponse.json(
      { success: true, message: "Subscribed successfully.", id: subscriber.id },
      { status: 201 }
    );
  } catch (error) {
    console.error("Public Newsletter API Error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred while saving the subscription." },
      { status: 500 }
    );
  }
}

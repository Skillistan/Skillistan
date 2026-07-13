import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type"); // "volunteer" | "contact" | "newsletter"

    if (!type) {
      return NextResponse.json(
        { error: "Submission type query parameter is required." },
        { status: 400 }
      );
    }

    if (type === "volunteer") {
      const submissions = await db.volunteerApplication.findMany({
        orderBy: { createdAt: "desc" },
      });
      return NextResponse.json(submissions);
    } else if (type === "contact") {
      const submissions = await db.contactMessage.findMany({
        orderBy: { createdAt: "desc" },
      });
      return NextResponse.json(submissions);
    } else if (type === "newsletter") {
      const submissions = await db.newsletterSubscriber.findMany({
        orderBy: { createdAt: "desc" },
      });
      return NextResponse.json(submissions);
    } else {
      return NextResponse.json(
        { error: "Invalid submission type. Must be 'volunteer', 'contact', or 'newsletter'." },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("GET Admin Submissions API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch submissions." },
      { status: 500 }
    );
  }
}

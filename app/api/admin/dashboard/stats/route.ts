import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET() {
  try {
    const [
      activeEvents,
      publishedStories,
      teamMembers,
      volunteerApplications,
      contactMessages,
      newsletterSubscribers,
    ] = await Promise.all([
      db.event.count({ where: { status: "published" } }),
      db.story.count({ where: { status: "published" } }),
      db.teamMember.count(),
      db.volunteerApplication.count(),
      db.contactMessage.count(),
      db.newsletterSubscriber.count(),
    ]);

    return NextResponse.json({
      activeEvents,
      publishedStories,
      teamMembers,
      volunteerApplications,
      contactMessages,
      newsletterSubscribers,
    });
  } catch (error) {
    console.error("Dashboard Stats API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard statistics." },
      { status: 500 }
    );
  }
}

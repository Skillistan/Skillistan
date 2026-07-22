import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET() {
  try {
    const [
      activeEventsCount,
      publishedStoriesCount,
      seniorManagementCount,
      employeesCount,
      internsCount,
      totalQueriesCount,
      newsletterCount,
      volunteerCount,
      totalEventsCount,
      totalStoriesCount,
      totalRegistrationsCount,
      recentQueries,
      recentVolunteers,
    ] = await Promise.all([
      db.event.count({ where: { status: "published" } }),
      db.story.count({ where: { status: "published" } }),
      db.teamMember.count({ where: { category: "leadership" } }),
      db.teamMember.count({ where: { category: "employee" } }),
      db.teamMember.count({ where: { category: "intern" } }),
      db.contactMessage.count(),
      db.newsletterSubscriber.count(),
      db.volunteerApplication.count(),
      db.event.count(),
      db.story.count(),
      db.eventRegistration.count(),
      db.contactMessage.findMany({
        take: 4,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          message: true,
          createdAt: true,
        },
      }),
      db.volunteerApplication.findMany({
        take: 4,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          createdAt: true,
        },
      }),
    ]);

    return NextResponse.json({
      stats: {
        activeEvents: activeEventsCount,
        publishedStories: publishedStoriesCount,
        seniorManagement: seniorManagementCount,
        employees: employeesCount,
        interns: internsCount,
        totalQueries: totalQueriesCount,
        newsletterSubmissions: newsletterCount,
        volunteerSubmissions: volunteerCount,
        // Additional aggregates
        totalEvents: totalEventsCount,
        totalStories: totalStoriesCount,
        totalRegistrations: totalRegistrationsCount,
      },
      recents: {
        queries: recentQueries,
        volunteers: recentVolunteers,
      },
    });
  } catch (error) {
    console.error("Admin Stats API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard metrics" },
      { status: 500 }
    );
  }
}

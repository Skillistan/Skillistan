import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Verify event exists to customize output filename
    const event = await db.event.findUnique({
      where: { id },
    });

    if (!event) {
      return NextResponse.json(
        { error: "Event not found in our database." },
        { status: 404 }
      );
    }

    const registrations = await db.eventRegistration.findMany({
      where: { eventId: id },
      orderBy: { createdAt: "desc" },
    });

    // Construct CSV content string
    const headers = [
      "Registration ID",
      "First Name",
      "Last Name",
      "Email",
      "Mobile",
      "Message",
      "Registered At",
    ];
    const rows = registrations.map((r) => [
      r.id,
      r.firstName,
      r.lastName,
      r.email,
      r.mobile,
      r.message || "",
      r.createdAt.toISOString(),
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) =>
        row
          .map((val) => {
            // Escape double quotes inside values by doubling them
            const escaped = val.replace(/"/g, '""');
            return `"${escaped}"`;
          })
          .join(",")
      ),
    ].join("\n");

    // Return plain text CSV with attachment headers
    return new Response(csvContent, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="registrations_${event.slug}_export.csv"`,
      },
    });
  } catch (error) {
    console.error("GET Admin Event Registrations Export API Error:", error);
    return NextResponse.json(
      { error: "Failed to export event registrations." },
      { status: 500 }
    );
  }
}

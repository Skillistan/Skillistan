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

    let csvContent = "";
    let filename = "";

    if (type === "volunteer") {
      const list = await db.volunteerApplication.findMany({
        orderBy: { createdAt: "desc" },
      });
      const headers = [
        "Application ID",
        "First Name",
        "Last Name",
        "Email",
        "Mobile",
        "Area of Interest",
        "Submitted At",
      ];
      const rows = list.map((v) => [
        v.id,
        v.firstName,
        v.lastName,
        v.email,
        v.mobile,
        v.message || "",
        v.createdAt.toISOString(),
      ]);
      csvContent = [
        headers.join(","),
        ...rows.map((row) =>
          row.map((val) => `"${val.replace(/"/g, '""')}"`).join(",")
        ),
      ].join("\n");
      filename = "volunteer_applications_export.csv";
    } else if (type === "contact") {
      const list = await db.contactMessage.findMany({
        orderBy: { createdAt: "desc" },
      });
      const headers = [
        "Message ID",
        "First Name",
        "Last Name",
        "Email",
        "Mobile",
        "Message Details",
        "Submitted At",
      ];
      const rows = list.map((c) => [
        c.id,
        c.firstName,
        c.lastName,
        c.email,
        c.mobile,
        c.message,
        c.createdAt.toISOString(),
      ]);
      csvContent = [
        headers.join(","),
        ...rows.map((row) =>
          row.map((val) => `"${val.replace(/"/g, '""')}"`).join(",")
        ),
      ].join("\n");
      filename = "contact_inquiries_export.csv";
    } else if (type === "newsletter") {
      const list = await db.newsletterSubscriber.findMany({
        orderBy: { createdAt: "desc" },
      });
      const headers = ["Subscriber ID", "Email Address", "Subscribed At"];
      const rows = list.map((n) => [n.id, n.email, n.createdAt.toISOString()]);
      csvContent = [
        headers.join(","),
        ...rows.map((row) =>
          row.map((val) => `"${val.replace(/"/g, '""')}"`).join(",")
        ),
      ].join("\n");
      filename = "newsletter_subscribers_export.csv";
    } else {
      return NextResponse.json(
        { error: "Invalid submission type. Must be 'volunteer', 'contact', or 'newsletter'." },
        { status: 400 }
      );
    }

    return new Response(csvContent, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error("GET Admin Submissions Export API Error:", error);
    return NextResponse.json(
      { error: "Failed to export submissions." },
      { status: 500 }
    );
  }
}

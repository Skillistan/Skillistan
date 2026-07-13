import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ type: string; id: string }> }
) {
  try {
    const { type, id } = await params;

    if (type === "volunteer") {
      await db.volunteerApplication.delete({
        where: { id },
      });
    } else if (type === "contact") {
      await db.contactMessage.delete({
        where: { id },
      });
    } else if (type === "newsletter") {
      await db.newsletterSubscriber.delete({
        where: { id },
      });
    } else {
      return NextResponse.json(
        { error: "Invalid submission type. Must be 'volunteer', 'contact', or 'newsletter'." },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `${type.charAt(0).toUpperCase() + type.slice(1)} submission deleted successfully.`,
    });
  } catch (error) {
    console.error("DELETE Submission API Error:", error);
    return NextResponse.json(
      { error: "Failed to delete submission record." },
      { status: 500 }
    );
  }
}

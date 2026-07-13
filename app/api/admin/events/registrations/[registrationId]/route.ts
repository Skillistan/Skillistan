import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ registrationId: string }> }
) {
  try {
    const { registrationId } = await params;

    await db.eventRegistration.delete({
      where: { id: registrationId },
    });

    return NextResponse.json({ success: true, message: "Registration cancelled successfully." });
  } catch (error) {
    console.error("DELETE Event Registration API Error:", error);
    return NextResponse.json(
      { error: "Failed to delete event registration." },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { name, role, category, bio, imageUrl, order } = await request.json();

    if (!name || !role || !category) {
      return NextResponse.json(
        { error: "Name, role, and category are required." },
        { status: 400 }
      );
    }

    const updatedMember = await db.teamMember.update({
      where: { id },
      data: {
        name,
        role,
        category,
        bio,
        imageUrl,
        order: typeof order === "number" ? order : 0,
      },
    });

    return NextResponse.json({ success: true, member: updatedMember });
  } catch (error) {
    console.error("PUT Admin Team ID API Error:", error);
    return NextResponse.json(
      { error: "Failed to update team member." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await db.teamMember.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: "Team member deleted." });
  } catch (error) {
    console.error("DELETE Admin Team ID API Error:", error);
    return NextResponse.json(
      { error: "Failed to delete team member." },
      { status: 500 }
    );
  }
}

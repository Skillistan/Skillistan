import { NextResponse } from "next/server";
import db from "@/lib/db";

const slugify = (text: string) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
};

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { number, title, slug: inputSlug, tagline, overview, outcomes, description, imageUrl } = await request.json();

    if (!number || !title || !description) {
      return NextResponse.json(
        { error: "Number, title, and description are required." },
        { status: 400 }
      );
    }

    const generatedSlug = (inputSlug && inputSlug.trim() !== "") ? slugify(inputSlug) : slugify(title);

    // Check slug uniqueness against other programs
    const existing = await db.program.findFirst({
      where: {
        slug: generatedSlug,
        NOT: { id: id },
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Another program with this title or slug already exists." },
        { status: 400 }
      );
    }

    const updatedProgram = await db.program.update({
      where: { id },
      data: {
        number,
        title,
        slug: generatedSlug,
        tagline: tagline || null,
        overview: overview || null,
        outcomes: outcomes || null,
        description,
        imageUrl: imageUrl !== undefined ? imageUrl : undefined,
      },
    });

    return NextResponse.json({ success: true, program: updatedProgram });
  } catch (error) {
    console.error("PUT Admin Programs ID API Error:", error);
    return NextResponse.json(
      { error: "Failed to update program." },
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

    await db.program.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: "Program deleted." });
  } catch (error) {
    console.error("DELETE Admin Programs ID API Error:", error);
    return NextResponse.json(
      { error: "Failed to delete program." },
      { status: 500 }
    );
  }
}

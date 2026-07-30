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

export async function GET() {
  try {
    const programs = await db.program.findMany({
      orderBy: { number: "asc" },
      include: {
        events: {
          select: { id: true, title: true, slug: true, eventDate: true, location: true },
        },
      },
    });
    return NextResponse.json(programs);
  } catch (error) {
    console.error("GET Admin Programs API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch programs." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const {
      number,
      title,
      slug: inputSlug,
      logoUrl,
      tagline,
      overview,
      outcomes,
      description,
      imageUrl,
      eventIds,
    } = await request.json();

    if (!number || !title || !description) {
      return NextResponse.json(
        { error: "Number, title, and description are required." },
        { status: 400 }
      );
    }

    const generatedSlug = inputSlug && inputSlug.trim() !== "" ? slugify(inputSlug) : slugify(title);

    // Check slug uniqueness
    const existing = await db.program.findFirst({
      where: { slug: generatedSlug },
    });

    if (existing) {
      return NextResponse.json(
        { error: "A program with this title or slug already exists." },
        { status: 400 }
      );
    }

    const program = await db.program.create({
      data: {
        number,
        title,
        slug: generatedSlug,
        logoUrl: logoUrl || null,
        tagline: tagline || null,
        overview: overview || null,
        outcomes: outcomes || null,
        description,
        imageUrl: imageUrl || null,
      },
    });

    // Link up to 3 selected events
    if (Array.isArray(eventIds) && eventIds.length > 0) {
      const validEventIds = eventIds.filter((id) => typeof id === "string" && id.trim() !== "").slice(0, 3);
      if (validEventIds.length > 0) {
        await db.event.updateMany({
          where: { id: { in: validEventIds } },
          data: { programId: program.id },
        });
      }
    }

    return NextResponse.json(
      { success: true, program },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST Admin Programs API Error:", error);
    return NextResponse.json(
      { error: "Failed to create program." },
      { status: 500 }
    );
  }
}

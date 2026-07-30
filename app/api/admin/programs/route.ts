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
    const { number, title, slug: inputSlug, tagline, overview, outcomes, description, imageUrl } = await request.json();

    if (!number || !title || !description) {
      return NextResponse.json(
        { error: "Number, title, and description are required." },
        { status: 400 }
      );
    }

    const generatedSlug = (inputSlug && inputSlug.trim() !== "") ? slugify(inputSlug) : slugify(title);

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
        tagline: tagline || null,
        overview: overview || null,
        outcomes: outcomes || null,
        description,
        imageUrl: imageUrl || null,
      },
    });

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

import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET() {
  try {
    const stories = await db.story.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(stories);
  } catch (error) {
    console.error("GET Admin Stories API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch stories." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const {
      title,
      slug,
      excerpt,
      content,
      featuredImageUrl,
      status,
      publishedAt,
    } = await request.json();

    if (!title || !slug || !content) {
      return NextResponse.json(
        { error: "Title, slug, and content are required." },
        { status: 400 }
      );
    }

    const story = await db.story.create({
      data: {
        title,
        slug,
        excerpt: excerpt || "",
        content,
        featuredImageUrl,
        status: status || "draft",
        publishedAt: status === "published" ? new Date() : (publishedAt ? new Date(publishedAt) : null),
      },
    });

    return NextResponse.json(
      { success: true, story },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST Admin Stories API Error:", error);
    
    // Check if slug duplication occurs
    if ((error as any).code === "P2002") {
      return NextResponse.json(
        { error: "A story with this slug URL already exists." },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "Failed to create story." },
      { status: 500 }
    );
  }
}

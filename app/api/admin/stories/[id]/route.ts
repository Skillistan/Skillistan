import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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

    // Retrieve existing story to check if its publish status is changing
    const existingStory = await db.story.findUnique({
      where: { id },
    });

    if (!existingStory) {
      return NextResponse.json(
        { error: "Story was not found in our database." },
        { status: 404 }
      );
    }

    // Determine publishedAt value
    let newPublishedAt = existingStory.publishedAt;
    if (status === "published" && existingStory.status !== "published") {
      newPublishedAt = new Date();
    } else if (status === "draft") {
      newPublishedAt = null;
    } else if (publishedAt) {
      newPublishedAt = new Date(publishedAt);
    }

    const updatedStory = await db.story.update({
      where: { id },
      data: {
        title,
        slug,
        excerpt: excerpt || "",
        content,
        featuredImageUrl,
        status: status || "draft",
        publishedAt: newPublishedAt,
      },
    });

    return NextResponse.json({ success: true, story: updatedStory });
  } catch (error) {
    console.error("PUT Admin Stories ID API Error:", error);
    
    if ((error as any).code === "P2002") {
      return NextResponse.json(
        { error: "A story with this slug URL already exists." },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "Failed to update story." },
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

    await db.story.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: "Story deleted successfully." });
  } catch (error) {
    console.error("DELETE Admin Stories ID API Error:", error);
    return NextResponse.json(
      { error: "Failed to delete story." },
      { status: 500 }
    );
  }
}

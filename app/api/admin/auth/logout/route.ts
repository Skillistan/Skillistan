import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json(
    { success: true, message: "Logged out successfully." },
    { status: 200 }
  );

  // Expire the cookie immediately
  response.cookies.set("skillistan_session", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires: new Date(0),
    path: "/",
  });

  return response;
}

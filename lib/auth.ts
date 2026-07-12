import * as jose from "jose";

const secretString =
  process.env.JWT_SECRET ||
  "skillistan-admin-ventures-default-fallback-long-secret-key-2026-xyz";

const JWT_SECRET = new TextEncoder().encode(secretString);

export async function signJWT(payload: { id: string; email: string }) {
  return await new jose.SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(JWT_SECRET);
}

export async function verifyJWT(token: string) {
  try {
    const { payload } = await jose.jwtVerify(token, JWT_SECRET);
    return payload as { id: string; email: string };
  } catch (error) {
    return null;
  }
}

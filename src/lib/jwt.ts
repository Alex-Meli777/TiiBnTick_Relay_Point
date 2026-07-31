import { SignJWT, jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.RELAY_JWT_SECRET ?? "dev-relay-secret");

export async function signRelayToken(payload: Record<string, unknown>) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret);
}

export async function verifyRelayToken(token: string) {
  const { payload } = await jwtVerify(token, secret);
  return payload as Record<string, any>;
}

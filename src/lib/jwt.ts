import { SignJWT, jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.RELAY_JWT_SECRET ?? "tiibntick-relay-dev-secret-change-in-prod"
);

export interface RelayJwtPayload {
  sub: string;
  role: "relay_owner";
  fullName: string;
  phone: string;
  managedRelayPointIds: string[];
}

export async function signRelayToken(
  payload: Omit<RelayJwtPayload, "role">
): Promise<string> {
  return new SignJWT({ ...payload, role: "relay_owner" as const })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(JWT_SECRET);
}

export async function verifyRelayToken(
  token: string
): Promise<RelayJwtPayload> {
  const { payload } = await jwtVerify(token, JWT_SECRET);
  return payload as unknown as RelayJwtPayload;
}

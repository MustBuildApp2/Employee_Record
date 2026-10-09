import { NextRequest } from "next/server";
import { noContent, serverError } from "@/lib/api/responses";
import { asString, readJsonObject } from "@/lib/api/request";
import { revokeRefreshToken } from "@/lib/services/auth";

export async function POST(request: NextRequest) {
  try {
    const parsed = await readJsonObject(request);
    if (parsed.body) {
      const refreshToken = asString(parsed.body.refreshToken);
      if (refreshToken) await revokeRefreshToken(refreshToken);
    }
    return noContent();
  } catch (error) {
    return serverError(error);
  }
}

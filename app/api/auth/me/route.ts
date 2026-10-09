import { NextRequest } from "next/server";
import { requireAuth } from "@/lib/auth/context";
import { ok, serverError } from "@/lib/api/responses";

export async function GET(request: NextRequest) {
  try {
    const auth = await requireAuth(request);
    if (auth.response) return auth.response;
    return ok({ user: auth.user });
  } catch (error) {
    return serverError(error);
  }
}

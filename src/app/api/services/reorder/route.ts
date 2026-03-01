import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { services } from "@/lib/schema";
import { eq } from "drizzle-orm";

// PATCH /api/services/reorder
// Body: [{ id: number, sortOrder: number }, ...]
export async function PATCH(request: NextRequest) {
  const body: { id: number; sortOrder: number }[] = await request.json();

  if (!Array.isArray(body)) {
    return NextResponse.json({ error: "Expected an array" }, { status: 400 });
  }

  for (const { id, sortOrder } of body) {
    db.update(services)
      .set({ sortOrder })
      .where(eq(services.id, id))
      .run();
  }

  return NextResponse.json({ success: true });
}

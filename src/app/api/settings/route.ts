import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { settings } from "@/lib/schema";
import { eq } from "drizzle-orm";

function getOrCreateSettings() {
  const row = db.select().from(settings).where(eq(settings.id, 1)).get();
  if (row) return row;
  db.insert(settings).values({ id: 1, backgroundImage: "", bgOpacity: 1 }).run();
  return { id: 1, backgroundImage: "", bgOpacity: 1 };
}

export async function GET() {
  const row = getOrCreateSettings();
  return NextResponse.json({ backgroundImage: row.backgroundImage, bgOpacity: row.bgOpacity });
}

export async function PUT(request: NextRequest) {
  const body: { backgroundImage: string; bgOpacity: number } = await request.json();
  getOrCreateSettings();
  db.update(settings)
    .set({
      backgroundImage: body.backgroundImage ?? "",
      bgOpacity: body.bgOpacity ?? 1,
    })
    .where(eq(settings.id, 1))
    .run();
  return NextResponse.json({ backgroundImage: body.backgroundImage ?? "", bgOpacity: body.bgOpacity ?? 1 });
}

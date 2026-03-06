import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { categories, services } from "@/lib/schema";
import { eq } from "drizzle-orm";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  if (!body.name) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }

  const result = db
    .update(categories)
    .set({ name: body.name })
    .where(eq(categories.id, parseInt(id)))
    .returning()
    .get();

  if (!result) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(result);
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const numericId = parseInt(id);

  // Dienste dieser Kategorie unkategorisieren
  db.update(services)
    .set({ categoryId: null })
    .where(eq(services.categoryId, numericId))
    .run();

  const result = db
    .delete(categories)
    .where(eq(categories.id, numericId))
    .returning()
    .get();

  if (!result) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ success: true });
}

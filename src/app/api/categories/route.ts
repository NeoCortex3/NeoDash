import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { categories } from "@/lib/schema";
import { asc } from "drizzle-orm";

export async function GET() {
  const all = db.select().from(categories).orderBy(asc(categories.sortOrder)).all();
  return NextResponse.json(all);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  if (!body.name) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }

  const existing = db.select({ sortOrder: categories.sortOrder }).from(categories).all();
  const nextOrder = existing.length > 0
    ? Math.max(...existing.map((c) => c.sortOrder)) + 1
    : 0;

  const result = db
    .insert(categories)
    .values({ name: body.name, sortOrder: nextOrder })
    .returning()
    .get();

  return NextResponse.json(result, { status: 201 });
}

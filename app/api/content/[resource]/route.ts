import { NextResponse } from "next/server";
import { news } from "@/lib/data/news";
import { programs } from "@/lib/data/programs";
import { schools } from "@/lib/data/schools";
import { trainings } from "@/lib/data/trainings";

const content = { news, programs, schools, trainings };

export async function GET(
  _request: Request,
  context: { params: Promise<{ resource: string }> }
) {
  const { resource } = await context.params;
  const items = content[resource as keyof typeof content];

  if (!items) {
    return NextResponse.json({ message: "Sumber data tidak ditemukan." }, { status: 404 });
  }

  return NextResponse.json({ data: items });
}

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(): Promise<Response> {
  try {
    const workouts = await prisma.workout.findMany();
    return new Response(JSON.stringify(workouts), { status: 200 });
  } catch (error) {
    console.error("Error fetching workouts:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch workouts" }), { status: 500 });
  }
}

export async function POST(req: Request): Promise<Response> {
  try {
    const { name, location, mapsUrl, schedule, eventType } = await req.json();

    const newWorkout = await prisma.workout.create({
      data: {
        name,
        location,
        mapsUrl,
        schedule,
        eventType,
      },
    });

    return new Response(JSON.stringify(newWorkout), { status: 201 });
  } catch (error) {
    console.error("Error creating workout:", error);
    return new Response(JSON.stringify({ error: "Failed to create workout" }), { status: 500 });
  }
}
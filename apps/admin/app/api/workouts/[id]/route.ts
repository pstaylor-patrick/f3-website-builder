import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function PUT(req: Request, context: { params: { id: string } }): Promise<Response> {
  try {
    const { id } = await context.params; // Await params before using them
    const { name, location, mapsUrl, schedule, eventType, sortOrder } = await req.json();

    const updatedWorkout = await prisma.workout.update({
      where: { id },
      data: {
        name,
        location,
        mapsUrl,
        schedule,
        eventType,
        sortOrder,
      },
    });

    return new Response(JSON.stringify(updatedWorkout), { status: 200 });
  } catch (error) {
    console.error("Error updating workout:", error);
    return new Response(JSON.stringify({ error: "Failed to update workout" }), { status: 500 });
  }
}

export async function DELETE(req: Request, context: { params: { id: string } }): Promise<Response> {
  try {
    const { id } = await context.params; // Await params before using them

    await prisma.workout.delete({
      where: { id },
    });

    return new Response(null, { status: 204 });
  } catch (error) {
    console.error("Error deleting workout:", error);
    return new Response(JSON.stringify({ error: "Failed to delete workout" }), { status: 500 });
  }
}
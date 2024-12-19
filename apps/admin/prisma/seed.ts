const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  const workouts = [
    {
        name: "Murph Monday",
        location: "Woodland Park (11th st Entrance)",
        mapsUrl: "https://goo.gl/maps/UEULdFoyEpTRwLLo9",
        schedule: "Monday: 5:25 AM - 6:15 AM",
        eventType: "Murph",
    },
    {
        name: "The Phoenix",
        location: "Woodland Park (11th st Entrance)",
        mapsUrl: "https://goo.gl/maps/UEULdFoyEpTRwLLo9",
        schedule: "Monday: 5:30 AM - 6:15 AM",
        eventType: "Beatdown",
    },
    {
        name: "The Arena",
        location: "Riverwalk Park (Basketball Court)",
        mapsUrl: "https://goo.gl/maps/8UenhCFvXi6KQFWaA",
        schedule: "Tuesday: 5:15 AM - 6:15 AM",
        eventType: "Ruck + Sandbag",
    },
    {
        name: "Compass",
        location: "Columbia Public Square",
        mapsUrl: "https://goo.gl/maps/BvGZ49ycjCovcZbP6",
        schedule: "Tuesday: 5:30 AM - 6:15 AM",
        eventType: "Beatdown",
    },
    {
        name: "Slag Mountain",
        location: "Maury County Park (Kiwanis Pavilion)",
        mapsUrl: "https://goo.gl/maps/ps3AKHmqueDevzQt7",
        schedule: "Wednesday: 5:20 AM - 6:15 AM",
        eventType: "Run",
    },
    {
        name: "Iron Mule",
        location: "Maury County Park (Kids Kingdom)",
        mapsUrl: "https://goo.gl/maps/ps3AKHmqueDevzQt7",
        schedule: "Wednesday: 5:30 AM - 6:15 AM",
        eventType: "Weight Lifting",
    },
    {
        name: "The Refuge",
        location: "Chickasaw Trace Park",
        mapsUrl: "https://goo.gl/maps/iQJLUJ5kk3hj7SwV9",
        schedule: "Thursday: 5:30 AM - 6:15 AM",
        eventType: "Trail Run",
    },
    {
        name: "Ruck and Roll",
        location: "Riverwalk Park (Basketball Court)",
        mapsUrl: "https://goo.gl/maps/8UenhCFvXi6KQFWaA",
        schedule: "Thursday: 5:30 AM - 6:15 AM",
        eventType: "Ruck",
    },
    {
        name: "Bedrock",
        location: "Riverwalk Park (Basketball Court)",
        mapsUrl: "https://goo.gl/maps/8UenhCFvXi6KQFWaA",
        schedule: "Friday: 5:15 AM - 6:15 AM (closed third Friday each month)",
        eventType: "Sandbag",
    },
    {
        name: "The Challenge",
        location: "Columbia State Community College",
        mapsUrl: "https://goo.gl/maps/Rv4udm1mpBXZFdGy8",
        schedule: "Friday: 5:30 AM - 6:15 AM (closed third Friday each month)",
        eventType: "Beatdown",
    },
    {
        name: "Outpost",
        location: "Maury County Park (Monsanto Pavilion)",
        mapsUrl: "https://goo.gl/maps/j3YiN4xen7mRy8RK8",
        schedule: "Every Third Friday: 5:15 AM - 6:15 AM",
        eventType: "3rd F (Faith)",
    },
    {
        name: "Darkhorse",
        location: "Riverwalk Park (Basketball Court)",
        mapsUrl: "https://goo.gl/maps/8UenhCFvXi6KQFWaA",
        schedule: "Saturday: 6:00 AM - 7:00 AM",
        eventType: "Beatdown",
    },
    {
        name: "Hawkeye",
        location: "Hampshire School",
        mapsUrl: "https://maps.app.goo.gl/hpiKvFLT1iGJVwGG8",
        schedule: "Saturday: 6:00 AM - 7:00 AM (closed last Saturday each month)",
        eventType: "Beatdown",
      },
  ];

  for (let i = 0; i < workouts.length; i++) {
    const workout = { ...workouts[i], sortOrder: i };
    await prisma.workout.create({ data: workout });
  }

  console.log(`Database seeded with ${workouts.length} workouts!`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
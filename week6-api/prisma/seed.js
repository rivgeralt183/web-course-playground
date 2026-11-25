const { PrismaClient } = require("../generated/prisma");
const prisma = new PrismaClient();

async function main() {
  const ali = await prisma.user.upsert({
    where: { email: "ali@example.com" },
    update: {},
    create: {
      name: "Ali Yılmaz",
      email: "ali@example.com",
    },
  });

  const ayse = await prisma.user.upsert({
    where: { email: "ayse@example.com" },
    update: {},
    create: {
      name: "Ayşe Demir",
      email: "ayse@example.com",
    },
  });

  const existingCount = await prisma.event.count();
  if (existingCount === 0) {
    await prisma.event.createMany({
      data: [
        {
          title: "Web Teknolojileri Semineri",
          date: new Date("2026-12-10T10:00:00.000Z"),
          organizerId: ali.id,
        },
        {
          title: "Veritabanı Atölyesi",
          date: new Date("2026-12-15T14:00:00.000Z"),
          organizerId: ayse.id,
        },
        {
          title: "Açık Etkinlik",
          date: new Date("2026-12-20T09:00:00.000Z"),
        },
      ],
    });
  }

  console.log("Seed tamamlandi:", { ali: ali.id, ayse: ayse.id });
}

main()
  .catch((err) => {
    console.error("Seed hatasi:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
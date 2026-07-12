import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import bcrypt from "bcryptjs";

async function main() {
  const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("No connection URL found in environment variables.");
  }

  const pool = new Pool({ connectionString });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  const email = "contact@skillistan.org";
  const password = "SkillistanVentures$$#";
  const passwordHash = await bcrypt.hash(password, 10);

  console.log(`Seeding super admin user: ${email}...`);

  await prisma.adminUser.upsert({
    where: { email },
    update: {
      name: "Super Admin",
      passwordHash,
    },
    create: {
      name: "Super Admin",
      email,
      passwordHash,
    },
  });

  console.log("Seeding complete. Admin user successfully upserted.");
  await pool.end();
}

main()
  .catch((e) => {
    console.error("Error during database seeding:", e);
    process.exit(1);
  });

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

  // 1. Seed Super Admin
  const adminEmail = "contact@skillistan.org";
  const adminPassword = "SkillistanVentures$$#";
  const passwordHash = await bcrypt.hash(adminPassword, 10);

  console.log(`Seeding super admin: ${adminEmail}...`);
  await prisma.adminUser.upsert({
    where: { email: adminEmail },
    update: {
      name: "Super Admin",
      passwordHash,
    },
    create: {
      name: "Super Admin",
      email: adminEmail,
      passwordHash,
    },
  });

  // 2. Seed Sample Team Members
  console.log("Seeding sample team members...");
  const teamMembers = [
    {
      name: "Essa Suleman",
      role: "Founder & Director",
      category: "leadership",
      bio: "Driving sustainable growth, vocational tech enablement, and youth leadership across Khyber Pakhtunkhwa.",
      imageUrl: null,
      linkedinUrl: "https://linkedin.com/in/essasuleman",
      order: 1,
    },
    {
      name: "Ayesha Khan",
      role: "Sustainability & Climate Lead",
      category: "leadership",
      bio: "Organizing local youth conferences and spearheading community campaign frameworks for climate awareness.",
      imageUrl: null,
      linkedinUrl: "https://linkedin.com/in/ayeshakhan",
      order: 2,
    },
    {
      name: "Hamza Shah",
      role: "Digital Literacy Trainer",
      category: "employee",
      bio: "Delivering practical freelancing courses and online safety bootcamps to students.",
      imageUrl: null,
      linkedinUrl: "https://linkedin.com/in/hamzashah",
      order: 3,
    },
    {
      name: "Zainab Bibi",
      role: "Community Coordinator",
      category: "employee",
      bio: "Facilitating volunteer drives and university campus outreach campaigns.",
      imageUrl: null,
      linkedinUrl: "https://linkedin.com/in/zainabbibi",
      order: 4,
    },
    {
      name: "Bilal Afridi",
      role: "Tech Operations Intern",
      category: "intern",
      bio: "Supporting digital infrastructure setups and workshops coordination.",
      imageUrl: null,
      linkedinUrl: "https://linkedin.com/in/bilalafridi",
      order: 5,
    },
  ];

  for (const member of teamMembers) {
    // Custom seed query: find by name + role to prevent duplicates
    const existing = await prisma.teamMember.findFirst({
      where: { name: member.name, role: member.role },
    });

    if (!existing) {
      await prisma.teamMember.create({
        data: member,
      });
      console.log(`Created team member: ${member.name} (${member.category})`);
    } else {
      await prisma.teamMember.update({
        where: { id: existing.id },
        data: member,
      });
      console.log(`Updated team member: ${member.name} (${member.category})`);
    }
  }

  console.log("Database seeding completed successfully.");
  await pool.end();
}

main()
  .catch((e) => {
    console.error("Error during database seeding:", e);
    process.exit(1);
  });

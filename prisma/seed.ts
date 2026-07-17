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

  // 3. Seed Sample Events
  console.log("Seeding sample events...");
  
  // Future date (30 days from now)
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + 30);
  
  // Past date (60 days ago)
  const pastDate = new Date();
  pastDate.setDate(pastDate.getDate() - 60);

  const futureDateString = futureDate.toISOString().split("T")[0];
  const pastDateString = pastDate.toISOString().split("T")[0];

  const sampleEvents = [
    {
      title: "Digital Freelancing Bootcamp",
      slug: `digital-freelancing-bootcamp-${futureDateString}`,
      description: "A comprehensive hands-on program covering graphic design, content writing, and Upwork/Fiverr profile optimization. Learn how to secure your first client and build a sustainable online career.",
      eventDate: futureDate,
      location: "Peshawar University IT Center",
      imageUrl: null,
      registrationEnabled: true,
      status: "published",
    },
    {
      title: "Youth Climate & Sustainability Conference",
      slug: `youth-climate-conference-${pastDateString}`,
      description: "Gathering youth advocates, climate experts, and policy makers to discuss local action plans, waste management, and renewable energy strategies in Khyber Pakhtunkhwa.",
      eventDate: pastDate,
      location: "KP Youth Assembly Hall, Peshawar",
      imageUrl: null,
      registrationEnabled: false,
      status: "published",
    },
    {
      title: "Advanced React & Next.js Workshop",
      slug: `advanced-react-nextjs-workshop-${futureDateString}`,
      description: "Dive deep into dynamic routing, Server Components, database connections, and hosting web applications. Perfect for CS students and developers looking to level up.",
      eventDate: futureDate,
      location: "Online (Zoom)",
      imageUrl: null,
      registrationEnabled: false,
      status: "published",
    },
  ];

  for (const event of sampleEvents) {
    const existing = await prisma.event.findUnique({
      where: { slug: event.slug },
    });

    if (!existing) {
      await prisma.event.create({
        data: event,
      });
      console.log(`Created sample event: ${event.title} (slug: ${event.slug})`);
    } else {
      await prisma.event.update({
        where: { id: existing.id },
        data: event,
      });
      console.log(`Updated sample event: ${event.title} (slug: ${event.slug})`);
    }
  }

  // 4. Seed Programs
  console.log("Seeding sample programs...");
  const samplePrograms = [
    {
      number: "01",
      title: "Youth Skills Development",
      description: "Practical, employment-focused training that helps young people move from classrooms into real work — communication, freelancing fundamentals, and professional readiness.",
    },
    {
      number: "02",
      title: "Digital Literacy",
      description: "Hands-on digital foundations for students and young professionals: online tools, digital safety, and the skills needed to participate in the modern economy.",
    },
    {
      number: "03",
      title: "Climate Action & Sustainability",
      description: "From LCOY conferences to community campaigns, we put young voices at the center of climate conversations in Khyber Pakhtunkhwa and beyond.",
    },
    {
      number: "04",
      title: "Youth Leadership",
      description: "Structured opportunities for young people to organize, speak, and lead — building the confidence and networks that turn participants into changemakers.",
    },
    {
      number: "05",
      title: "Workshops & Community Programs",
      description: "Short, focused sessions delivered with schools, universities, and partners — designed to be accessible, local, and immediately useful.",
    },
  ];

  for (const prog of samplePrograms) {
    const existing = await prisma.program.findFirst({
      where: { number: prog.number },
    });

    if (!existing) {
      await prisma.program.create({
        data: prog,
      });
      console.log(`Created sample program: ${prog.title} (${prog.number})`);
    } else {
      await prisma.program.update({
        where: { id: existing.id },
        data: prog,
      });
      console.log(`Updated sample program: ${prog.title} (${prog.number})`);
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

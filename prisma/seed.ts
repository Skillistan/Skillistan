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

  // 5. Seed Stories
  console.log("Seeding sample stories...");
  const sampleStories = [
    {
      title: "Skillistan recognized at LCOY Khyber Pakhtunkhwa",
      slug: "skillistan-recognized-at-lcoy-kp",
      excerpt: "Skillistan received formal recognition as a lead organizing partner at the Local Conference of Youth, a milestone for youth-led climate action in the region.",
      content: "At the Local Conference of Youth (LCOY) in Khyber Pakhtunkhwa, Skillistan was formally recognized for its exceptional contribution as a lead organizing partner. The award reflects months of coordination between volunteers, partner organizations, and local institutions.\n\nLCOY is a youth-driven event under the umbrella of YOUNGO, the official youth constituency of the UNFCCC. Bringing it to Peshawar meant creating a platform where young people from across the province could shape the climate conversation directly.\n\nFor our team, the recognition matters less than what it represents: proof that youth-led organizations in Pakistan can convene serious, credible platforms for climate action — and that young people will show up when given the chance.",
      featuredImageUrl: "/images/lcoy-certificate.jpg",
      status: "published",
      publishedAt: new Date("2024-08-05T00:00:00Z"),
    },
    {
      title: "A plant for every promise",
      slug: "a-plant-for-every-promise",
      excerpt: "Why we hand every speaker and partner a living plant instead of a plaque — a small ritual that captures how Skillistan thinks about growth.",
      content: "At Skillistan events, guests of honor rarely leave with a framed plaque. They leave with a potted plant. It began as a practical choice — a sustainable alternative to shields and trophies — but it has become one of our defining rituals.\n\nA plant asks something of you. It has to be watered, placed in the light, and given time. That is exactly how we think about skills development: not a certificate handed over in a single ceremony, but something living that the recipient has to keep growing.\n\nHundreds of plants later, the ritual has followed us to conferences, workshops, and campus sessions. Some of our partners now send us photos of their plants, years on. That, more than any award, is the impact we are after.",
      featuredImageUrl: "/images/plant-gift.jpg",
      status: "published",
      publishedAt: new Date("2024-09-12T00:00:00Z"),
    },
    {
      title: "Certificates, and what comes after",
      slug: "certificates-and-what-comes-after",
      excerpt: "Dozens of students completed our latest training cohort. Here is what the certificate ceremony looked like — and why the real work starts the day after.",
      content: "On the steps of our partner campus in Peshawar, dozens of students lined up with freshly printed certificates after completing a Skillistan training cohort. The photographs from that day are some of our favorites — but the ceremony is never the point.\n\nEvery cohort ends with a simple question: what will you do with this in the next ninety days? Participants leave with a concrete next step — a freelance profile to publish, a community session to lead, a project to start.\n\nFollow-ups with alumni tell us the model works. Graduates have gone on to lead their own campus societies, land first freelance clients, and return as volunteer trainers for the next cohort. The certificate is a beginning, not an ending.",
      featuredImageUrl: "/images/group-photo.jpg",
      status: "published",
      publishedAt: new Date("2024-10-20T00:00:00Z"),
    },
  ];

  for (const story of sampleStories) {
    const existing = await prisma.story.findUnique({
      where: { slug: story.slug },
    });

    if (!existing) {
      await prisma.story.create({
        data: story,
      });
      console.log(`Created sample story: ${story.title}`);
    } else {
      await prisma.story.update({
        where: { id: existing.id },
        data: story,
      });
      console.log(`Updated sample story: ${story.title}`);
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

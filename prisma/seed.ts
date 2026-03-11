import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Create admin user
  const adminPassword = await bcrypt.hash("admin123", 10);
  const admin = await prisma.user.upsert({
    where: { email: "admin@unistayconnect.com" },
    update: {},
    create: {
      email: "admin@unistayconnect.com",
      name: "Admin User",
      passwordHash: adminPassword,
      role: "admin",
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuABXn-hhzlAOWHIOaDAMyAJrOS0v1_oiAmB-3PBPHnVNM-wL6p5qLYzLaFoH0cxMPTB0wycDukrhZrCwJyxIDzh_gQMlsOvyb0gw1ubz8YniUD7tPELFihHBntMMybMjwcJKNh8X9Sm0Cn99xyQH97nGYhpcRB3xamL9mOFohXdBAYNzY4zlC1-sBSb1PNg9o80ITHOJmERuQ0HG36RAJvW4j8gbCaYKj4W6kIzhLAlGfAfs6m_Y-i4_jvEjw5hZcT1m0VPwrStwjM",
    },
  });

  // Create student users
  const studentPassword = await bcrypt.hash("student123", 10);
  const student1 = await prisma.user.upsert({
    where: { email: "student1@unistayconnect.com" },
    update: {},
    create: {
      email: "student1@unistayconnect.com",
      name: "Sarah Johnson",
      passwordHash: studentPassword,
      role: "student",
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuABXn-hhzlAOWHIOaDAMyAJrOS0v1_oiAmB-3PBPHnVNM-wL6p5qLYzLaFoH0cxMPTB0wycDukrhZrCwJyxIDzh_gQMlsOvyb0gw1ubz8YniUD7tPELFihHBntMMybMjwcJKNh8X9Sm0Cn99xyQH97nGYhpcRB3xamL9mOFohXdBAYNzY4zlC1-sBSb1PNg9o80ITHOJmERuQ0HG36RAJvW4j8gbCaYKj4W6kIzhLAlGfAfs6m_Y-i4_jvEjw5hZcT1m0VPwrStwjM",
    },
  });

  const student2 = await prisma.user.upsert({
    where: { email: "student2@unistayconnect.com" },
    update: {},
    create: {
      email: "student2@unistayconnect.com",
      name: "Ethan Carter",
      passwordHash: studentPassword,
      role: "student",
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDBdHn8t72u-7dVflrroHxFQqmE6xl6j3ur1Zb968tIn0PVnhPbkTR9DFAGMcG0G1CZNe5PSmKcrAebHXCmqMBsaenCBYSz8JjUPLDxDYXvG1wYs2v5VHpF_-Wu12qQkt9il1MmOVHFtvGVS0ihjkIYMr8tK-OMLToOie6_W0qsgts1HiVpsX65u2CHgUgUMcZTHHrRGjmL7uUq-Hag8foFyTfJ0ti_r7Qjj0qmelrswoJXmnfwq93KSmuL8IyJpIPM1hYvJZwuNRM",
    },
  });

  // Create landlord users
  const landlordPassword = await bcrypt.hash("landlord123", 10);
  const landlord1 = await prisma.user.upsert({
    where: { email: "landlord1@unistayconnect.com" },
    update: {},
    create: {
      email: "landlord1@unistayconnect.com",
      name: "John Smith",
      passwordHash: landlordPassword,
      role: "landlord",
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDxH2nwK0VUCOR1j5dzmX78u4PeViY4gRXhOVz_13L9HCmHabzn2rT17SyW5AnBaevG8rA8YtTzTEFzAIToTY8chiXy7Am_G_kazeO_l_xQKx7HTM_13i2-jXSIsaQfk43TS75YPvCUQeTo_FfSY3hxpd7TpnGgf42jr3iMN2oLKQYgAtm9YLHbWQG9dEENvtzS4j2cazfe14FX3hFoPde7jRaNH3ZAz6HBQuYP1Ld0L_PtE5XdVeJWlP2rkmFBXJU_zjsfNJfn3JI",
    },
  });

  // Create landlord records
  const landlordRecord1 = await prisma.propertyLandlord.upsert({
    where: { userId: landlord1.id },
    update: {},
    create: {
      userId: landlord1.id,
    },
  });

  // Create properties
  const property1 = await prisma.property.create({
    data: {
      title: "Cozy Studio Apartment Near Campus",
      description: "This charming studio apartment is perfect for students seeking a comfortable and convenient living space.",
      price: 1200,
      images: [
        "https://lh3.googleusercontent.com/aida-public/AB6AXuASfb--VFKOqc7VLvtH2LbhHJWz7lkBIVID15W_XIqNK0bl1uBTh7dP_VSosTZwXv2z0D2beXW2g_yYVmwdEP2FQq-Szp72t_aqXJpjQKoIdCabFM_U2MUUuTb8AENtDUClnHGPU9RQURcblfhZxSMbDD-zmo6lj6n1hfaRWZdi7Nxs6UY1EUnJidEckqjbXHBwuUJnMD5B4JGKWROEn4nVTJ8IYvR5PKs0DmJ8tcl2mUnFJUqRq86GEXK2KhlK7wvKiX6WsErEGJM",
      ],
      address: "123 University Avenue, Studentville, CA",
      amenities: ["Wi-Fi", "Kitchenette", "Smart TV", "Bed", "Study Desk"],
      type: "studio",
      status: "available",
      landlordId: landlordRecord1.id,
    },
  });

  const property2 = await prisma.property.create({
    data: {
      title: "Shared Student House",
      description: "Affordable shared accommodation perfect for students.",
      price: 500,
      images: [
        "https://lh3.googleusercontent.com/aida-public/AB6AXuCsey42gJMS_H-bSdI2xirjsSUHDP7dw0VYUnGVoaO0ZWkmbbf-anwMvAEoHqmys03qUDlACzmYCjY3Uha9EhQd1XhTHrpOEBlmk3bQS9-dwEIm7BPTeeAVV194lE5zGxOGKcKKY__dujjzWgGOnyNAFDsWHIIPAE4GRaTqkrymoxN-GQ932VALgb3ojN0A16yimWzxXqT66RBwgb4l5XaN71oqtW-7hEv9A0wnx20fbsReDcQSf6O0Oxv5OTRh0yQo1akbvXimgEU",
      ],
      address: "456 Oak Avenue, Anytown, USA",
      amenities: ["Wi-Fi", "Shared Kitchen", "Laundry"],
      type: "shared",
      status: "available",
      landlordId: landlordRecord1.id,
    },
  });

  // Create some bookings
  const booking1 = await prisma.booking.create({
    data: {
      studentId: student1.id,
      propertyId: property1.id,
      startDate: new Date("2024-09-01"),
      endDate: new Date("2024-12-31"),
      status: "pending",
    },
  });

  // Create some messages
  await prisma.message.create({
    data: {
      senderId: student1.id,
      receiverId: landlord1.id,
      content: "Hi, I'm interested in your property. Is it still available?",
    },
  });

  await prisma.message.create({
    data: {
      senderId: landlord1.id,
      receiverId: student1.id,
      content: "Yes, it's still available! Would you like to schedule a viewing?",
    },
  });

  console.log("Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });


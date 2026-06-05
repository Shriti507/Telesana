require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Add sample doctors
  const doctors = await Promise.all([
    prisma.doctor.create({
      data: {
        doctor_name: 'Sarah Smith',
        specialisation: 'Cardiology',
        qualification: 'MD, FACC',
        experience: 15,
        fees: 500.00
      }
    }),
    prisma.doctor.create({
      data: {
        doctor_name: 'John Doe',
        specialisation: 'General Physician',
        qualification: 'MBBS, MD',
        experience: 10,
        fees: 300.00
      }
    }),
    prisma.doctor.create({
      data: {
        doctor_name: 'Emily Chen',
        specialisation: 'Dermatology',
        qualification: 'MD, Dermatology',
        experience: 8,
        fees: 400.00
      }
    }),
    prisma.doctor.create({
      data: {
        doctor_name: 'Michael Brown',
        specialisation: 'Orthopedics',
        qualification: 'MS, Orthopedics',
        experience: 12,
        fees: 600.00
      }
    }),
    prisma.doctor.create({
      data: {
        doctor_name: 'Lisa Johnson',
        specialisation: 'Pediatrics',
        qualification: 'MD, Pediatrics',
        experience: 9,
        fees: 350.00
      }
    })
  ]);

  console.log(`Created ${doctors.length} doctors`);
  console.log('Seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

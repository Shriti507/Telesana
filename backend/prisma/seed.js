require('dotenv').config();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const doctors = [
    
        // ---------------- Cardiology ----------------
        {
          doctor_name: "Dr. Arnav Mehta",
          specialisation: "Cardiology",
          qualification: "MBBS, MD (Cardiology)",
          experience: 14,
          fees: 700.00
        },
        {
          doctor_name: "Dr. Shalini Rao",
          specialisation: "Cardiology",
          qualification: "MBBS, DM (Cardiology)",
          experience: 16,
          fees: 900.00
        },
        {
          doctor_name: "Dr. Kiran Sharma",
          specialisation: "Cardiology",
          qualification: "MBBS, MD (Internal Medicine)",
          experience: 11,
          fees: 650.00
        },
        {
          doctor_name: "Dr. Vivek Deshmukh",
          specialisation: "Cardiology",
          qualification: "MBBS, DM (Interventional Cardiology)",
          experience: 12,
          fees: 950.00
        },
      
        // ---------------- Dermatology ----------------
        {
          doctor_name: "Dr. Neha Kapoor",
          specialisation: "Dermatology",
          qualification: "MBBS, MD (Dermatology)",
          experience: 8,
          fees: 500.00
        },
        {
          doctor_name: "Dr. Rohan Sethi",
          specialisation: "Dermatology",
          qualification: "MBBS, DDVL",
          experience: 6,
          fees: 450.00
        },
        {
          doctor_name: "Dr. Shreya Iyer",
          specialisation: "Cosmetic Dermatology",
          qualification: "MBBS, MD (Dermatology)",
          experience: 7,
          fees: 550.00
        },
        {
          doctor_name: "Dr. Aditi Kulkarni",
          specialisation: "Dermatology",
          qualification: "MBBS, MD (Dermatology)",
          experience: 10,
          fees: 600.00
        },
      
        // ---------------- Neurology ----------------
        {
          doctor_name: "Dr. Imran Ali",
          specialisation: "Neurology",
          qualification: "MBBS, DM (Neurology)",
          experience: 14,
          fees: 1000.00
        },
        {
          doctor_name: "Dr. Tanvi Nair",
          specialisation: "Neurology",
          qualification: "MBBS, MD, DM (Neurology)",
          experience: 9,
          fees: 850.00
        },
        {
          doctor_name: "Dr. Soumitra Sen",
          specialisation: "Neuro Physician",
          qualification: "MBBS, MD (Internal Medicine)",
          experience: 11,
          fees: 750.00
        },
        {
          doctor_name: "Dr. Radhika Prasad",
          specialisation: "Neurology",
          qualification: "MBBS, DM (Neurology)",
          experience: 13,
          fees: 950.00
        },
      
        // ---------------- Pediatrics ----------------
        {
          doctor_name: "Dr. Ankita Ahuja",
          specialisation: "Pediatrics",
          qualification: "MBBS, MD (Pediatrics)",
          experience: 7,
          fees: 500.00
        },
        {
          doctor_name: "Dr. Rajeev Kulkarni",
          specialisation: "Pediatrics",
          qualification: "MBBS, DCH",
          experience: 10,
          fees: 600.00
        },
        {
          doctor_name: "Dr. Maya Verma",
          specialisation: "Neonatology",
          qualification: "MBBS, MD (Pediatrics)",
          experience: 8,
          fees: 650.00
        },
        {
          doctor_name: "Dr. Harshit Agarwal",
          specialisation: "Pediatrics",
          qualification: "MBBS, MD (Pediatrics)",
          experience: 12,
          fees: 700.00
        },
      
        // ---------------- Orthopedics ----------------
        {
          doctor_name: "Dr. Nitin Agarwal",
          specialisation: "Orthopedics",
          qualification: "MBBS, MS (Orthopedics)",
          experience: 13,
          fees: 700.00
        },
        {
          doctor_name: "Dr. Smita Reddy",
          specialisation: "Sports Orthopedics",
          qualification: "MBBS, MS (Orthopedics)",
          experience: 9,
          fees: 650.00
        },
        {
          doctor_name: "Dr. Deepak Chauhan",
          specialisation: "Spine Specialist",
          qualification: "MBBS, MS (Orthopedics)",
          experience: 11,
          fees: 800.00
        },
        {
          doctor_name: "Dr. Abhay Mankar",
          specialisation: "Orthopedics",
          qualification: "MBBS, DNB (Orthopedics)",
          experience: 10,
          fees: 750.00
        },
      
        // ---------------- General Medicine ----------------
        {
          doctor_name: "Dr. Kavita Bajaj",
          specialisation: "General Medicine",
          qualification: "MBBS, MD (Medicine)",
          experience: 10,
          fees: 400.00
        },
        {
          doctor_name: "Dr. Vivek Anand",
          specialisation: "Internal Medicine",
          qualification: "MBBS, MD (Medicine)",
          experience: 12,
          fees: 500.00
        },
        {
          doctor_name: "Dr. Suman Rathore",
          specialisation: "General Physician",
          qualification: "MBBS",
          experience: 8,
          fees: 350.00
        },
        {
          doctor_name: "Dr. Preeti Menon",
          specialisation: "General Medicine",
          qualification: "MBBS, MD (General Medicine)",
          experience: 9,
          fees: 450.00
        }
      
      
];

async function main() {
  const cleanDoctors = doctors.map(doc => ({
    ...doc,
    doctor_name: doc.doctor_name.replace(/^Dr\.\s+/, "")
  }));

  await prisma.doctor.createMany({
    data: cleanDoctors,
  });

  console.log("Doctors seeded successfully!");
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });

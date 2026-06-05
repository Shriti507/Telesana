const prisma = require("../utils/prisma.js");

const bookAppointment = async (data) => {
  const {
    userId,
    doctorId,
    appointmentTime,
    mode
  } = data;


  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { patient: true }
  });

  if (!user || !user.patient) {
    throw new Error("Patient profile not found for this user.");
  }

  const patientId = user.patient.id;

  return prisma.appointment.create({
    data: {
      patientId,
      doctorId,
      appointmentTime: new Date(appointmentTime),
      mode,
      status: "SCHEDULED"
    },
    include: {
      patient: true,
      doctor: true
    }
  });
};

const getAppointmentsForUser = async (userId) => {
  
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { patient: true }
  });

  if (!user || !user.patient) return [];

  const patientId = user.patient.id;

  return prisma.appointment.findMany({
    where: { patientId },
    include: { patient: true, doctor: true },
    orderBy: { appointmentTime: "asc" }
  });
};

module.exports = {
  bookAppointment,
  getAppointmentsForUser
};
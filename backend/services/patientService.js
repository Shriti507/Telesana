const prisma = require("../utils/prisma.js");

const findPatientByUserId = async (userId) => {
  return prisma.patient.findUnique({
    where: { userId },
    include: {
      user: { select: { id: true, username: true, email: true } },
    },
  });
};

const createPatient = async ({
  userId,
  fullName,
  phone,
  gender,
  dob,
  height,
  weight,
  bloodGroup,
}) => {
  return prisma.patient.create({
    data: {
      userId,
      fullName,
      phone: phone || null,
      gender, // must match Prisma enum
      dob: dob ? new Date(dob) : null,
      height: height != null ? Number(height) : null,
      weight: weight != null ? Number(weight) : null,
      bloodGroup: bloodGroup || null,
    },
    include: { user: { select: { id: true, username: true, email: true } } },
  });
};

const updatePatient = async (userId, fieldsToUpdate) => {
  const data = { ...fieldsToUpdate };

  // Convert fields safely
  if ("dob" in data && data.dob) data.dob = new Date(data.dob);
  if ("height" in data && data.height != null) data.height = Number(data.height);
  if ("weight" in data && data.weight != null) data.weight = Number(data.weight);

  // Ensure optional fields are null if empty
  if ("phone" in data && !data.phone) data.phone = null;
  if ("bloodGroup" in data && !data.bloodGroup) data.bloodGroup = null;

  return prisma.patient.update({
    where: { userId },
    data,
    include: { user: { select: { id: true, username: true, email: true } } },
  });
};

module.exports = {
  findPatientByUserId,
  createPatient,
  updatePatient,
};

const prisma = require("../utils/prisma.js");

const getDoctors = async () => {
  return prisma.doctor.findMany();
};

module.exports = {
  getDoctors,
};

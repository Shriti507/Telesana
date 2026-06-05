const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const cookieParser = require('cookie-parser')

const authRoutes = require('./routes/authRoutes.js')
const doctorRoutes = require('./routes/doctorRoutes.js')
const patientRoutes = require('./routes/patientRoutes.js')
const appointmentRoutes = require('./routes/appointmentRoutes.js')
const healthRoutes = require('./routes/healthRoutes.js')

dotenv.config()
const app = express()

// Allowed origins: production Vercel URL + local dev URLs
const ALLOWED_ORIGINS = [
  process.env.FRONTEND_URL,         
  "http://localhost:3000",           // Next.js local dev
  "http://localhost:4000",           // in case of same-port local testing
].filter(Boolean); // remove undefined if FRONTEND_URL is not set

app.use(cors({
  origin: (incomingOrigin, callback) => {
    // Allow requests with no origin (e.g. curl, Postman, server-to-server)
    if (!incomingOrigin) return callback(null, true);

    if (ALLOWED_ORIGINS.includes(incomingOrigin)) {
      return callback(null, true);
    }

    console.warn(`[CORS] Blocked request from origin: ${incomingOrigin}`);
    return callback(new Error(`CORS: origin ${incomingOrigin} not allowed`));
  },
  credentials: true, // required for cookies (sameSite: "none")
}));

app.use(express.json())
app.use(cookieParser())

app.get("/api/healthcheck", (req, res) => {
    res.status(200).json({ status: "OK", message: "Health check passed" });
});

app.use('/api/auth', authRoutes)
app.use('/api/doctor', doctorRoutes)
app.use('/api/patient', patientRoutes)
app.use('/api/health', healthRoutes)
app.use('/api/doctors', doctorRoutes)
app.use('/api/appointment', appointmentRoutes)
app.use('/api/appointments', appointmentRoutes)

app.get("/", (req, res) => {
    res.send("Telesana backend running")
})

const PORT = process.env.PORT || 4000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
  console.log(`Environment : ${process.env.NODE_ENV || "development (NODE_ENV not set)"}`)
  console.log(`Cookie mode : ${process.env.NODE_ENV === "production" ? "sameSite=None + Secure (production)" : "sameSite=Lax (local dev)"}`)
  console.log(`Allowed CORS origins: ${ALLOWED_ORIGINS.join(", ")}`)
})

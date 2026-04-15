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

app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
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
app.listen(PORT, ()=> console.log(`Server running on ${PORT}`))

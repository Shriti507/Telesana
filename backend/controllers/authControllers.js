const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
// const {PrismaClient} = require('@prisma/client')
// const prisma = new PrismaClient()
const prisma =require('../utils/prisma.js')
const TOKEN_EXPIRY = '7d'
const COOKIE_MAX_AGE = 7 * 24 * 60 * 60 * 1000

const IS_PRODUCTION = process.env.NODE_ENV === "production";

function setAuthCookie(res, token) {
    // sameSite: "none" is required for cross-origin cookie (Vercel frontend → Render backend)
    // secure: true is mandatory when sameSite: "none" — only in production (HTTPS)
    // In local dev (http://localhost) we use sameSite: "lax" so the browser stores the cookie
    res.cookie("token", token, {
        httpOnly: true,
        secure: IS_PRODUCTION,
        sameSite: IS_PRODUCTION ? "none" : "lax",
        maxAge: COOKIE_MAX_AGE
    })
}

function isValidEmail(email = '') {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

async function signup(req, res) {
    const username = (req.body.username || "").trim()
    const email = (req.body.email || "").trim().toLowerCase()
    const password = req.body.password || ""

    if (!username || username.length < 2) {
        return res.status(400).json({ message: "Username must be at least 2 characters long" })
    }

    if (!isValidEmail(email)) {
        return res.status(400).json({ message: "Please provide a valid email address" })
    }

    if (password.length < 8) {
        return res.status(400).json({ message: "Password must be at least 8 characters long" })
    }

    try{
        const existingUser = await prisma.user.findUnique({where: {email}})

        if (existingUser){
            return res.status(400).json({message: "Email already registered"})
        }

        const hashedPassword = await bcrypt.hash(password, 10)
        const newUser = await prisma.user.create({
            data: {username, email, password: hashedPassword}
        })
        const token=jwt.sign({id:newUser.id},process.env.JWT_SECRET,{expiresIn:TOKEN_EXPIRY})
        setAuthCookie(res, token)
        return res.status(201).json({message: "Registration successful", token, user: {id: newUser.id, username: newUser.username, email: newUser.email}})

    } catch(error){
        console.error("Signup error:", error)
        if (error.code === "P2002") {
            return res.status(400).json({ message: "Email or username already exists" })
        }
        return res.status(500).json({message: "Signup failed due to a server error"})
    }
}

async function login(req, res) {
    const email = (req.body.email || "").trim().toLowerCase()
    const password = req.body.password || ""

    if (!isValidEmail(email)) {
        return res.status(400).json({ message: "Please provide a valid email address" })
    }

    if (!password) {
        return res.status(400).json({ message: "Password is required" })
    }
    
    try{
        const existingUser = await prisma.user.findUnique({where: {email}})
        if (!existingUser){
            return res.status(400).json({message: "User not found"})
        } 

        const bool = await bcrypt.compare(password, existingUser.password)
        if (!bool){
            return res.status(400).json({message: "Invalid credentials"})
        } 

        const token = jwt.sign({id: existingUser.id}, process.env.JWT_SECRET, {expiresIn: TOKEN_EXPIRY})
        setAuthCookie(res, token)
        return res.status(200).json({message: "Login successful", token, user: {id: existingUser.id, username: existingUser.username, email: existingUser.email}})

    } catch(error){
        console.error(error)
        return res.status(500).json({error: "Something went wrong"})
    }
    
} 

async function me(req, res) {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user.id },
            select: { id: true, username: true, email: true }
        })

        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }

        return res.status(200).json({ user })
    } catch (error) {
        console.error("Failed to load current user:", error)
        return res.status(500).json({ message: "Failed to load current user" })
    }
}

function logout(req, res) {
    // Must match the same attributes used when setting the cookie
    res.clearCookie("token", {
        httpOnly: true,
        secure: IS_PRODUCTION,
        sameSite: IS_PRODUCTION ? "none" : "lax"
    })
    return res.status(200).json({ message: "Logged out successfully" })
}

module.exports = {signup, login, me, logout}
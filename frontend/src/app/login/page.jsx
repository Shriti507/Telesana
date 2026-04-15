"use client";
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import "./LoginPage.css";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { isAuthenticated } from "../../lib/auth";
const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API || "http://localhost:4000";

const LoginPage = () => {
    const router = useRouter();
    const [user, setUser] = useState({ email: "", password: "" });
    const [agree, setAgree] = useState(false);
    const [loading, setLoading] = useState(false);

    React.useEffect(() => {
        let mounted = true;
        const checkAuth = async () => {
            const authenticated = await isAuthenticated();
            if (mounted && authenticated) {
                router.replace('/dashboard');
            }
        };
        checkAuth();
        return () => {
            mounted = false;
        };
    }, [router]);

    const onLogin = async (e) => {
        e.preventDefault();
        const email = user.email.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (!email || !user.password) {
            toast.error("Please Enter Email and Password");
            return;
        }
        if (!emailRegex.test(email)) {
            toast.error("Enter a Valid email or Mobile");
            return;
        }
        if (!agree) {
            toast.error("Please agree to terms");
            return;
        }
        try {
            setLoading(true);
            const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify(user)
            });
            const data = await response.json().catch(() => ({}));
            if (response.ok) {
                toast.success("Login Successfully");
                router.push('/dashboard');
            } else {
                toast.error(data.message || data.error || `Login Failed (${response.status})`);
            }
        } catch (err) {
            toast.error(err.message || "Something went wrong");
            console.log("Login request failed:", err);
        } finally {
            setLoading(false);
        }
    };
   

    return (
        <div className='login-container'>
            <div className='login-box'>
                <h1>Login</h1>
                <form onSubmit={onLogin}>
                    <label className='label' htmlFor='email'>Email ID</label>
                    <input
                        className="input"
                        type="text"
                        name="email"
                        value={user.email}
                        placeholder='Enter your email'
                        id="email"
                        onChange={(e) => setUser({ ...user, email: e.target.value })}
                        disabled={loading}
                    />
                    <label className='label' htmlFor='password'>Password</label>
                    <input
                        className='input'
                        type="password"
                        name="password"
                        placeholder='Enter your password'
                        id="password"
                        onChange={(e) => setUser({ ...user, password: e.target.value })}
                        disabled={loading}
                    />
                    <FormControlLabel
                        sx={{ color: "grey" }}
                        control={<Checkbox checked={agree} onChange={(e) => setAgree(e.target.checked)} disabled={loading} />}
                        label="Remember Me For 30 days"
                    />
                    <button className="button" type='submit' disabled={loading}>{loading ? "Logging in..." : "Login"}</button>
                </form>
                
            
                <div style={{ marginTop: "20px", textAlign: "center", color: "#555" }}>
                    <p>Don't have an account? <Link href="/signup" style={{ color: "#678bee", fontWeight: "bold" }}>Sign Up</Link></p>
                </div>
            </div>
            <div className='image-container'>
                <img className='image' src="./img.png" alt="Login Illustration" />
            </div>
        </div>
    );
};

export default LoginPage;
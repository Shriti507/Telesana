"use client"
import React,{useState} from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import "./SignupPage.css"
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { isAuthenticated } from "../../lib/auth"
import { setFrontendAuthCookie } from "../../lib/cookies";
const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API || "http://localhost:4000";
const SignupPage = () => {
    const router = useRouter()
    const [user,setUser]=useState({email:"",password:"",username:""})
    const [agree,setAgree]=useState(false)
    const [loading,setLoading]=useState(false)
    React.useEffect(() => {
        let mounted = true
        const checkAuth = async () => {
            const authenticated = await isAuthenticated()
            if (mounted && authenticated) {
                router.replace('/dashboard')
            }
        }
        checkAuth()
        return () => {
            mounted = false
        }
    }, [router])

    const onSignup=async(e)=>{
        e.preventDefault()
        const email=user.email.trim()
        const username=user.username.trim()
        const password=user.password.trim()
        const emailRegex=/^[^\s@]+@[^\s@]+\.[^\s@]+$/
        // const mobileRegex=/^[0-9]{10}$/
        if(!email || !username || !password){
            toast.error("Please fill all the fields")
            return
        }
        if(password.length < 8){
            toast.error("Password must be at least 8 characters long")
            return
        }
        if(!emailRegex.test(email)){
            toast.error("Enter a Valid email")
            return 
        }
        if(!agree){
            toast.error("Please agree to terms")
            return
        }
        try{
            setLoading(true)
            const response=await fetch(`${API_BASE_URL}/api/auth/signup`,{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            credentials: "include",
            body:JSON.stringify({email,username,password})
        })
        const data=await response.json().catch(() => ({}))

        if(response.ok){
            // Set cookie on frontend domain so Next.js middleware can read it
            // (middleware runs on Vercel edge and can't see the backend's httpOnly cookie)
            if (data.token) setFrontendAuthCookie(data.token)
            toast.success("User Created Successfully")
            router.push('/dashboard')
        }else{
            toast.error(data.message || data.error || `SignUp Failed (${response.status})`)
        }
    }
    catch(err){
        toast.error(err.message || "Something went wrong")
        console.log("Signup request failed:", err)
    } finally {
        setLoading(false)
    }  
}   

  return (
    <div className='login-container'>
        <div className='login-box'>
        <h1>Signup</h1>
        <form onSubmit={onSignup}>
        <label className='label' htmlFor='username'>Full Name</label>
        <input className={"input"} type="text" placeholder='Enter your full name' name="username" id="username" value={user.username} onChange={(e)=>setUser({...user,username:e.target.value})} />
        <label className='label' htmlFor='email' >Email</label>
        <input className={"input"} type="text" placeholder="Enter your email" name="email" id="email" value={user.email} onChange={(e)=>setUser({...user,email:e.target.value})} />
        <label className='label' htmlFor='password'>Enter Password</label>
        <input className={"input"} type="password"  placeholder="Create a password" name="password" value={user.password} id="password" onChange={(e)=>setUser({...user,password:e.target.value})} disabled={loading} />
                <FormControlLabel
        sx={{color:"grey"}}
        control={<Checkbox checked={agree} onChange={(e)=>setAgree(e.target.checked)} disabled={loading} />}
        label="I agree to terms"
        />
        <button className='button' type='submit' disabled={loading}>{loading ? "Signing up..." : "Signup"}</button>
        </form>
        <Link href="/login" className='login'>Already have an account? Login</Link>
        </div>
        <div className='image-container'>
            <img className='image' src="./img.png" alt="Signup Illustration"/>
        </div>
    </div>
  )
}

export default SignupPage;
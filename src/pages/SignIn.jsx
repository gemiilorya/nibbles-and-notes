import Logo from '../components/Logo'
import { NavLink, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseclient'
import { useState } from 'react'

export default function SignIn() {
    const navigate = useNavigate()
    const [setEmail] = useState('')
    const [setPassword] = useState('')
    const [emailError, setEmailError] = useState('')
    const [passwordError, setPasswordError] = useState('')
    const [generalError, setGeneralError] = useState('')

        const handleSignIn = async () => {
    setEmailError('')
    setPasswordError('')
    setGeneralError('')

    const emailValue = document.getElementById('email-input').value
    const passwordValue = document.getElementById('password-input').value

    console.log('email:', emailValue, 'password:', passwordValue)

    if (!emailValue) return setEmailError('Email is required')
    if (!emailValue.includes('@')) return setEmailError('Please enter a valid email address')
    if (!passwordValue) return setPasswordError('Password is required')
    if (passwordValue.length < 6) return setPasswordError('Password must be at least 6 characters long')

    const { error } = await supabase.auth.signInWithPassword({
        email: emailValue,
        password: passwordValue,
    })

    if (error) {
        if (error.message.includes('Invalid login credentials')) {
        setPasswordError('Email or password is incorrect')
        } else if (error.message.includes('Too many requests')) {
        setGeneralError('Too many attempts, please try again later')
        } else {
        setGeneralError(error.message)
        }
        return
    }

    navigate('/discover')
    }

    return (
        <div className="min-h-screen">
        <Logo/>
        <div className="flex justify-between items-center px-4">
            <NavLink to="/signin" className={({ isActive }) => isActive ? "text-[#D3D3D3] pointer-events-none" : "text-white"}>Login</NavLink>
            <NavLink to="/signup" className={({ isActive }) => isActive ? "text-[#D3D3D3] pointer-events-none" : "text-white"}>Create</NavLink>
        </div>
        <div className="border border-white rounded-lg p-4 mt-6">
            <h2 className="text-white text-center font-bold text-[20px] mt-4">Sign In</h2>
            {generalError && <p className="text-red-500 text-center mt-2">{generalError}</p>}
            <div className="border border-white rounded-lg p-4 mx-4 mt-6">
            <label className="text-white text-[16px] font-open-sans font-bold">Email:</label>
            <input
                id='email-input'
                type="text"
                placeholder="Enter your Email"
                onChange={(e) => {
                    console.log('email changed to:', e.target.value)
                    setEmail(e.target.value)}}
                className="w-full bg-transparent border-white border-b text-white outline-none ring-0 focus:outline-none focus:ring-0 placeholder:text-opacity-50 mt-2.5 font-normal"
            />
            {emailError && <p className="text-red-500 mt-2">{emailError}</p>}
            </div>
            <div className="border border-white rounded-lg p-4 mx-4 mt-6">
            <label className="text-white text-[16px] font-open-sans font-bold">Password:</label>
            <input
                id='password-input'
                type="password"
                placeholder="Enter your password"
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-transparent border-white border-b text-white outline-none ring-0 focus:outline-none focus:ring-0 placeholder:text-opacity-50 mt-2.5 font-normal"
            />
            {passwordError && <p className="text-red-400 text-sm mt-1">{passwordError}</p>}
            </div>
        </div>
        <button onClick={handleSignIn} className="bg-white text-black text-center font-open-sans py-3.75 px-22.5 rounded-full mt-12.5 block mx-auto hover:scale-120 transition-transform">Login</button>
        </div>
    )
    }
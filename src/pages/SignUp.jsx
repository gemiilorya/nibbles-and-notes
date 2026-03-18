import Logo from '../components/Logo'
import { NavLink, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseclient'
import { useState } from 'react'

export default function SignUp() {
    const navigate = useNavigate()

    const [usernameError, setUsernameError] = useState('')
    const [emailError, setEmailError] = useState('')
    const [passwordError, setPasswordError] = useState('')
    const [generalError, setGeneralError] = useState('')

    const handleSignUp = async () => {
        setUsernameError('')
        setEmailError('')
        setPasswordError('')
        setGeneralError('')

    const usernameValue = document.getElementById('username-input').value
    const emailValue = document.getElementById('email-input').value
    const passwordValue = document.getElementById('password-input').value

    // validation
    if (!usernameValue) return setUsernameError('Username is required')
    if (usernameValue.length < 3) return setUsernameError('Username must be at least 3 characters')
    if (!emailValue) return setEmailError('Email is required')
    if (!emailValue.includes('@')) return setEmailError('Please enter a valid email address')
    if (!passwordValue) return setPasswordError('Password is required')
    if (passwordValue.length < 6) return setPasswordError('Password must be at least 6 characters long')

    // check if username already exists
    const { data: existingUser } = await supabase
        .from('profiles')
        .select('username')
        .eq('username', usernameValue)
        .single()

    if (existingUser) return setUsernameError('Username is already taken')

    // sign up
    const { data, error } = await supabase.auth.signUp({
        email: emailValue,
        password: passwordValue,
    })

    if (error) {
        if (error.message.includes('already registered')) {
        setEmailError('An account with this email already exists')
        } else if (error.message.includes('Password should be')) {
            setPasswordError('Password must be at least 6 characters long')
        } else {
        setGeneralError(error.message)
        }
        return
    }

    // store username in profiles table
    const { error: profileError } = await supabase
        .from('profiles')
        .insert({ id: data.user.id, username: usernameValue, email: emailValue })

    if (profileError) {
        setGeneralError(profileError.message)
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
        <h2 className="text-white text-center font-bold text-[20px] mt-4">Sign Up</h2>
        {generalError && <p className="text-red-500 text-center mt-2">{generalError}</p>}
        <div className="border border-white rounded-lg p-4 mx-4 mt-6">
            <label className="text-white text-[16px] font-open-sans font-bold">Username:</label>
            <input
            id="username-input"
            type="text"
            placeholder="Enter your username"
            className="w-full bg-transparent border-white border-b text-white outline-none ring-0 focus:outline-none focus:ring-0 placeholder:text-opacity-50 mt-[10px] font-normal"
            />
            {usernameError && <p className="text-red-500 mt-2">{usernameError}</p>}
        </div>
        <div className="border border-white rounded-lg p-4 mx-4 mt-6">
            <label className="text-white text-[16px] font-open-sans font-bold">Email Address:</label>
            <input
            id="email-input"
            type="text"
            placeholder="Enter your email address"
            className="w-full bg-transparent border-white border-b text-white outline-none ring-0 focus:outline-none focus:ring-0 placeholder:text-opacity-50 mt-[10px] font-normal"
            />
            {emailError && <p className="text-red-500 mt-2">{emailError}</p>}
        </div>
        <div className="border border-white rounded-lg p-4 mx-4 mt-6">
            <label className="text-white text-[16px] font-open-sans font-bold">Password:</label>
            <input
            id="password-input"
            type="password"
            placeholder="Enter your password"
            className="w-full bg-transparent border-white border-b text-white outline-none ring-0 focus:outline-none focus:ring-0 placeholder:text-opacity-50 mt-[10px] font-normal"
            />
            {passwordError && <p className="text-red-500 mt-2">{passwordError}</p>}
        </div>
        </div>
        <button onClick={handleSignUp}
        className="bg-white text-black text-center font-open-sans py-3.75 px-[50px] rounded-full mt-[50px] block mx-auto hover:scale-120 transition-transform">
        Create Account
        </button>
    </div>
    )
}
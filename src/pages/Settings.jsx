import Logo from "../components/Logo";
import { useNavigate } from "react-router-dom";
import { ArrowLeftIcon, CaretUpIcon, CaretDownIcon } from "@phosphor-icons/react";
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseclient";

export default function Settings() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null)
    const [newUsername, setNewUsername] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [openUsername, setOpenUsername] = useState(false)
    const [openPassword, setOpenPassword] = useState(false)
    const [toast, setToast] = useState('')

    useEffect(() => {
        const fetchUser = async () => {
        const { data: { user } } = await supabase.auth.getUser()
        setUser(user)
        const { data } = await supabase
            .from('profiles')
            .select('username')
            .eq('id', user.id)
            .single()
        setNewUsername(data.username)
        }
        fetchUser()
    }, [])

    const showToast = (message) => {
        setToast(message)
        setTimeout(() => setToast(''), 3000)
    }

    const handleUpdateUsername = async () => {
        const { data: { user } } = await supabase.auth.getUser()
        const { error } = await supabase
        .from('profiles')
        .update({ username: newUsername })
        .eq('id', user.id)
        if (error) return console.log(error.message)
        showToast('Username updated successfully')
        setOpenUsername(false)
    }

    const handleChangePassword = async () => {
        const { error } = await supabase.auth.updateUser({ password: newPassword })
        if (error) return console.log(error.message)
        showToast('Password updated successfully')
        setOpenPassword(false)
    }

    const handleLogout = async () => {
        await supabase.auth.signOut()
        navigate('/')
    }

    const handleDeleteAccount = async () => {
        await supabase.from('recipes').delete().eq('user_id', user.id)
        await supabase.from('profiles').delete().eq('id', user.id)
        await supabase.auth.signOut()
        showToast('Account successfully deleted')
        setTimeout(() => navigate('/'), 2000)
    }

    return (
        <div className="min-h-screen">
        <Logo />
        <div className="w-full max-w-[500px] mx-auto px-4">
            <div className="flex justify-between items-center mt-4">
            <h1 className="text-2xl md:text-3xl font-bold">Settings</h1>
            <button onClick={() => navigate(-1)} className="text-white p-2 rounded-full">
                <ArrowLeftIcon size={24} />
            </button>
            </div>

            <hr className="border-white/30 my-4" />

            <div className="flex flex-col gap-2">

            {/* change username */}
            <button onClick={() => setOpenUsername(!openUsername)}
                className="w-full flex justify-between items-center py-3">
                <span className="text-[16px] md:text-[18px]">Change Username</span>
                {openUsername ? <CaretUpIcon size={24} /> : <CaretDownIcon size={24} />}
            </button>
            {openUsername && (
                <div className="flex flex-col gap-2 pb-4">
                <input
                    type="text"
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    className="w-full bg-transparent border-b border-white text-white outline-none text-[16px] py-2"
                />
                <button onClick={handleUpdateUsername}
                    className="bg-white text-black py-2 px-6 rounded-full mt-2 w-fit">
                    Save
                </button>
                </div>
            )}

            <hr className="border-white/30" />

            {/* change password */}
            <button onClick={() => setOpenPassword(!openPassword)}
                className="w-full flex justify-between items-center py-3">
                <span className="text-[16px] md:text-[18px]">Change Password</span>
                {openPassword ? <CaretUpIcon size={24} /> : <CaretDownIcon size={24} />}
            </button>
            {openPassword && (
                <div className="flex flex-col gap-2 pb-4">
                <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full bg-transparent border-b border-white text-white outline-none text-[16px] py-2"
                />
                <button onClick={handleChangePassword}
                    className="bg-white text-black py-2 px-6 rounded-full mt-2 w-fit">
                    Save
                </button>
                </div>
            )}

            <hr className="border-white/30" />

            {/* logout */}
            <button onClick={handleLogout}
                className="w-full text-left py-3 text-[16px] md:text-[18px]">
                Logout
            </button>

            <hr className="border-white/30" />

            {/* delete account */}
            <button onClick={handleDeleteAccount}
                className="w-full text-left py-3 text-[16px] md:text-[18px] text-red-400">
                Delete Account
            </button>

            </div>
        </div>

        {toast && (
            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-black text-white px-6 py-3 rounded-full text-sm shadow-lg z-50 transition-all whitespace-nowrap">
            {toast}
            </div>
        )}
        </div>
    )
    }
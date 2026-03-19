import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseclient'
import { ArrowLeftIcon } from '@phosphor-icons/react'
import Logo from '../components/Logo'
import RecipeCard from '../components/RecipeCard'

export default function UserProfile() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [profile, setProfile] = useState(null)
    const [recipes, setRecipes] = useState([])

    useEffect(() => {
        const fetchData = async () => {
        const { data: profileData } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', id)
            .single()
        setProfile(profileData)

        const { data: recipeData, error } = await supabase
            .from('recipes')
            .select('*, profiles(id, username, avatar_url)')
            .eq('user_id', id)
            .order('created_at', { ascending: false })
        if (error) console.log(error.message)
        else setRecipes(recipeData || [])
        }
        fetchData()
    }, [id])

    return (
        <div className="min-h-screen">
        <Logo />
        <div className="max-w-[800px] mx-auto px-4">

            {/* back button */}
            <button onClick={() => navigate(-1)} className="text-white p-2 rounded-full mb-4">
            <ArrowLeftIcon size={24} />
            </button>

            {/* profile info */}
            <div className="flex items-center gap-4 mt-2">
            {profile?.avatar_url
                ? <img src={profile.avatar_url} className="w-20 h-20 rounded-full object-cover" />
                : <div className="w-20 h-20 rounded-full bg-gray-300" />
            }
            <div>
                <h4 className="font-extrabold text-[24px] md:text-[30px]">{profile?.username}</h4>
                <p className="text-white/70">{profile?.bio || ''}</p>
            </div>
            </div>

            {/* their recipes */}
            <div className="mt-8">
            {recipes.length === 0
                ? <p className="text-center text-white/60 mt-10">No posts yet.</p>
                : recipes.map(recipe => (
                    <RecipeCard key={recipe.id} recipe={recipe} />
                ))
            }
            </div>

        </div>
        </div>
    )
}
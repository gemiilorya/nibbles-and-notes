import Logo from '../components/Logo'
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseclient'
import { useNavigate } from 'react-router-dom'
import RecipeCard from '../components/RecipeCard'
import { Link } from 'react-router-dom'
import { GearSixIcon } from '@phosphor-icons/react'

export default function Profile() {
  const [recipes, setRecipes] = useState([])
  const [profile, setProfile] = useState(null)
  const [editingBio, setEditingBio] = useState(false)
  const [bio, setBio] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser()

      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()
      setProfile(profileData)

      const { data: recipeData, error } = await supabase
        .from('recipes')
        .select('*, profiles(id, username, avatar_url)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
      if (error) console.log(error.message)
      else setRecipes(recipeData || [])
    }
    fetchData()
  }, [])

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    const fileExt = file.name.split('.').pop()
    const fileName = `${profile.id}.${fileExt}`
    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(fileName, file, { upsert: true })
    if (uploadError) return console.log('Upload error:', uploadError.message)
    const { data } = supabase.storage.from('avatars').getPublicUrl(fileName)
    const publicUrl = data.publicUrl + '?t=' + Date.now()
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ avatar_url: publicUrl })
      .eq('id', profile.id)
    if (updateError) return console.log('Update error:', updateError.message)
    setProfile({ ...profile, avatar_url: publicUrl })
  }

  const handleSaveBio = async () => {
    await supabase.from('profiles').update({ bio }).eq('id', profile.id)
    setProfile({ ...profile, bio })
    setEditingBio(false)
  }

  return (
    <div className="min-h-screen">
      <Logo/>
      <div className="max-w-[800px] mx-auto px-4">
        <div className='flex items-center gap-4 mt-5'>
          <div onClick={() => document.getElementById('avatarInput').click()} className="cursor-pointer flex-shrink-0">
            {profile?.avatar_url
              ? <img src={profile.avatar_url} className="w-20 h-20 rounded-full object-cover cursor-pointer" />
              : <div className="w-20 h-20 rounded-full bg-gray-300 items-center justify-center flex cursor-pointer">
                  <span className="material-symbols-outlined">add</span>
                </div>
            }
          </div>
          <input id="avatarInput" type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
          <div className="flex-1">
            <h4 className='font-open-sans font-extrabold text-[24px] md:text-[30px]'>{profile?.username || 'User'}</h4>
            {editingBio
              ? <input value={bio} onChange={(e) => setBio(e.target.value)}
                  className="bg-transparent border-b border-white text-white outline-none w-full" />
              : <p className="cursor-pointer text-sm md:text-base" onClick={() => { setBio(profile?.bio || ''); setEditingBio(true) }}>
                  {profile?.bio || 'Add a bio...'}
                </p>
            }
            {editingBio && (
              <button onClick={handleSaveBio}
                className="bg-white text-black text-sm py-1 px-4 rounded-full mt-2">
                Save
              </button>
            )}
          </div>
          <div className="flex-shrink-0">
            <Link to="/settings"><GearSixIcon size={32} /></Link>
          </div>
        </div>

        {recipes.length === 0 && (
          <button
            className='bg-white text-black text-center font-open-sans py-4 px-10 rounded-full mt-10 block mx-auto w-fit'
            onClick={() => navigate('/add')}>
            Create Post
          </button>
        )}

        <div className="py-4">
          {recipes.length === 0
            ? <p className="text-center text-white mt-10 text-2xl md:text-4xl font-open-sans">No posts yet.</p>
            : recipes.map(recipe => (
                <RecipeCard key={recipe.id} recipe={recipe} />
              ))
          }
        </div>
      </div>
    </div>
  )
}
import { Link } from 'react-router-dom'
import { StarIcon } from '@phosphor-icons/react'
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseclient'

export default function RecipeCard({ recipe }) {
  const [currentUserId, setCurrentUserId] = useState(null)

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setCurrentUserId(user?.id)
    }
    getUser()
  }, [])

  const isOwnProfile = currentUserId === recipe.user_id
  const profileLink = isOwnProfile ? '/profile' : `/user/${recipe.profiles?.id}`

  return (
    <div>
      <div className="p-3 flex items-center gap-2">
        <Link to={profileLink} className="flex items-center">
          <img src={recipe.profiles?.avatar_url} className="-ml-2 w-20 h-20 rounded-full object-cover bg-gray-200" />
          <span className="ml-2 text-[30px] font-extrabold">{recipe.profiles?.username}</span>
        </Link>
      </div>
      <p className="font-bold text-[25px]">{recipe.title}</p>
      <div className="flex justify-between text-[15px] mt-1">
        <span>Prep time: {recipe.prep_time}</span>
        <span>Cook time: {recipe.cook_time}</span>
      </div>
      <img src={recipe.image_url} className="w-full aspect-square rounded-[30px] border-5 border-solid border-white object-cover mt-2" />
      <div className="p-3 text-right">
        <Link to={`/recipe/${recipe.id}`} className="text-[20px]">View full Recipe →</Link>
      </div>
      <p className="px-3 pb-3 text-sm">
        <span className="font-bold text-[18px]">{recipe.profiles?.username}</span>{' '}
        {recipe.description}
      </p>
    </div>
  )
}
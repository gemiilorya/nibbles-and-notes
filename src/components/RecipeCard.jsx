import { Link } from 'react-router-dom'
import { StarIcon } from '@phosphor-icons/react'

export default function RecipeCard({ recipe }) {
  return (
    <div>
      <div className="p-3 flex items-center gap-2">
        <img src={recipe.profiles?.avatar_url} className="-ml-2 w-20 h-20 rounded-full object-cover bg-gray-200" />
        <span className="ml-2 text-[30px] font-extrabold">{recipe.profiles?.username}</span>
      </div>
      <p className=" font-bold text-[25px]">{recipe.title}</p>
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
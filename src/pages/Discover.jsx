import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseclient'
import RecipeCard from '../components/RecipeCard'
import Logo from '../components/Logo'

export default function Discover() {
  const [recipes, setRecipes] = useState([])

  useEffect(() => {
    const fetchRecipes = async () => {
      const { data, error } = await supabase
        .from('recipes')
        .select('*, profiles(username, avatar_url)')
        .order('created_at', { ascending: false })
      console.log('data:', data)
      console.log('error:', error)
      if (error) console.log(error.message)
      else setRecipes(data || [])
    }
    fetchRecipes()
  }, [])

  return (
    <div className="min-h-screen">
      <Logo />
      <div className="p-4">
        {recipes.length === 0 
          ? <p className="text-center text-white mt-10 text-4xl font-open-sans">No recipes yet.</p>
          : recipes.map(recipe => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))
        }
      </div>
    </div>
  )
}
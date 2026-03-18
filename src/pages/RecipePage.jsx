import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseclient'
import { StarIcon, ArrowLeftIcon } from '@phosphor-icons/react'

export default function RecipePage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [recipe, setRecipe] = useState(null)
  const [isOwner, setIsOwner] = useState(false)
  const [editing, setEditing] = useState(false)

  const [editTitle, setEditTitle] = useState('')
  const [editDescription, setEditDescription] = useState('')
  const [editIngredients, setEditIngredients] = useState('')
  const [editInstructions, setEditInstructions] = useState('')
  const [editPrepTime, setEditPrepTime] = useState('')
  const [editCookTime, setEditCookTime] = useState('')

  useEffect(() => {
    const fetchRecipe = async () => {
      const { data, error } = await supabase
        .from('recipes')
        .select('*, profiles(username, avatar_url)')
        .eq('id', id)
        .single()
      if (error) return console.log(error.message)
      setRecipe(data)

      const { data: { user } } = await supabase.auth.getUser()
      setIsOwner(user?.id === data?.user_id)
    }
    fetchRecipe()
  }, [id])

  const handleStartEditing = () => {
    setEditTitle(recipe.title)
    setEditDescription(recipe.description)
    setEditIngredients(recipe.ingredients)
    setEditInstructions(recipe.instructions)
    setEditPrepTime(recipe.prep_time)
    setEditCookTime(recipe.cook_time)
    setEditing(true)
  }

  const handleSave = async () => {
    const { error } = await supabase
      .from('recipes')
      .update({
        title: editTitle,
        description: editDescription,
        ingredients: editIngredients,
        instructions: editInstructions,
        prep_time: editPrepTime,
        cook_time: editCookTime,
      })
      .eq('id', id)
    if (error) return console.log(error.message)
    setRecipe({ ...recipe, title: editTitle, description: editDescription, ingredients: editIngredients, instructions: editInstructions, prep_time: editPrepTime, cook_time: editCookTime })
    setEditing(false)
  }

  const handleDelete = async () => {
    const { error } = await supabase
      .from('recipes')
      .delete()
      .eq('id', id)
    if (error) return console.log(error.message)
    navigate(-1)
  }

  if (!recipe) return <p className="text-center mt-10">Loading...</p>

return (
  <div className="min-h-screen flex flex-col items-center">
    <div className="w-full max-w-[800px]">

      {/* hero image */}
      <div className="relative w-full h-[300px] md:h-[500px]">
        <img src={recipe.image_url} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        <button onClick={() => navigate(-1)}
          className="absolute top-4 left-4 bg-white/20 backdrop-blur-sm text-white p-2 rounded-full">
          <ArrowLeftIcon size={24} />
        </button>
        <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
          {editing
            ? <input value={editTitle} onChange={(e) => setEditTitle(e.target.value)}
                className="w-full bg-transparent text-white outline-none text-[24px] md:text-[40px] font-bold" />
            : <h1 className="text-[24px] md:text-[40px] font-bold text-white">{recipe.title}</h1>
          }
          <div className="flex items-center gap-2 mt-2">
            <img src={recipe.profiles?.avatar_url} className="w-8 h-8 rounded-full object-cover bg-gray-300" />
            <span className="text-white font-extrabold">{recipe.profiles?.username}</span>
          </div>
        </div>
      </div>

      {/* content below hero */}
      <div className="px-4 md:px-6 py-6">
        {editing
          ? <textarea value={editDescription} onChange={(e) => setEditDescription(e.target.value)}
              className="w-full bg-transparent border-b border-white text-white outline-none text-[16px] md:text-[18px] text-center" />
          : <p className="text-[16px] md:text-[18px] text-center text-white">{recipe.description}</p>
        }

        <div className="flex justify-between mt-4 md:mt-6">
          {editing
            ? <>
                <input value={editPrepTime} onChange={(e) => setEditPrepTime(e.target.value)}
                  placeholder="Prep Time"
                  className="w-1/2 bg-transparent border-b border-white text-white outline-none text-[14px] md:text-[16px]" />
                <input value={editCookTime} onChange={(e) => setEditCookTime(e.target.value)}
                  placeholder="Cook Time"
                  className="w-1/2 bg-transparent border-b border-white text-white outline-none text-[14px] md:text-[16px] text-right" />
              </>
            : <>
                <span className="text-[14px] md:text-[16px] text-white">Prep time: {recipe.prep_time}</span>
                <span className="text-[14px] md:text-[16px] text-white">Cook time: {recipe.cook_time}</span>
              </>
          }
        </div>

        <hr className="border-white/30 my-4 md:my-6" />

        <div>
          <h2 className="text-[20px] md:text-[25px] font-bold text-white">Ingredients</h2>
          {editing
            ? <textarea rows={8} value={editIngredients} onChange={(e) => setEditIngredients(e.target.value)}
                className="w-full bg-transparent text-white outline-none ring-0 focus:outline-none focus:ring-0 text-[14px] md:text-[16px]" />
            : <p className="text-[14px] md:text-[16px] whitespace-pre-line text-white leading-8">{recipe.ingredients}</p>
          }
          <h2 className="text-[20px] md:text-[25px] font-bold mt-4 md:mt-5 text-white">Instructions</h2>
          {editing
            ? <textarea rows={8} value={editInstructions} onChange={(e) => setEditInstructions(e.target.value)}
                className="w-full bg-transparent text-white outline-none ring-0 focus:outline-none focus:ring-0 text-[14px] md:text-[16px]" />
            : <p className="text-[14px] md:text-[16px] whitespace-pre-line leading-8 text-white">{recipe.instructions}</p>
          }
        </div>

        {isOwner && !editing &&
          <div className="flex gap-4 justify-center mt-10 mb-10">
            <button onClick={handleStartEditing}
              className="bg-white text-black py-2 px-8 rounded-full">
              Edit Recipe
            </button>
            <button onClick={handleDelete}
              className="bg-transparent border border-red-400 text-red-400 py-2 px-8 rounded-full">
              Delete Recipe
            </button>
          </div>
        }
        {editing &&
          <div className="flex gap-4 justify-center mt-10 mb-10">
            <button onClick={handleSave} className="bg-white text-black py-2 px-8 rounded-full">Save</button>
            <button onClick={() => setEditing(false)} className="bg-transparent border border-white text-white py-2 px-8 rounded-full">Cancel</button>
          </div>
        }
      </div>

    </div>
  </div>
)}
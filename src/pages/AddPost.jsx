import React, { useState } from 'react'
import { supabase } from '../lib/supabaseclient'
import { useNavigate } from 'react-router-dom'

export default function AddPost() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [ingredients, setIngredients] = useState('')
  const [instructions, setInstructions] = useState('')
  const [prepTime, setPrepTime] = useState('')
  const [cookTime, setCookTime] = useState('')
  const [image, setImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const navigate = useNavigate()

  const handleSubmit = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    const fileExt = image.name.split('.').pop()
    const fileName = `${user.id}-${Date.now()}.${fileExt}`
    const { error: uploadError } = await supabase.storage
      .from('recipe-images')
      .upload(fileName, image)
    if (uploadError) return console.log(uploadError.message)
    const { data: urlData } = supabase.storage
      .from('recipe-images')
      .getPublicUrl(fileName)
    const { error } = await supabase
      .from('recipes')
      .insert({
        user_id: user.id,
        title,
        description,
        ingredients,
        instructions,
        image_url: urlData.publicUrl,
        prep_time: prepTime,
        cook_time: cookTime,
      })
    if (error) console.log(error.message)
    else navigate('/discover')
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    setImage(file)
    setImagePreview(URL.createObjectURL(file))
  }

  return (
    <div className="min-h-screen flex flex-col items-center">
      <div className="w-full max-w-[800px]">

        {/* hero image area */}
        <div className="relative w-full h-[300px] md:h-[500px] cursor-pointer"
          onClick={() => document.getElementById('recipeInput').click()}>
          {imagePreview
            ? <img src={imagePreview} className="w-full h-full object-cover" />
            : <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                <span className="text-gray-400 text-[24px] md:text-[40px]">upload photo</span>
              </div>
          }
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
            <input
              onClick={(e) => e.stopPropagation()}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title"
              className="w-full bg-transparent text-white outline-none text-[24px] md:text-[40px] font-bold placeholder:text-white/60"
              type="text"
            />
          </div>
        </div>
        <input id="recipeInput" type="file" accept="image/*" className="hidden" onChange={handleImageChange} />

        {/* content below hero */}
        <div className="px-4 md:px-6 py-6">

          {/* description */}
          <textarea
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
            className="w-full bg-transparent text-white outline-none ring-0 focus:outline-none focus:ring-0 placeholder:text-white/60 text-[16px] md:text-[18px] text-center"
          />

          {/* prep and cook time */}
          <div className="flex justify-between mt-4 md:mt-6">
            <input
              onChange={(e) => setPrepTime(e.target.value)}
              placeholder="Prep Time"
              className="w-1/2 bg-transparent text-white outline-none ring-0 focus:outline-none focus:ring-0 placeholder:text-white/60 text-[14px] md:text-[16px] text-left"
            />
            <input
              onChange={(e) => setCookTime(e.target.value)}
              placeholder="Cook Time"
              className="w-1/2 bg-transparent text-white outline-none ring-0 focus:outline-none focus:ring-0 placeholder:text-white/60 text-[14px] md:text-[16px] text-right"
            />
          </div>

          <hr className="border-white/30 my-4 md:my-6" />

          {/* ingredients and instructions */}
          <div>
            <h2 className="text-[20px] md:text-[25px] font-bold text-white">Ingredients</h2>
            <textarea
              rows={8}
              onChange={(e) => setIngredients(e.target.value)}
              placeholder="Enter your ingredients."
              className="w-full bg-transparent text-white outline-none ring-0 focus:outline-none focus:ring-0 placeholder:text-white/60 mt-2.5 text-[14px] md:text-[16px]"
            />
            <h2 className="text-[20px] md:text-[25px] font-bold text-white mt-4 md:mt-5">Instructions</h2>
            <textarea
              rows={8}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="Enter your instructions."
              className="w-full bg-transparent text-white outline-none ring-0 focus:outline-none focus:ring-0 placeholder:text-white/60 mt-2.5 text-[14px] md:text-[16px]"
            />
          </div>

          <button onClick={handleSubmit}
            className="bg-white text-black text-center font-open-sans py-3 px-12 rounded-full mt-10 block mx-auto hover:scale-105 transition-transform">
            Submit
          </button>
        </div>

      </div>
    </div>
  )
}
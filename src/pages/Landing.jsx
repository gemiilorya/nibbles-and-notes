import Spoon from '../assets/spoon.svg'
import Pan from '../assets/pan.svg'
import { Link } from 'react-router-dom'

function Landing() {
  return (
    <div className="min-h-screen">
        <div className="flex items-center justify-center mt-50">
          <h1 className="text-[175px] text-center -mr-10 font-qilka text-white">N</h1>
          <img className="w-37.5 -mt-5" src={Spoon}/>
          <h1 className="text-[175px] text-center -ml-10 font-qilka text-white">bbles</h1>
        </div>
        <div className="flex items-center justify-center -mt-12.5">
          <h1 className="text-[175px] text-center mr-10 font-qilka text-white">&</h1>
          <h1 className="text-[175px] text-center -mr-5 font-qilka text-white">N</h1>
          <img className="w-37.5 -mt-5" src={Pan}/>
          <h1 className="text-[175px] text-center -ml-7 font-qilka text-white">tes</h1>
        </div>
        <div className="items-center">
          <Link to="/signup" className="bg-white text-black text-center font-open-sans py-[20px] px-[40px] rounded-full mt-10 block mx-auto w-fit">Browse Recipes</Link>
        </div>
    </div>
  )
}

export default Landing
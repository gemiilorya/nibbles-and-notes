import Spoon from '../assets/spoon.svg'
import Pan from '../assets/pan.svg'
import { Link } from 'react-router-dom'

function Landing() {
  return (
    <div className="min-h-screen">
      <div className="flex items-center justify-center mt-20 md:mt-50">
        <h1 className="text-[60px] md:text-[175px] text-center -mr-3 md:-mr-10 font-qilka text-white">N</h1>
        <img className="w-12 md:w-37.5 -mt-2 md:-mt-5" src={Spoon}/>
        <h1 className="text-[60px] md:text-[175px] text-center -ml-3 md:-ml-10 font-qilka text-white">bbles</h1>
      </div>
      <div className="flex items-center justify-center -mt-4 md:-mt-12.5">
        <h1 className="text-[60px] md:text-[175px] text-center mr-3 md:mr-10 font-qilka text-white">&</h1>
        <h1 className="text-[60px] md:text-[175px] text-center -mr-2 md:-mr-5 font-qilka text-white">N</h1>
        <img className="w-12 md:w-37.5 -mt-2 md:-mt-5" src={Pan}/>
        <h1 className="text-[60px] md:text-[175px] text-center -ml-2 md:-ml-7 font-qilka text-white">tes</h1>
      </div>
      <div className="items-center">
        <Link to="/signup" className="bg-white text-black text-center font-open-sans py-[15px] md:py-[20px] px-[30px] md:px-[40px] rounded-full mt-8 md:mt-10 block mx-auto w-fit">
          Browse Recipes
        </Link>
      </div>
    </div>
  )
}

export default Landing
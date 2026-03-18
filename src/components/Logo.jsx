import Spoon from '../assets/spoon.svg'
import Pan from '../assets/pan.svg'

export default function Logo() {
  return (
    <div className="flex items-center justify-center mt-5">
      <h1 className="text-[40px] -mr-2.75 font-qilka text-white">N</h1>
      <img className="w-10 -mt-1" src={Spoon}/>
      <h1 className="text-[40px] -ml-2.75 font-qilka text-white">bbles</h1>
      <h1 className="text-[40px] text-center ml-3.75 mr-3.75 font-qilka text-white">&</h1>
      <h1 className="text-[40px] text-center -mr-0.75 font-qilka text-white">N</h1>
      <img className="w-10 -mt-2" src={Pan}/>
      <h1 className="text-[40px] text-center -ml-2 font-qilka text-white">tes</h1>
    </div>
  )
}
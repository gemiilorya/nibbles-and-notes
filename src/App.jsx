import { Routes, Route, NavLink, useLocation } from 'react-router-dom'
import Landing from './pages/Landing'
import Discover from './pages/Discover'
import AddPost from './pages/AddPost'
import Profile from './pages/Profile'
import SignUp from './pages/SignUp'
import SignIn from './pages/SignIn'
import RecipePage from './pages/RecipePage'
import Settings from './pages/Settings'
import UserProfile from './pages/UserProfile'

import { CompassIcon, UserCircleIcon, PlusCircleIcon } from '@phosphor-icons/react'

const noNavPages = ['/', '/signup', '/signin', '/settings']

function App() {
  const location = useLocation()
  const showNav = !noNavPages.includes(location.pathname)

  return (
    <div className="flex flex-col min-h-screen max-w-sm mx-auto relative">

      <div className={`flex-1 ${showNav ? 'pb-20' : ''}`}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/discover" element={<Discover />} />
          <Route path="/add" element={<AddPost />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/recipe/:id" element={<RecipePage />} />
          <Route path="/user/:id" element={<UserProfile />} />
        </Routes>
      </div>

      {showNav && (
        <nav className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 flex justify-around items-center h-16 z-50">
          <NavLink to="/discover" className={({ isActive }) => isActive ? "text-black" : "text-gray-400"}>
            <div className="flex flex-col items-center">
              <CompassIcon size={32} />
              <span className="text-xs mt-1">Discover</span>
            </div>
          </NavLink>
          <NavLink to="/add" className={({ isActive }) => isActive ? "text-black" : "text-gray-400"}>
            <div className="flex flex-col items-center">
              <PlusCircleIcon size={32} />
              <span className="text-xs mt-1">Add</span>
            </div>
          </NavLink>
          <NavLink to="/profile" className={({ isActive }) => isActive ? "text-black" : "text-gray-400"}>
            <div className="flex flex-col items-center">
              <UserCircleIcon size={32} />
              <span className="text-xs mt-1">Profile</span>
            </div>
          </NavLink>
        </nav>
      )}
    </div>
  )
}

export default App
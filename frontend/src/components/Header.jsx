import React, { useState } from 'react'
import { Bot, IndianRupee, LogOut, Plus, Settings2, User, Workflow } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '@/features/auth.js'
import { setUserData } from '@/redux/userSlice'

const hideScrollbar = "[-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden";
const darkPanel = "border border-white/10 bg-white/[0.04] shadow-[0_20px_60px_rgba(0,0,0,0.35), inset_0_1px_0_rgba(255, 255,255,0.06)] backdrop-blur-xl";
const menuContent = "rounded-2x1 border border-white/10 bg-[#1d2026]/95 p-1.5 text-zinc-100 shadow-2x1 shadow-black/50 backdrop-blur-xl";
const menuItem = "rounded-x1 text-zinc-300 focus:bg-white/10 focus:text-white";
const menuSeparator = "bg-white/10";
const iconBtn = "size-9 rounded-x1 border border-white/10 bg-white/[0.05] p-0 text-zinc-300 hover:bg-white/10 hover:text-white cursor-pointer";
const whiteBtn = "rounded-x1 border-0 bg-white text-zinc-900 hover:bg-zinc-200 hover: text-zinc-900";

const Header = () => {
  const { userData } = useSelector(state => state.user)
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)

  const handle_logout = async () => {
    setLoading(true)
    try {
      const data = await logout()
      dispatch(setUserData(null))
      setLoading(false)
    } catch (error) {
      console.log(error)
      setLoading(false)
    }
  }

  return (
    <header className="z-30 h-16 px-4 sm:px-6 flex items-center justify-between shrink-0">
      <Link to={'/'} className="flex gap-2 items-center">
        <div className="grid size-8 place-items-center rounded-lg bg-white text-zinc-900 shadow-[0_10px_40_px_rgba(255,255,255,0.12)]">
          <Workflow size={14} />
        </div>
        <p className="text-xl font-medium tracking-tight text-zinc-200">Automate AI</p>
      </Link>

      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger render={<Button variant="outline" />} className={iconBtn}>
            <Workflow size={16} />
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end' className={`w-56 ${menuContent}`}>
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <Link to={`/agents`} className='flex items-center gap-2 w-full'>
                  <Bot size={14} /> My Agents
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link to={`/agent/new`} className='flex items-center gap-2 w-full'>
                  <Plus size={14} /> Create New Agent
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link to={`/integration`} className='flex items-center gap-2 w-full'>
                  <Settings2 size={14} /> Integration
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator className={menuSeparator} />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <Link to={`/billings`} className='flex items-center gap-2 w-full'>
                  <IndianRupee size={14} /> Billings
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger render={<Button variant="outline" />} className={`overflow-hidden ${iconBtn}`}>
            {userData?.profile ? <img src={userData?.profile} alt='profile' referrerPolicy='no-referrer' className='size-full object-cover' /> : <User size={16} />}
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end' className={`w-56 ${menuContent}`}>
            <DropdownMenuGroup>
              <DropdownMenuLabel className={`flex items-center gap-3 p-2`}>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-zinc-300">{userData.name || "name"}</p>
                  <p className="truncate text-xs text-zinc-400">{userData.email || "email"}</p>
                </div>
              </DropdownMenuLabel>
            </DropdownMenuGroup>
            <DropdownMenuSeparator className={menuSeparator} />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <button className='flex items-center gap-2 cursor-pointer w-full' onClick={handle_logout}>
                  {loading ? 'Logging out..' : <><LogOut size={14} /> Log Out</>}
                </button>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}

export default Header
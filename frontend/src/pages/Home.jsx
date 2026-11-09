import React, { useState } from 'react'
import Header from '@/components/Header'
import { ArrowUpIcon, Bot, ChevronDown, ImagePlus, Loader2, Plus, User, Workflow } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@base-ui/react/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { setSelectedAgent } from '@/redux/agentSlice.js'
import { Link } from 'react-router-dom'
import { chat } from '@/features/chat.js'


const gradient_bg = 'radial-gradient(ellipse 80% 60% at 50% 0%, #2b2f3a 0%, #191b21 55%, #121317 100%)'
const hideScrollbar = "[-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden";
const darkPanel = "border border-white/10 bg-white/[0.04] shadow-[0_20px_60px_rgba(0,0,0,0.35), inset_0_1px_0_rgba(255, 255,255,0.06)] backdrop-blur-xl";
const menuContent = "rounded-2xl border border-white/10 bg-[#1d2026]/95 p-1.5 text-zinc-100 shadow-2xl shadow-black/50 backdrop-blur-xl";
const menuItem = "rounded-xl text-zinc-300 focus:bg-white/10 focus:text-white";
const menuSeparator = "bg-white/10";
const iconBtn = "size-9 rounded-xl border border-white/10 bg-white/[0.05] p-0 text-zinc-300 hover:bg-white/10 hover:text-white cursor-pointer";
const whiteBtn = "rounded-lg border-0 bg-white text-zinc-900 hover:bg-zinc-200 hover: text-zinc-900 flex items-center justify-center cursor-pointer";

const Home = () => {
  const { userData } = useSelector(state => state.user)
  const { agents, selectedAgent } = useSelector(state => state.agent)
  const dispatch = useDispatch()

  const [messages, setMessages] = useState([])
  const [inputMessage, setInputMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSendMessage = async (e) => {
    e.preventDefault()
    setLoading(true)
    if (!inputMessage.trim()) return

    const newMessage = {
      role: 'user',
      text: inputMessage.trim()
    }

    setMessages([...messages, newMessage])
    setInputMessage('')

    if(!selectedAgent || selectedAgent === '') {
      try {
        const res = await chat(inputMessage.trim())
        const aiMessage = {
          role: 'assistant',
          text: res?.ai_response || 'Sorry, I could not process your request.'
        }
        setMessages(prevMessages => [...prevMessages, aiMessage])
        setLoading(false)
      } catch (error) {
        console.log(error.response?.data?.message || error.message || 'An error occurred while processing your request.')
        const aiMessage = {
          role: 'assistant',
          text: 'Sorry, I could not process your request.'
        }
        setMessages(prevMessages => [...prevMessages, aiMessage])
        setLoading(false)
      }
    }
  }

  return (
    <div
      className='relative min-h-screen w-full flex flex-col overflow-hidden text-white'
      style={{ background: gradient_bg }}
    >
      <div className="relative z-10 flex flex-col flex-1 min-h-0">
        <Header />
        <main classsName='flex min-h-0 flex-1 flex-col'>
          <section className='flex flex-1 flex-col  justify-between h-[90vh]'>
            <div className={`h-full flex-1 overflow-y-auto ${hideScrollbar}`}>
              <div className="mx-auto flex h-full w-full max-w-3xl flex-col gap-5 px-4 py-8 sm:px-6">
                {messages.length === 0 && (
                  <div className="flex flex-1 flex-col items-center justify-center pb-8 text-center">
                    <div className="mb-7 grid size-14 place-items-center rounded-2xl bg-white text-zinc-900">
                      <Workflow size={26} />
                    </div>
                    <p className="text-base text-violet-300/80">Hi, {userData?.name}</p>
                    <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">
                      Can I help you with anything?
                    </h1>
                    <p className="mt-4 max-w-sm text-xs leading-5 text-zinc-500">
                      Ask questions, automate tasks, or upload an image to prepare an Instagram post.
                    </p>
                  </div>
                )}
                {messages.length > 0 && (
                  <div className="flex flex-1 flex-col gap-6">
                    {messages.map((message, index) => (
                      <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        {message.role === 'user'
                          ? <div className="flex gap-3 items-start">
                            <p className="whitespace-pre-wrap ">{message.text}</p>
                            <div className="h-7 w-7 rounded-md flex items-center justify-center overflow-hidden">
                              <img src={userData?.profile} alt="profile" className="w-full h-full object-cover" />
                            </div>
                          </div>
                          :
                          <div className="flex gap-3 items-start w-[90%]">
                            <div className="h-7 w-7 bg-white rounded-md flex items-center justify-center shrink-0">
                              <Workflow size={16} className="text-zinc-500" />
                            </div>
                            <p className="whitespace-pre-wrap">{message.text}</p>
                          </div>
                        }

                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="z-20 w-full shrink-0 px-3 pb-3 pt-2 sm:px-5 sm:pb-4">
              <form onSubmit={handleSendMessage} className={`mx-auto w-full max-w-2xl rounded-2xl p-3 transition-colors focus-within:border-white/25 ${darkPanel}`}>
                <Textarea
                  value={inputMessage} onChange={(e) => setInputMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
                      e.preventDefault()
                      e.currentTarget.form?.requestSubmit()
                    }
                  }}
                  rows={2} name="message" id="message"
                  placeholder="Ask me anything..."
                  className={`min-h-20 resize-none border-0 bg-transparent px-2 py-1.5 text-sm text-white shadow-none placeholder:text-zinc-500 focus-visible:ring-0 ${hideScrollbar}`}
                />
                <div className="flex items-center justify-between gap-3 pt-2">
                  <div className="flex min-w-0 items-center gap-2">
                    <Button
                      type='button'
                      variant='ghost'
                      aria-label='Attach Image'
                      title='Attach Image'
                      className='size-8 rounded-lg text-zinc-300 hover:bg-white/10 hover:text-white flex items-center justify-center cursor-pointer'
                    >
                      <ImagePlus size={16} />
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          type="button"
                          variant="ghost"
                          className="h-8 flex items-center max-w-48 gap-1.5 cursor-pointer rounded-lg border border-white/10 bg-white/5 px-2.5 text-xs text-zinc-300 hover:bg-white/10 hover:text-white"
                        >
                          <Bot size={16} />
                          <span className="truncate mt-1">{selectedAgent || "Agent Not Selected"}</span>
                          <ChevronDown size={16} className="text-zinc-400 mt-1" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start" side="top" className={`mb-2 w-60 ${menuContent}`}>
                        {!agents && <DropdownMenuItem className={menuItem}>No Agent Found</DropdownMenuItem>}
                        {agents?.map((agent, index) => (
                          <DropdownMenuItem key={index} onClick={(e) => {
                            e.preventDefault()
                            dispatch(setSelectedAgent(agent.name))
                          }}
                            className={`cursor-pointer ${menuItem} ${selectedAgent === agent.name ? 'bg-white/10 text-white' : ''}`}
                          >
                            {agent?.name}
                          </DropdownMenuItem>
                        ))}
                        <DropdownMenuSeparator className={`${menuSeparator}`} />
                        <DropdownMenuItem asChild className={menuItem}>
                          <Link to={"/agent/new"} className="flex items-center gap-2 text-white cursor-pointer">
                            <Plus size={15} /> Create New Agent
                          </Link>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <div className='flex items-center gap-2'>
                    <Button
                      type="submit"
                      size="icon"
                      aria-label="Send message"
                      className={`size-8 shrink-0 ${whiteBtn} disabled:bg-white/10 disabled:text-zinc-500`}
                    >
                      {loading ? <Loader2 size={16} className="animate-spin" /> : <ArrowUpIcon size={16} />}
                    </Button>
                  </div>
                </div>
              </form>
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}

export default Home
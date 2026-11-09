import { delete_agent, get_all_agents } from '@/features/agent.js'
import { ArrowLeft, Bot, MessageCircle, Plus, Search, Trash2, Workflow } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@base-ui/react/button';
import { Input } from '@base-ui/react/input';
import { useDispatch, useSelector } from 'react-redux';
import { setAgents, setDelete, setLoading, setSelectedAgent } from '@/redux/agentSlice.js';

const gradient_bg = 'radial-gradient(ellipse 80% 60% at 50% 0%, #2b2f3a 0%, #191b21 55%, #121317 100%)'
const whiteBtn = "rounded-xl border-0 bg-white text-zinc-900 hover:bg-zinc-200 hover:text-zinc-900 px-3 py-1 text-sm font-medium focus-visible:ring-0 focus-visible:ring-offset-0";

const MyAgents = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { agents, loading } = useSelector(state => state.agent)
  const [searchQuery, setSearchQuery] = useState('')
  const [deletingAgentId, setDeletingAgentId] = useState(null)
  const [error, setError] = useState('')

  const filteredAgents = agents.filter((agent) => {
    const query = searchQuery.toLowerCase();
    return (
      agent.name.toLowerCase().includes(query) ||
      agent.knowledge.toLowerCase().includes(query) ||
      agent.instructions.toLowerCase().includes(query)
    );
  })

  useEffect(() => {
    const fetch_all_agents = async () => {
      setLoading(true)
      try {
        const all_agents = await get_all_agents()
        dispatch(setAgents(all_agents))
        dispatch(setLoading(false))
        // console.log(all_agents)
      } catch (error) {
        console.log(error)
        setLoading(false)
      }
    }
    fetch_all_agents()
  }, [])

  const handleDeleteAgent = async (agent) => {
    if (!window.confirm(`Delete "${agent.name}"? This action cannot be undone.`)) {
      return
    }

    setDeletingAgentId(agent._id)
    setError('')
    try {
      await delete_agent(agent._id)
      dispatch(setDelete(agent._id))
    } catch (deleteError) {
      setError(deleteError.response?.data?.message || `Failed to delete "${agent.name}". Please try again.`)
    } finally {
      setDeletingAgentId(null)
    }
  }

  return (
    <div
      className='relative min-h-screen text-white'
      style={{ background: gradient_bg }}
    >
      <div className="relative z-10">
        <header className="z-30 h-16 px-4 sm:px-6 flex items-center justify-between shrink-0">
          <Link to={'/'} className="flex gap-2 items-center">
            <div className="grid size-8 place-items-center rounded-lg bg-white text-zinc-900 shadow-[0_10px_40_px_rgba(255,255,255,0.12)]">
              <Workflow size={14} />
            </div>
            <p className="text-xl font-medium tracking-tight text-zinc-200">Automate AI</p>
          </Link>
          <Link to={`/`} className='flex items-center gap-2 text-sm text-zinc-400 hover:text-zinc-200 transition-colors duration-300'>
            <ArrowLeft size={16} />
            Back to Home
          </Link>
        </header>
        <main className='mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14'>
          <div className='flex flex-col justify-between gap-5 sm:flex-row sm:items-center'>
            <div>
              <div className='mb-3 flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-violet-300/80'>
                <Bot size={15} />Agent workspace
              </div>
              <h1 className='text-3xl font-semibold tracking-tight sm:text-4xl'>
                My Agents
              </h1>
              <p className="mt-2 text-sm text-zinc-500">
                Manage your AI agents and choose one to get started.
              </p>
            </div>
            <Button
              type="button"
              className={`h-10 items-center gap-2 ${whiteBtn}`}
            >
              <Link to="/agent/new" className="inline-flex items-center gap-2">
                <Plus size={17} className="shrink-0" />
                <span>Create agent</span>
              </Link>
            </Button>
          </div>

          <div className="w-full mt-9 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative w-full sm:max-w-sm">
              <Search
                size={16}
                className="absolute z-20 left-3 top-1/2 -translate-y-1/2 text-zinc-500"
              />

              <Input
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search agents.."
                className="h-10 w-full rounded-xl border-white/10 bg-white/4 pl-9 text-white backdrop-blur-xl placeholder:text-zinc-500 focus-visible:border-white/25 focus-visible:ring-white/10"
              />
            </div>
            <p className="text-sm text-zinc-400">{agents.length} Agents</p>
          </div>

          {error && <p role="alert" className="mt-4 text-sm text-red-400">{error}</p>}

          {loading ? (
            <div className="mt-20 flex w-full items-center justify-center">
              <p className="text-center text-sm text-zinc-400">Loading agents...</p>
            </div>
          ) : filteredAgents.length > 0 ? (
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredAgents.map((agent) => (
                <div
                  key={agent._id}
                  className="rounded-2xl border border-white/10 bg-white/4 p-5 text-white shadow-[0_10px_40px_rgba(255,255,255,0.12)] backdrop-blur-xl transition-colors duration-300 hover:border-white/20"
                >
                  <div className="flex flex-col gap-1">
                    <div className='mb-1 grid size-12 place-items-center rounded-2xl bg-white text-zinc-900 shadow-[0_10px_40px_rgba(255,255,255,0.12)]'>
                      <Bot size={20} />
                    </div>
                    <h2 className="text-lg font-semibold tracking-tight text-white">
                      {agent.name}
                    </h2>
                    <p className="text-sm text-zinc-400">
                      {agent.instructions}
                    </p>
                  </div>
                  <div className="mt-3 flex items-center justify-end gap-2 border-t border-white/10 pt-2">
                    <Button
                      type="button"
                      disabled={deletingAgentId === agent._id}
                      onClick={() => handleDeleteAgent(agent)}
                      className="cursor-pointer inline-flex items-center gap-2 rounded-lg border border-red-400/30 bg-red-500/10 px-3 py-1 text-sm text-red-300 hover:bg-red-500/20 disabled:opacity-50"
                    >
                      <Trash2 size={15} />
                      {deletingAgentId === agent._id ? 'Deleting...' : 'Delete'}
                    </Button>
                    <Button
                      type="button"
                      onClick={() => {
                        navigate(`/`)
                        dispatch(setSelectedAgent(agent.name))
                      }}
                      className="cursor-pointer inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white text-sm text-zinc-900 hover:bg-zinc-200 px-3 py-1"
                    >
                      <MessageCircle size={15} />
                      Chat
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-20 w-full flex items-center justify-center">
              <p className="text-center text-sm text-zinc-400">No agents found. Try adjusting your search or create a new agent.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

export default MyAgents
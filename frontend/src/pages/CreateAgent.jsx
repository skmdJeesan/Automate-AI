import { Textarea } from '@/components/ui/textarea';
import { Input } from '@base-ui/react/input';
import { ArrowLeft, Bot, Check, Workflow } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { LuCalculator } from "react-icons/lu";
import { CiGlobe } from "react-icons/ci";
import { SiGmail } from "react-icons/si";
import { MdOutgoingMail } from "react-icons/md";
import { Button } from '@base-ui/react/button';
import { create_agent } from '@/features/agent.js';

const gradient_bg = 'radial-gradient(ellipse 80% 60% at 50% 0%, #2b2f3a 0%, #191b21 55%, #121317 100%)'
const darkPanel = "border border-white/10 bg-white/[0.04] shadow-[0_20px_60px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-xl";
const fieldCls = "rounded-xl border border-white/10 bg-white/[0.04] text-sm text-white backdrop-blur-xl placeholder:text-zinc-500 focus-visible:border-white/25 focus-visible:ring-0";

const available_tools = [
  {
    id: 'calculator',
    name: 'Calculator',
    icon: LuCalculator,
    description: 'Perform calculations and solve mathematical problems.',
  },
  {
    id: 'web_search',
    name: 'Web Search',
    icon: CiGlobe,
    description: 'Search the web for information and answers.',
  },
  {
    id: 'gmail_read',
    name: 'Read Emails',
    icon: SiGmail,
    description: 'Read your Gmail emails and provide summaries.',
  },
  {
    id: 'gmail_send',
    name: 'Send Emails',
    icon: MdOutgoingMail,
    description: 'Compose and send emails through your Gmail account.',
  }
]

const CreateAgent = () => {

  const [name, setName] = useState('')
  const [instructions, setInstructions] = useState('')
  const [knowledge, setKnowledge] = useState('')
  const [selectedTools, setSelectedTools] = useState([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState(null)

  const navigate = useNavigate()

  const toggleToolSelection = (toolId) => {
    // if the tool is already selected, remove it from the selectedTools array, otherwise add it
    if (selectedTools.includes(toolId)) {
      setSelectedTools(selectedTools.filter((id) => id !== toolId));
    } else {
      setSelectedTools([...selectedTools, toolId]);
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      const res = await create_agent({name, instructions, knowledge, tools: selectedTools});
      if(res?.response?.data?.message) {
        setError(res.message);
        setIsSubmitting(false);
        return;
      }
      navigate(`/agents`);
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
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

        <main className='mx-auto w-full max-w-3xl px-5 pb-12 pt-10 sm:px-8 sm:pt-14'>
          <div className='mb-9'>
            <div className='mb-5 grid size-12 place-items-center rounded-2xl bg-white text-zinc-900 shadow-[0_10px_40px_rgba(255,255,255,0.12)]'>
              <Bot size={24} />
            </div>

            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Create An Agent
            </h1>

            <p className="mt-2 text-sm text-zinc-500">
              Configure your AI agent and define what it can do.
            </p>
          </div>

          <form onSubmit={handleSubmit} className={`space-y-7 rounded-3xl p-5 sm:p-7 ${darkPanel}`}>
            <section className='space-y-5'>
              <div>
                <label htmlFor="agent-name"
                  className="mb-2 block text-xs font-medium text-zinc-300"
                >
                  Agent Name
                </label>
                <Input
                  placeholder="e.g. Research Assistant"
                  maxLength={100}
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={`h-11 ${fieldCls} w-full p-2.5`}
                />
              </div>
              <div>
                <label htmlFor="instructions"
                  className="mb-2 block text-xs font-medium text-zinc-300"
                >
                  Instructions
                </label>
                <Input
                  placeholder="Instructions for the agent to follow.."
                  maxLength={100}
                  required
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  className={`h-11 ${fieldCls} w-full p-2.5`}
                />
              </div>
              <div>
                <label htmlFor="knowledge"
                  className="mb-2 block text-xs font-medium text-zinc-300"
                >
                  Knowledge
                </label>
                <Textarea
                  placeholder="Knowledge base for the agent to refer to.."
                  maxLength={100}
                  required
                  value={knowledge}
                  onChange={(e) => setKnowledge(e.target.value)}
                  className={`h-11 ${fieldCls}`}
                />
              </div>
            </section>
            <section>
              <h2 className='text-sm font-medium text-zinc-300'>Available Tools</h2>
              <p className="text-xs text-zinc-500 mb-2">
                Select the tools that your agent can use.
              </p>
              <div className='grid grid-cols-1 gap-2'>
                {available_tools.map((tool) => (
                  <div
                    key={tool.id}
                    className={`flex items-center gap-3 rounded-xl p-3 cursor-pointer transition-colors ${
                      selectedTools.includes(tool.id)
                        ? 'bg-slate-200 text-black'
                        : 'bg-zinc-800 hover:bg-zinc-600'
                    }`}
                    onClick={() => toggleToolSelection(tool.id)}
                  >
                    <div className='size-8 rounded-lg bg-zinc-600 p-2 text-white'>
                      <tool.icon />
                    </div>
                    <div className="">
                      <span className='text-sm font-medium'>{tool.name}</span>
                      <p className='text-xs text-zinc-500'>{tool.description}</p>
                    </div>
                    <span className={`ml-auto size-5 grid place-items-center rounded-full border border-white/10 transition-colors ${
                      selectedTools.includes(tool.id)
                        ? 'bg-green-500 text-white'
                        : 'bg-zinc-800 text-zinc-500'
                    }`}>
                      {selectedTools.includes(tool.id) && <Check size={14} />}
                    </span>
                  </div>
                ))}
              </div>
            </section>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <div className="flex items-center justify-end gap-2 border-t border-white/10 pt-4">
              <Button
                type="button"
                variant="ghost"
                onClick={() => navigate('/')}
                className="px-3 py-1 cursor-pointer rounded-lg border border-white/10 bg-white/10 text-sm text-white backdrop-blur-xl hover:bg-white/90 hover:text-black focus-visible:border-white/25 focus-visible:ring-0"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="px-3 py-1 cursor-pointer rounded-lg border border-white/10 bg-white/10 text-sm text-white backdrop-blur-xl hover:bg-white/90 hover:text-black focus-visible:border-white/25 focus-visible:ring-0"
              >
                {isSubmitting ? 'Creating..' : 'Create Agent'}
              </Button>
            </div>
          </form>
        </main>


      </div>
    </div>
  )
}

export default CreateAgent
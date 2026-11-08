import { LoginForm } from '@/components/login-form'
import { Workflow } from 'lucide-react'
import React from 'react'

const Login = () => {
  const gradient_bg = 'radial-gradient(ellipse 80% 60% at 50% 0%, #2b2f3a 0%, #191b21 55%, #121317 100%)'
  return (
    <div
      className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden px-4 py-12 text-white"
      style={{ background: gradient_bg }}
    >
      <div className="relative z-10 w-full max-w-md">
        <div className="mb-6 flex gap-2 items-center justify-center text-center">
          <div className="grid size-8 place-items-center rounded-lg bg-white text-zinc-900 shadow-[0_10px_40_px_rgba(255,255,255,0.12)]">
            <Workflow size={24}/>
          </div>
          <p className="text-xl font-medium tracking-tight text-zinc-200">Automate AI</p>
        </div>
      </div>
      <LoginForm />
    </div>
  )
}

export default Login
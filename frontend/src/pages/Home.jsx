import React from 'react'
import Header from '@/components/Header'

const Home = () => {
  const gradient_bg = 'radial-gradient(ellipse 80% 60% at 50% 0%, #2b2f3a 0%, #191b21 55%, #121317 100%)'
  return (
    <div
      className='relative min-h-screen w-full flex flex-col overflow-hidden text-white'
      style={{ background: gradient_bg }}
    >
      <div className="relative z-10 flex flex-col flex-1 min-h-0">
        <Header />
      </div>
    </div>
  )
}

export default Home
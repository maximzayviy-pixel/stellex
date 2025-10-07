'use client'

import React, { useRef, useEffect } from 'react'
import { motion } from 'framer-motion'

export default function PlasticCard3D() {
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!cardRef.current) return

      const rect = cardRef.current.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      const centerX = rect.width / 2
      const centerY = rect.height / 2
      const rotateX = (y - centerY) / 10
      const rotateY = (centerX - x) / 10

      cardRef.current.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`
    }

    const handleMouseLeave = () => {
      if (cardRef.current) {
        cardRef.current.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)'
      }
    }

    const card = cardRef.current
    if (card) {
      card.addEventListener('mousemove', handleMouseMove)
      card.addEventListener('mouseleave', handleMouseLeave)
    }

    return () => {
      if (card) {
        card.removeEventListener('mousemove', handleMouseMove)
        card.removeEventListener('mouseleave', handleMouseLeave)
      }
    }
  }, [])

  return (
    <div className="flex justify-center items-center h-96 perspective-1000">
      <motion.div
        ref={cardRef}
        initial={{ opacity: 0, scale: 0.8, rotateY: -180 }}
        animate={{ opacity: 1, scale: 1, rotateY: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="relative w-80 h-48 bg-gradient-to-br from-slate-800 via-slate-900 to-black rounded-2xl shadow-2xl cursor-pointer border border-white/10"
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Card Background Pattern - убираем лишние элементы */}
        <div className="absolute inset-0 rounded-2xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"></div>
          {/* Добавляем тонкие линии для премиальности */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
        </div>

        {/* Card Content */}
        <div className="relative z-10 p-6 h-full flex flex-col justify-between text-white">
          {/* Top Section */}
          <div className="flex justify-between items-start">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                <img 
                  src="https://i.imgur.com/ogTdloq.png" 
                  alt="Stellex Logo" 
                  className="w-7 h-7 rounded"
                />
              </div>
              <div>
                <div className="text-lg font-bold tracking-wide">Stellex</div>
                <div className="text-xs text-white/60 font-medium">PAY</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-white/60 mb-1 font-medium tracking-wider">DEBIT</div>
              <div className="w-12 h-8 bg-gradient-to-r from-white/20 to-white/10 rounded-lg flex items-center justify-center">
                <div className="w-8 h-5 bg-white/30 rounded-sm"></div>
              </div>
            </div>
          </div>

          {/* Middle Section */}
          <div className="flex-1 flex items-center justify-center">
            <div className="space-y-4 w-full">
              <div className="text-2xl font-mono tracking-[0.3em] text-center">6660 1234 5678 9012</div>
              <div className="flex justify-center items-center space-x-8">
                <div className="text-center">
                  <div className="text-xs text-white/60 mb-1 font-medium tracking-wider">VALID THRU</div>
                  <div className="text-sm font-mono tracking-wider">12/28</div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-white/60 mb-1 font-medium tracking-wider">CVV</div>
                  <div className="text-sm font-mono tracking-wider">***</div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="flex justify-between items-end">
            <div>
              <div className="text-xs text-white/60 mb-1 font-medium tracking-wider">CARDHOLDER NAME</div>
              <div className="text-sm font-semibold tracking-wide">JOHN DOE</div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-6 bg-gradient-to-r from-white/20 to-white/10 rounded-lg flex items-center justify-center">
                <div className="w-5 h-4 bg-white/40 rounded-sm"></div>
              </div>
              <div className="text-xs text-white/60 font-medium tracking-wider">CHIP</div>
            </div>
          </div>
        </div>

        {/* Subtle Shine Effect */}
        <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent transform -skew-x-12"></div>
        </div>

        {/* Premium Glow Effect */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-slate-600/20 via-slate-500/20 to-slate-600/20 rounded-2xl blur-sm -z-10"></div>
      </motion.div>
    </div>
  )
}

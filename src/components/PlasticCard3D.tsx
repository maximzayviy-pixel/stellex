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
        className="relative w-80 h-48 bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 rounded-2xl shadow-2xl cursor-pointer"
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Card Background Pattern */}
        <div className="absolute inset-0 rounded-2xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
          <div className="absolute top-4 right-4 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
          <div className="absolute bottom-4 left-4 w-24 h-24 bg-purple-400/20 rounded-full blur-xl"></div>
        </div>

        {/* Card Content */}
        <div className="relative z-10 p-6 h-full flex flex-col justify-between text-white">
          {/* Top Section */}
          <div className="flex justify-between items-start">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                <img 
                  src="https://i.imgur.com/ogTdloq.png" 
                  alt="Stellex Logo" 
                  className="w-6 h-6 rounded"
                />
              </div>
              <span className="text-lg font-bold">Stellex Pay</span>
            </div>
            <div className="text-right">
              <div className="text-xs text-white/70 mb-1">DEBIT</div>
              <div className="w-8 h-6 bg-white/20 rounded"></div>
            </div>
          </div>

          {/* Middle Section */}
          <div className="flex-1 flex items-center">
            <div className="space-y-2">
              <div className="text-2xl font-mono tracking-wider">6660 1234 5678 9012</div>
              <div className="flex items-center space-x-4">
                <div>
                  <div className="text-xs text-white/70">VALID THRU</div>
                  <div className="text-sm font-mono">12/28</div>
                </div>
                <div>
                  <div className="text-xs text-white/70">CVV</div>
                  <div className="text-sm font-mono">***</div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="flex justify-between items-end">
            <div>
              <div className="text-xs text-white/70 mb-1">CARDHOLDER NAME</div>
              <div className="text-sm font-semibold">JOHN DOE</div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-6 h-4 bg-white/20 rounded flex items-center justify-center">
                <div className="w-4 h-3 bg-white/40 rounded-sm"></div>
              </div>
              <div className="text-xs text-white/70">CHIP</div>
            </div>
          </div>
        </div>

        {/* Holographic Effect */}
        <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 animate-pulse"></div>
        </div>

        {/* Glow Effect */}
        <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-700 rounded-2xl blur opacity-30 -z-10"></div>
      </motion.div>
    </div>
  )
}

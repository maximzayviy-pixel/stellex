'use client'

import React, { useMemo, useRef, useState } from 'react'
import { motion, useMotionTemplate, useMotionValue } from 'framer-motion'
import {
  Smartphone,
  CreditCard,
  Zap,
  Shield,
  Code,
  BarChart3,
  Users,
  Star,
  ArrowRight,
  Calendar,
} from 'lucide-react'

interface LandingPageProps {
  onLogin: () => void
  onRegister: () => void
}

function ShineText({ children }: { children: React.ReactNode }) {
  return (
    <span className="relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-300 via-white to-sky-300 [background-size:200%_100%] animate-[shimmer_5s_linear_infinite]">
      {children}
    </span>
  )
}

function TiltCard({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement | null>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const rotateX = useMotionTemplate`${y}deg`
  const rotateY = useMotionTemplate`${x}deg`

  const handleMouseMove: React.MouseEventHandler<HTMLDivElement> = (e) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const px = (e.clientX - rect.left) / rect.width
    const py = (e.clientY - rect.top) / rect.height
    const max = 5
    x.set((0.5 - px) * max)
    y.set((py - 0.5) * max)
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => { x.set(0); y.set(0) }}
      style={{ perspective: 1000, transformStyle: 'preserve-3d' }}
      className="rounded-3xl overflow-hidden shadow-[0_0_30px_rgba(0,0,0,0.4)] bg-gradient-to-br from-white/10 to-white/5 border border-white/10 backdrop-blur-xl"
    >
      <motion.div style={{ rotateX, rotateY }} className="p-8 flex flex-col justify-between h-full">
        {children}
      </motion.div>
    </motion.div>
  )
}

export default function LandingPage({ onLogin, onRegister }: LandingPageProps) {
  const [activeTab, setActiveTab] = useState<'users' | 'developers'>('users')

  const features = useMemo(
    () => ({
      users: [
        {
          icon: CreditCard,
          title: 'Виртуальные и физические карты',
          description: 'Выпускайте до 3 виртуальных и пластиковую — оплачивайте везде.',
          gradient: 'from-fuchsia-500 to-sky-500',
        },
        {
          icon: Zap,
          title: 'Мгновенные переводы',
          description: 'Перевод по номеру карты и QR — за секунды, без скрытых комиссий.',
          gradient: 'from-violet-500 to-indigo-500',
        },
        {
          icon: Shield,
          title: 'Банковская безопасность',
          description: 'Шифрование, лимиты, подтверждения — контроль в одном тапе.',
          gradient: 'from-sky-500 to-cyan-500',
        },
      ],
      developers: [
        { icon: Code, title: 'REST API', description: 'Простой API для интеграции платежей', gradient: 'from-sky-500 to-fuchsia-500' },
        { icon: BarChart3, title: 'Аналитика', description: 'Дашборды с метриками и ретеншеном', gradient: 'from-indigo-500 to-violet-500' },
        { icon: Users, title: 'Webhook уведомления', description: 'Онлайн-события по всем статусам', gradient: 'from-fuchsia-500 to-cyan-500' },
        { icon: Star, title: 'Готовые виджеты', description: 'Кнопки PAY WITH STELLEX и примеры', gradient: 'from-sky-500 to-indigo-500' },
      ],
    }),
    []
  )

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0b0b12] text-white">
      {/* Header */}
      <header className="relative z-10">
        <div className="container mx-auto px-6 py-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-fuchsia-500 to-sky-500 flex items-center justify-center shadow-lg shadow-fuchsia-500/30">
              <Smartphone className="h-6 w-6" />
            </div>
            <div>
              <div className="text-xl font-semibold tracking-tight">Stellex Pay</div>
              <div className="text-white/60 text-xs">Банк со звездами Telegram</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.98 }} onClick={onLogin} className="px-5 py-2.5 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 backdrop-blur-md">Войти</motion.button>
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }} onClick={onRegister} className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-fuchsia-500 via-violet-500 to-sky-500 hover:from-fuchsia-400 hover:to-sky-400 shadow-[0_10px_30px_rgba(99,102,241,.35)]">Регистрация</motion.button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative z-10 container mx-auto px-6 pt-6 pb-16 text-center">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 mb-6 backdrop-blur">
            <Calendar className="h-4 w-4 text-emerald-300" />
            <span className="text-sm text-white/80">Новинка • Пластиковые карты с Telegram Stars</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-extrabold leading-tight tracking-tight">Платежи будущего — <ShineText>в Telegram</ShineText></h1>
          <p className="mt-5 text-white/70 text-lg max-w-2xl mx-auto">Создавайте карты, принимайте и отправляйте платежи в звёздах. Быстро, безопасно и невероятно красиво.</p>
        </motion.div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-6 pb-20">
        <div className="grid md:grid-cols-3 gap-10">
          {features.users.map((feature, index) => (
            <TiltCard key={index}>
              <div className="flex flex-col items-center text-center gap-5">
                <div className={`h-16 w-16 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center shadow-lg shadow-fuchsia-500/20`}>
                  <feature.icon className="h-7 w-7" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-white/70 leading-relaxed text-base max-w-xs mx-auto">{feature.description}</p>
                </div>
              </div>
            </TiltCard>
          ))}
        </div>
      </section>

      {/* Partners marquee */}
      <section className="relative overflow-hidden border-y border-white/10 py-8 bg-white/5 backdrop-blur-md">
        <div className="animate-marquee whitespace-nowrap flex items-center gap-16 text-2xl font-bold uppercase tracking-widest text-white/70">
          {['TON','FRAGMENT','TELEGRAM','STONEGRAM','WALLETTG'].map((partner,i)=>(
            <span key={i} className="flex items-center gap-2"><Star className="h-5 w-5 text-fuchsia-400"/> {partner}</span>
          ))}
          {['TON','FRAGMENT','TELEGRAM','STONEGRAM','WALLETTG'].map((partner,i)=>(
            <span key={`dup-${i}`} className="flex items-center gap-2"><Star className="h-5 w-5 text-fuchsia-400"/> {partner}</span>
          ))}
        </div>
      </section>

      {/* Tabs & Features */}
      <section className="relative z-10 container mx-auto px-6 pb-20">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mx-auto w-fit rounded-2xl bg-white/5 p-1 backdrop-blur border border-white/10 shadow-inner shadow-white/5">
            <button onClick={()=>setActiveTab('users')} className={`px-6 py-3 rounded-xl text-sm font-medium transition-all ${activeTab==='users'?'bg-white text-neutral-900 shadow':'text-white/70 hover:text-white'}`}>Для пользователей</button>
            <button onClick={()=>setActiveTab('developers')} className={`px-6 py-3 rounded-xl text-sm font-medium transition-all ${activeTab==='developers'?'bg-white text-neutral-900 shadow':'text-white/70 hover:text-white'}`}>Для разработчиков</button>
          </div>
          <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features[activeTab].map((f,i)=>(
              <motion.div key={f.title} initial={{opacity:0,y:14}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:i*0.05}} className="relative rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.06] to-white/[0.02] p-5 backdrop-blur-xl hover:from-white/[0.1] hover:border-white/20">
                <div className={`h-11 w-11 rounded-xl bg-gradient-to-br ${f.gradient} grid place-items-center`}><f.icon className="h-6 w-6"/></div>
                <div className="mt-4 text-lg font-semibold">{f.title}</div>
                <p className="mt-2 text-white/70 text-sm leading-relaxed">{f.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 container mx-auto px-6 pb-20">
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-r from-fuchsia-600/20 via-violet-600/20 to-sky-600/20 p-10 md:p-14 backdrop-blur-xl">
          <div className="absolute -inset-x-10 -bottom-20 h-40 blur-3xl bg-gradient-to-r from-fuchsia-500/20 via-violet-500/20 to-sky-500/20" />
          <div className="relative flex flex-col md:flex-row items-center md:items-end justify-between gap-8">
            <div>
              <h3 className="text-3xl md:text-4xl font-extrabold leading-tight">Готовы начать?</h3>
              <p className="mt-2 text-white/80 max-w-xl">Присоединяйтесь к тысячам пользователей, которые уже пользуются Stellex Pay.</p>
            </div>
            <div className="flex items-center gap-3">
              <motion.button onClick={onRegister} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }} className="px-8 py-4 rounded-2xl font-semibold bg-white text-neutral-900 hover:bg-neutral-100">Создать аккаунт</motion.button>
              <motion.button onClick={()=>window.open('https://docs.stellex-pay.com','_blank')} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.98 }} className="px-8 py-4 rounded-2xl border border-white/15 bg-white/5 hover:bg-white/10 backdrop-blur">Документация</motion.button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10">
        <div className="container mx-auto px-6 py-8 text-center">
          <p className="text-white/60 text-sm">© {new Date().getFullYear()} Stellex Pay. Все права защищены.</p>
          <p className="text-white/40 text-xs mt-2">@stellexbank_bot</p>
        </div>
      </footer>

      <style jsx global>{`
        @keyframes shimmer {0%{background-position:0% 50%}100%{background-position:200% 50%}}
        @keyframes marquee {0%{transform:translateX(0)}100%{transform:translateX(-50%)}}
        .animate-marquee {display:inline-flex;animation:marquee 20s linear infinite;}
      `}</style>
    </div>
  )
}

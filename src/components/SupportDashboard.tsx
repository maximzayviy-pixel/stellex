'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  MessageSquare, 
  User, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Search,
  Filter,
  Plus,
  Eye,
  Reply,
  X
} from 'lucide-react'
import { SupportTicket, User as UserType } from '@/types'
import { useAuth } from './AuthProvider'

export default function SupportDashboard() {
  const { user } = useAuth()
  const [tickets, setTickets] = useState<SupportTicket[]>([])
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [priorityFilter, setPriorityFilter] = useState<string>('all')

  useEffect(() => {
    if (user) {
      loadTickets()
    }
  }, [user])

  const loadTickets = async () => {
    try {
      setIsLoading(true)
      
      const response = await fetch('/api/support/tickets', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setTickets(data.tickets || [])
      }
    } catch (error) {
      console.error('Error loading tickets:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleStatusChange = async (ticketId: string, newStatus: 'open' | 'in_progress' | 'resolved' | 'closed') => {
    try {
      const response = await fetch(`/api/support/tickets/${ticketId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        },
        body: JSON.stringify({ status: newStatus })
      })

      if (response.ok) {
        await loadTickets()
        if (selectedTicket?.id === ticketId) {
          setSelectedTicket({ ...selectedTicket, status: newStatus as 'open' | 'in_progress' | 'resolved' | 'closed' })
        }
      }
    } catch (error) {
      console.error('Error updating ticket status:', error)
    }
  }

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         ticket.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter
    const matchesPriority = priorityFilter === 'all' || ticket.priority === priorityFilter
    
    return matchesSearch && matchesStatus && matchesPriority
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-red-500/20 text-red-400'
      case 'in_progress': return 'bg-yellow-500/20 text-yellow-400'
      case 'resolved': return 'bg-green-500/20 text-green-400'
      case 'closed': return 'bg-gray-500/20 text-gray-400'
      default: return 'bg-gray-500/20 text-gray-400'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-500/20 text-red-400'
      case 'high': return 'bg-orange-500/20 text-orange-400'
      case 'medium': return 'bg-yellow-500/20 text-yellow-400'
      case 'low': return 'bg-green-500/20 text-green-400'
      default: return 'bg-gray-500/20 text-gray-400'
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white">Загрузка...</p>
        </div>
      </div>
    )
  }

  if (user?.role !== 'support' && user?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Доступ запрещен</h1>
          <p className="text-white/70">У вас нет прав поддержки</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Header */}
      <div className="p-4 pt-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white">Stellex Support</h1>
            <p className="text-white/70">Панель поддержки</p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="text-white/70 text-sm">
              {tickets.filter(t => t.status === 'open').length} открытых тикетов
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
            <div className="flex items-center space-x-3">
              <MessageSquare className="w-8 h-8 text-blue-400" />
              <div>
                <p className="text-white/70 text-sm">Всего тикетов</p>
                <p className="text-white text-xl font-bold">{tickets.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
            <div className="flex items-center space-x-3">
              <AlertCircle className="w-8 h-8 text-red-400" />
              <div>
                <p className="text-white/70 text-sm">Открытых</p>
                <p className="text-white text-xl font-bold">
                  {tickets.filter(t => t.status === 'open').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
            <div className="flex items-center space-x-3">
              <Clock className="w-8 h-8 text-yellow-400" />
              <div>
                <p className="text-white/70 text-sm">В работе</p>
                <p className="text-white text-xl font-bold">
                  {tickets.filter(t => t.status === 'in_progress').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-8 h-8 text-green-400" />
              <div>
                <p className="text-white/70 text-sm">Решено</p>
                <p className="text-white text-xl font-bold">
                  {tickets.filter(t => t.status === 'resolved').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/50" />
                <input
                  type="text"
                  placeholder="Поиск тикетов..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="all">Все статусы</option>
                <option value="open">Открытые</option>
                <option value="in_progress">В работе</option>
                <option value="resolved">Решено</option>
                <option value="closed">Закрыто</option>
              </select>
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="all">Все приоритеты</option>
                <option value="urgent">Срочно</option>
                <option value="high">Высокий</option>
                <option value="medium">Средний</option>
                <option value="low">Низкий</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Tickets List */}
      <div className="px-4 pb-20">
        <div className="space-y-3">
          {filteredTickets.map((ticket) => (
            <motion.div
              key={ticket.id}
              whileHover={{ scale: 1.02 }}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-4 cursor-pointer hover:bg-white/20 transition-colors"
              onClick={() => setSelectedTicket(ticket)}
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-white font-medium">{ticket.subject}</h3>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(ticket.status)}`}>
                    {ticket.status === 'open' ? 'Открыт' :
                     ticket.status === 'in_progress' ? 'В работе' :
                     ticket.status === 'resolved' ? 'Решен' : 'Закрыт'}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(ticket.priority)}`}>
                    {ticket.priority === 'urgent' ? 'Срочно' :
                     ticket.priority === 'high' ? 'Высокий' :
                     ticket.priority === 'medium' ? 'Средний' : 'Низкий'}
                  </span>
                </div>
              </div>
              <p className="text-white/70 text-sm mb-2 line-clamp-2">
                {ticket.description}
              </p>
              <div className="flex items-center justify-between text-xs text-white/50">
                <span>ID: {ticket.id.slice(0, 8)}</span>
                <span>{new Date(ticket.created_at).toLocaleDateString('ru-RU')}</span>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredTickets.length === 0 && (
          <div className="text-center py-8">
            <MessageSquare className="w-16 h-16 text-white/30 mx-auto mb-4" />
            <p className="text-white/70">Тикетов не найдено</p>
          </div>
        )}
      </div>

      {/* Ticket Details Modal */}
      {selectedTicket && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedTicket(null)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Детали тикета</h2>
                <button
                  onClick={() => setSelectedTicket(null)}
                  className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{selectedTicket.subject}</h3>
                  <p className="text-gray-600">{selectedTicket.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Статус</label>
                    <select
                      value={selectedTicket.status}
                      onChange={(e) => handleStatusChange(selectedTicket.id, e.target.value as 'open' | 'in_progress' | 'resolved' | 'closed')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="open">Открыт</option>
                      <option value="in_progress">В работе</option>
                      <option value="resolved">Решен</option>
                      <option value="closed">Закрыт</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Приоритет</label>
                    <div className="px-3 py-2 bg-gray-100 rounded-lg">
                      {selectedTicket.priority === 'urgent' ? 'Срочно' :
                       selectedTicket.priority === 'high' ? 'Высокий' :
                       selectedTicket.priority === 'medium' ? 'Средний' : 'Низкий'}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Создан</label>
                    <div className="px-3 py-2 bg-gray-100 rounded-lg">
                      {new Date(selectedTicket.created_at).toLocaleString('ru-RU')}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Обновлен</label>
                    <div className="px-3 py-2 bg-gray-100 rounded-lg">
                      {new Date(selectedTicket.updated_at).toLocaleString('ru-RU')}
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <button className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-300 flex items-center justify-center space-x-2">
                    <Reply className="w-5 h-5" />
                    <span>Ответить пользователю</span>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}

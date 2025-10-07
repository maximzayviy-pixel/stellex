'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  MessageSquare, 
  X, 
  Plus,
  Clock,
  CheckCircle,
  AlertCircle,
  Eye,
  Send
} from 'lucide-react'

interface Ticket {
  id: string
  subject: string
  description: string
  status: 'open' | 'in_progress' | 'closed'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  category: string
  created_at: string
  updated_at: string
}

interface Message {
  id: string
  message: string
  is_from_support: boolean
  created_at: string
  user: {
    first_name: string
    last_name: string
    role: string
  }
}

interface UserTicketsModalProps {
  onClose: () => void
}

export default function UserTicketsModal({ onClose }: UserTicketsModalProps) {
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSending, setIsSending] = useState(false)
  const [showCreateTicket, setShowCreateTicket] = useState(false)

  useEffect(() => {
    loadTickets()
  }, [])

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
        setTickets(data.tickets)
      }
    } catch (error) {
      console.error('Error loading tickets:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const loadMessages = async (ticketId: string) => {
    try {
      const response = await fetch(`/api/support/messages?ticketId=${ticketId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setMessages(data.messages)
      }
    } catch (error) {
      console.error('Error loading messages:', error)
    }
  }

  const handleTicketClick = (ticket: Ticket) => {
    setSelectedTicket(ticket)
    loadMessages(ticket.id)
  }

  const handleSendMessage = async () => {
    if (!selectedTicket || !newMessage.trim()) return

    try {
      setIsSending(true)
      
      const response = await fetch('/api/support/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        },
        body: JSON.stringify({
          ticketId: selectedTicket.id,
          message: newMessage
        })
      })

      if (response.ok) {
        setNewMessage('')
        loadMessages(selectedTicket.id)
      } else {
        const errorData = await response.json()
        alert(`Ошибка: ${errorData.error}`)
      }
    } catch (error) {
      console.error('Error sending message:', error)
      alert('Ошибка отправки сообщения')
    } finally {
      setIsSending(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-yellow-500/20 text-yellow-400'
      case 'in_progress':
        return 'bg-blue-500/20 text-blue-400'
      case 'closed':
        return 'bg-green-500/20 text-green-400'
      default:
        return 'bg-gray-500/20 text-gray-400'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'open':
        return 'Открыта'
      case 'in_progress':
        return 'В работе'
      case 'closed':
        return 'Закрыта'
      default:
        return status
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'text-red-400'
      case 'high':
        return 'text-orange-400'
      case 'medium':
        return 'text-yellow-400'
      case 'low':
        return 'text-green-400'
      default:
        return 'text-gray-400'
    }
  }

  if (showCreateTicket) {
    return (
      <SupportTicketModal
        onClose={() => setShowCreateTicket(false)}
        onTicketCreated={() => {
          setShowCreateTicket(false)
          loadTickets()
        }}
      />
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 w-full max-w-6xl max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Мои заявки</h2>
                <p className="text-white/70">Управление заявками в поддержку</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowCreateTicket(true)}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-all flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Новая заявка</span>
              </button>
              <button
                onClick={onClose}
                className="text-white/50 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>

        <div className="flex h-[60vh]">
          {/* Tickets List */}
          <div className="w-1/3 border-r border-white/10 p-4 overflow-y-auto">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
              </div>
            ) : tickets.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageSquare className="w-8 h-8 text-white/50" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Нет заявок</h3>
                <p className="text-white/70">Создайте первую заявку в поддержку</p>
              </div>
            ) : (
              <div className="space-y-3">
                {tickets.map((ticket) => (
                  <div
                    key={ticket.id}
                    onClick={() => handleTicketClick(ticket)}
                    className={`p-4 rounded-lg border cursor-pointer transition-all ${
                      selectedTicket?.id === ticket.id
                        ? 'bg-purple-500/20 border-purple-500/30'
                        : 'bg-white/5 border-white/10 hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="text-white font-medium text-sm line-clamp-2">
                        {ticket.subject}
                      </h4>
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(ticket.status)}`}>
                        {getStatusLabel(ticket.status)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-white/50">
                      <span className={getPriorityColor(ticket.priority)}>
                        {ticket.priority.toUpperCase()}
                      </span>
                      <span>{new Date(ticket.created_at).toLocaleDateString('ru-RU')}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Messages */}
          <div className="flex-1 flex flex-col">
            {selectedTicket ? (
              <>
                {/* Ticket Header */}
                <div className="p-4 border-b border-white/10">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-white">{selectedTicket.subject}</h3>
                      <div className="flex items-center space-x-4 mt-1">
                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(selectedTicket.status)}`}>
                          {getStatusLabel(selectedTicket.status)}
                        </span>
                        <span className={`text-xs ${getPriorityColor(selectedTicket.priority)}`}>
                          {selectedTicket.priority.toUpperCase()}
                        </span>
                        <span className="text-xs text-white/50">
                          {new Date(selectedTicket.created_at).toLocaleString('ru-RU')}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 p-4 overflow-y-auto space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.is_from_support ? 'justify-start' : 'justify-end'}`}
                    >
                      <div
                        className={`max-w-[70%] p-3 rounded-lg ${
                          message.is_from_support
                            ? 'bg-white/5 text-white'
                            : 'bg-purple-600 text-white'
                        }`}
                      >
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="text-xs font-medium">
                            {message.is_from_support ? 'Поддержка' : 'Вы'}
                          </span>
                          <span className="text-xs opacity-70">
                            {new Date(message.created_at).toLocaleString('ru-RU')}
                          </span>
                        </div>
                        <p className="text-sm">{message.message}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Message Input */}
                {selectedTicket.status !== 'closed' && (
                  <div className="p-4 border-t border-white/10">
                    <div className="flex space-x-3">
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Введите сообщение..."
                        className="flex-1 bg-white/5 border border-white/20 rounded-lg py-3 px-4 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      />
                      <button
                        onClick={handleSendMessage}
                        disabled={isSending || !newMessage.trim()}
                        className="bg-purple-600 text-white px-4 py-3 rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-all flex items-center space-x-2"
                      >
                        {isSending ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        ) : (
                          <Send className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Eye className="w-8 h-8 text-white/50" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">Выберите заявку</h3>
                  <p className="text-white/70">Выберите заявку из списка для просмотра сообщений</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

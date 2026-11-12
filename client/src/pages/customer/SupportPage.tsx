import React, { useState, useEffect } from 'react';
import { HelpCircle, MessageSquare, Send, CheckCircle2, Clock, Plus, ChevronDown } from 'lucide-react';
import api from '../../services/api.ts';
import { SupportTicket } from '../../types/index.ts';
import { useNotifications } from '../../context/NotificationContext.tsx';

export const SupportPage: React.FC = () => {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [replyMessage, setReplyMessage] = useState('');
  const [loading, setLoading] = useState(true);

  // New Ticket Form state
  const [category, setCategory] = useState('Order Issue');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [orderId, setOrderId] = useState('');

  const { addToast } = useNotifications();

  const faqs = [
    { q: 'How does live order state tracking work?', a: 'CraveX uses an 8-state state machine updated by restaurants and riders in real time via Socket.IO.' },
    { q: 'What is the 4-digit Delivery OTP?', a: 'For maximum delivery security, your delivery partner must verify the 4-digit code shown on your tracking screen before marking the order delivered.' },
    { q: 'How do I earn CravePoints?', a: 'You earn 1 CravePoint for every ₹10 spent, plus bonus points for exploring new cuisines and completing foodie challenges!' },
    { q: 'How can multiple friends contribute in Group Order?', a: 'Click Group Dine on any restaurant page to create a room. Send the 6-character room code to friends so everyone can add their items into a single synchronized tray!' },
  ];

  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const fetchTickets = async () => {
    try {
      const res = await api.getMyTickets();
      if (res.success) {
        setTickets(res.tickets || []);
        if (res.tickets?.length && !selectedTicket) {
          setSelectedTicket(res.tickets[0]);
        }
      }
    } catch (err) {
      console.error('Failed to load tickets:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !description.trim()) return;

    try {
      const res = await api.createSupportTicket({
        category,
        subject,
        description,
        orderId: orderId.trim() || undefined,
      });

      if (res.success) {
        setShowCreateModal(false);
        setSubject('');
        setDescription('');
        setOrderId('');
        addToast('Support Ticket Created! 🎫', `Ticket #${res.ticket.ticketId} assigned to care desk.`, 'success');
        fetchTickets();
      }
    } catch (err: any) {
      addToast('Error', err.message || 'Failed to submit ticket', 'error');
    }
  };

  const handleSendReply = async () => {
    if (!selectedTicket || !replyMessage.trim()) return;

    try {
      const res = await api.replyToTicket(selectedTicket._id, replyMessage.trim());
      if (res.success) {
        setSelectedTicket(res.ticket);
        setReplyMessage('');
        fetchTickets();
      }
    } catch (err) {
      // ignore
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-screen">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-charcoal-900 dark:text-white">
            24/7 CraveX Help & Support Desk
          </h1>
          <p className="text-xs text-charcoal-500 dark:text-gray-400 mt-1">
            We are always here to make sure your dining experience is completely effortless
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-5 py-2.5 rounded-2xl bg-primary text-white font-bold text-xs flex items-center gap-1.5 hover:bg-primary-600 shadow-md transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Support Ticket</span>
        </button>
      </div>

      {/* FAQs Section */}
      <div className="mb-12 bg-white dark:bg-charcoal-800 rounded-3xl p-6 border border-orange-100 dark:border-charcoal-700 shadow-soft">
        <h3 className="font-display font-bold text-sm text-charcoal-900 dark:text-white mb-4 flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-primary" />
          <span>Frequently Asked Questions</span>
        </h3>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="rounded-2xl border border-gray-100 dark:border-charcoal-700 overflow-hidden"
            >
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full p-4 text-left font-bold text-xs text-charcoal-800 dark:text-white flex items-center justify-between hover:bg-orange-50/50 dark:hover:bg-charcoal-750 transition-colors"
              >
                <span>{faq.q}</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${openFaq === i ? 'rotate-180' : ''}`} />
              </button>
              {openFaq === i && (
                <div className="p-4 pt-0 text-xs text-charcoal-600 dark:text-gray-300 bg-orange-50/30 dark:bg-charcoal-750/50 leading-relaxed">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Tickets & Thread Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Ticket List */}
        <div className="lg:col-span-5 bg-white dark:bg-charcoal-800 rounded-3xl p-6 border border-orange-100 dark:border-charcoal-700 shadow-soft">
          <h3 className="font-display font-bold text-sm text-charcoal-900 dark:text-white mb-4">
            My Support Tickets ({tickets.length})
          </h3>

          {tickets.length === 0 ? (
            <p className="text-xs text-gray-400 py-6 text-center">No open tickets. Everything looks pristine!</p>
          ) : (
            <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1">
              {tickets.map((t) => {
                const isSelected = selectedTicket?._id === t._id;
                return (
                  <button
                    key={t._id}
                    onClick={() => setSelectedTicket(t)}
                    className={`w-full p-4 rounded-2xl border text-left transition-all ${
                      isSelected
                        ? 'border-primary bg-orange-50/70 dark:bg-charcoal-700 shadow-sm'
                        : 'border-gray-200 dark:border-charcoal-700 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono font-bold text-[11px] text-primary">#{t.ticketId}</span>
                      <span
                        className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                          t.status === 'RESOLVED'
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                            : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                        }`}
                      >
                        {t.status}
                      </span>
                    </div>
                    <p className="font-bold text-xs text-charcoal-800 dark:text-white truncate">{t.subject}</p>
                    <p className="text-[10px] text-gray-400 mt-1">{t.category} • {new Date(t.createdAt).toLocaleDateString()}</p>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Selected Ticket Conversation Thread */}
        <div className="lg:col-span-7 bg-white dark:bg-charcoal-800 rounded-3xl p-6 border border-orange-100 dark:border-charcoal-700 shadow-soft min-h-[480px] flex flex-col justify-between">
          {selectedTicket ? (
            <>
              <div>
                <div className="pb-4 mb-4 border-b border-gray-100 dark:border-charcoal-700 flex items-center justify-between">
                  <div>
                    <span className="font-mono text-xs font-bold text-primary">#{selectedTicket.ticketId}</span>
                    <h3 className="font-display font-extrabold text-base text-charcoal-900 dark:text-white mt-0.5">
                      {selectedTicket.subject}
                    </h3>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-orange-100 dark:bg-charcoal-700 text-primary uppercase">
                    {selectedTicket.category}
                  </span>
                </div>

                {/* Messages Feed */}
                <div className="space-y-3 max-h-[320px] overflow-y-auto pr-1">
                  {(selectedTicket.messages || []).map((msg) => (
                    <div
                      key={msg.id}
                      className={`p-3.5 rounded-2xl text-xs max-w-[85%] leading-relaxed ${
                        msg.sender === 'customer'
                          ? 'ml-auto bg-primary text-white rounded-br-none'
                          : 'bg-gray-100 dark:bg-charcoal-700 text-charcoal-800 dark:text-gray-100 rounded-bl-none'
                      }`}
                    >
                      <p className="font-semibold text-[10px] opacity-80 mb-1">{msg.senderName}</p>
                      <p>{msg.text}</p>
                      <span className="text-[9px] opacity-70 block text-right mt-1">
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Reply Box */}
              <div className="pt-4 border-t border-gray-100 dark:border-charcoal-700 flex gap-2">
                <input
                  type="text"
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendReply()}
                  placeholder="Type your message to support desk..."
                  className="flex-grow px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-charcoal-700 border border-gray-200 dark:border-charcoal-600 text-xs focus:outline-none focus:border-primary"
                />
                <button
                  onClick={handleSendReply}
                  disabled={!replyMessage.trim()}
                  className="px-4 py-2.5 rounded-xl bg-primary text-white hover:bg-primary-600 disabled:opacity-40 transition-colors shadow-sm"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center text-gray-400 py-24">
              <MessageSquare className="w-12 h-12 mb-3 opacity-40" />
              <p className="text-xs">Select or create a ticket to start conversing with support agents</p>
            </div>
          )}
        </div>
      </div>

      {/* New Ticket Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white dark:bg-charcoal-800 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-orange-100 dark:border-charcoal-700">
            <h3 className="font-display font-bold text-base text-charcoal-900 dark:text-white mb-4">
              Create Support Ticket
            </h3>
            <form onSubmit={handleCreateTicket} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Issue Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-xl bg-gray-50 dark:bg-charcoal-900 border border-gray-200 dark:border-charcoal-700"
                >
                  <option value="Order Issue">Order Issue (Missing item, cold food)</option>
                  <option value="Delivery Delay">Delivery Delay</option>
                  <option value="Payment / Refund">Payment / Refund Query</option>
                  <option value="App Feedback">App Feedback & Suggestions</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Order ID (Optional)</label>
                <input
                  type="text"
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  placeholder="e.g. ord-1001"
                  className="w-full text-xs px-3 py-2 rounded-xl bg-gray-50 dark:bg-charcoal-900 border border-gray-200 dark:border-charcoal-700"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Subject</label>
                <input
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Brief summary of your inquiry"
                  className="w-full text-xs px-3 py-2 rounded-xl bg-gray-50 dark:bg-charcoal-900 border border-gray-200 dark:border-charcoal-700"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Description</label>
                <textarea
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Provide details so our team can resolve immediately..."
                  rows={3}
                  className="w-full text-xs p-3 rounded-xl bg-gray-50 dark:bg-charcoal-900 border border-gray-200 dark:border-charcoal-700 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-gray-500 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-600 shadow-md"
                >
                  Submit Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SupportPage;

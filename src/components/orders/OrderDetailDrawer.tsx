'use client';

import React, { useState } from 'react';
import { 
  X, 
  Clock, 
  Truck, 
  CreditCard, 
  User, 
  MapPin, 
  Package, 
  Mail, 
  FileEdit, 
  Send, 
  AlertTriangle, 
  ShieldAlert, 
  CheckCircle2, 
  ExternalLink,
  MessageSquare
} from 'lucide-react';
import { MarketplaceBadge, OrderStatusBadge, PaymentStatusBadge } from '@/components/common/Badges';
import { Order, InternalOrderStatus } from '@/types';

interface OrderDetailDrawerProps {
  order: Order | null;
  onClose: () => void;
  onUpdateStatus: (orderId: string, status: InternalOrderStatus) => Promise<void>;
  onAddNote: (orderId: string, content: string) => Promise<void>;
  onOpenManualCorrection: (order: Order) => void;
}

export function OrderDetailDrawer({
  order,
  onClose,
  onUpdateStatus,
  onAddNote,
  onOpenManualCorrection,
}: OrderDetailDrawerProps) {
  const [newNote, setNewNote] = useState('');
  const [isSubmittingNote, setIsSubmittingNote] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<InternalOrderStatus>(order?.internalStatus || 'CONFIRMED');
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [showRawEmail, setShowRawEmail] = useState(false);

  if (!order) return null;

  const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const nextStatus = e.target.value as InternalOrderStatus;
    setSelectedStatus(nextStatus);
    setIsUpdatingStatus(true);
    await onUpdateStatus(order.id, nextStatus);
    setIsUpdatingStatus(false);
  };

  const handleNoteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    setIsSubmittingNote(true);
    await onAddNote(order.id, newNote.trim());
    setNewNote('');
    setIsSubmittingNote(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity" 
        onClick={onClose} 
      />

      {/* Drawer content */}
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 h-full shadow-2xl flex flex-col z-10 border-l border-slate-200 dark:border-slate-800 animate-in slide-in-from-right duration-200">
        {/* Drawer Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/40">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-slate-900 dark:text-white">
                {order.orderNumber}
              </span>
              <MarketplaceBadge marketplace={order.marketplace} />
              {order.isManualCorrection && (
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                  Manual Correction Applied
                </span>
              )}
            </div>
            <div className="text-xs text-slate-500 font-mono flex items-center gap-2">
              <span>Channel ID: {order.marketplaceOrderId}</span>
              <span>•</span>
              <span>{new Date(order.orderDate).toLocaleString('en-IN')}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onOpenManualCorrection(order)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 transition"
            >
              <FileEdit className="w-3.5 h-3.5" />
              <span>Manual Correction</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6 text-xs text-slate-700 dark:text-slate-300">
          
          {/* Status & Processing Card */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-slate-500 text-[11px] block mb-0.5 font-medium">Internal Processing Status:</span>
                <OrderStatusBadge status={order.internalStatus} />
              </div>
              <div className="flex items-center gap-2">
                <label className="text-[11px] font-medium text-slate-600 dark:text-slate-400">Change Status:</label>
                <select
                  value={selectedStatus}
                  onChange={handleStatusChange}
                  disabled={isUpdatingStatus}
                  className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="PENDING">PENDING</option>
                  <option value="CONFIRMED">CONFIRMED</option>
                  <option value="PROCESSING">PROCESSING</option>
                  <option value="PACKED">PACKED</option>
                  <option value="SHIPPED">SHIPPED</option>
                  <option value="OUT_FOR_DELIVERY">OUT_FOR_DELIVERY</option>
                  <option value="DELIVERED">DELIVERED</option>
                  <option value="CANCELLED">CANCELLED</option>
                  <option value="RETURNED">RETURNED</option>
                  <option value="REFUNDED">REFUNDED</option>
                </select>
              </div>
            </div>

            {/* Crucial Sync Disclaimer Rule */}
            <div className="p-2.5 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 text-[11px] text-amber-800 dark:text-amber-300 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5 text-amber-600" />
              <div>
                <strong>Operational Notice:</strong> Updating internal processing status helps your warehouse and fulfillment teams coordinate, but <em>does not automatically mutate the live order on {order.marketplace}</em> without authorized marketplace API writeback permissions.
              </div>
            </div>
          </div>

          {/* Missing / Unknown fields alert */}
          {order.unknownFields && order.unknownFields.length > 0 && (
            <div className="p-3 rounded-xl bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-800 text-orange-900 dark:text-orange-200 flex items-start justify-between gap-3">
              <div className="flex items-start gap-2">
                <ShieldAlert className="w-4 h-4 text-orange-600 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold">Unextracted / Missing Fields: </span>
                  <span>{order.unknownFields.join(', ')}.</span>
                  <p className="text-[11px] text-orange-700 dark:text-orange-300 mt-0.5">
                    The source notification email did not provide full data for these fields. You can complete them using Manual Correction.
                  </p>
                </div>
              </div>
              <button
                onClick={() => onOpenManualCorrection(order)}
                className="px-2 py-1 text-[11px] font-semibold bg-orange-600 text-white rounded hover:bg-orange-700 flex-shrink-0"
              >
                Fix Fields
              </button>
            </div>
          )}

          {/* Line Items */}
          <div className="space-y-3">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
              <Package className="w-4 h-4 text-indigo-600" />
              <span>Ordered Items ({order.items.length})</span>
            </h3>
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 divide-y divide-slate-100 dark:divide-slate-800 overflow-hidden">
              {order.items.map(item => (
                <div key={item.id} className="p-3 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={item.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=120'}
                      alt={item.name}
                      className="w-12 h-12 rounded-lg object-cover bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex-shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="font-semibold text-slate-900 dark:text-white truncate">
                        {item.name}
                      </div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                        <span className="font-mono">SKU: {item.sku}</span>
                        <span>•</span>
                        <span>Qty: {item.quantity}</span>
                        <span>•</span>
                        <span>Unit: ₹{item.unitPrice.toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0 font-bold text-slate-900 dark:text-white">
                    ₹{item.totalPrice.toLocaleString('en-IN')}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Financial Breakdown & Payment */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2 bg-slate-50/50 dark:bg-slate-800/30">
              <h4 className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                <CreditCard className="w-4 h-4 text-indigo-600" />
                <span>Payment Information</span>
              </h4>
              <div className="space-y-1.5 pt-1">
                <div className="flex justify-between">
                  <span className="text-slate-500">Method:</span>
                  <span className="font-medium text-slate-900 dark:text-white">{order.paymentMethod}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Payment Status:</span>
                  <PaymentStatusBadge status={order.paymentStatus} />
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Subtotal:</span>
                  <span>₹{order.subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Tax (GST):</span>
                  <span>₹{order.tax.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between pt-1 border-t border-slate-200 dark:border-slate-700 font-bold text-slate-900 dark:text-white">
                  <span>Grand Total:</span>
                  <span>₹{order.totalAmount.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            {/* Customer & Shipping */}
            <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2 bg-slate-50/50 dark:bg-slate-800/30">
              <h4 className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-indigo-600" />
                <span>Shipping Address</span>
              </h4>
              <div className="space-y-1 pt-1 leading-relaxed">
                <div className="font-semibold text-slate-900 dark:text-white">{order.customer.name}</div>
                {order.customer.phone && <div className="text-slate-600 dark:text-slate-400">Phone: {order.customer.phone}</div>}
                {order.customer.email && <div className="text-slate-600 dark:text-slate-400">Email: {order.customer.email}</div>}
                <div className="text-slate-600 dark:text-slate-400 mt-1">
                  {order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.postalCode}, {order.shippingAddress.country}
                </div>
                <div className="pt-2 text-[11px] text-slate-500 flex items-center justify-between border-t border-slate-200 dark:border-slate-700 mt-2">
                  <span>Courier: {order.courierPartner || 'Assigning courier'}</span>
                  <span>Track: {order.trackingNumber || 'Pending'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Original Gmail Notification Preview */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Mail className="w-4 h-4 text-indigo-600" />
                <span>Source Gmail Notification</span>
              </h4>
              <button
                onClick={() => setShowRawEmail(!showRawEmail)}
                className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                {showRawEmail ? 'Hide snippet' : 'View email body'}
              </button>
            </div>
            <div className="text-xs text-slate-600 dark:text-slate-400">
              <span className="font-semibold">Subject:</span> {order.rawEmailSubject || `Order Confirmation - ${order.marketplaceOrderId}`}
            </div>
            {showRawEmail && (
              <pre className="p-3 rounded-lg bg-slate-900 text-slate-200 text-[11px] font-mono whitespace-pre-wrap max-h-48 overflow-y-auto">
                {order.rawEmailSnippet || 'Original RFC822 email payload extracted via Google OAuth 2.0 and processed by OmniCommerce Regex Parser.'}
              </pre>
            )}
          </div>

          {/* Order Timeline */}
          <div className="space-y-3">
            <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-indigo-600" />
              <span>Order Lifecycle Timeline</span>
            </h4>
            <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
              {order.timeline.map((event, i) => (
                <div key={event.id || i} className="relative">
                  <span className="absolute -left-6 top-1 w-3 h-3 rounded-full bg-indigo-600 ring-4 ring-white dark:ring-slate-900" />
                  <div className="font-semibold text-slate-900 dark:text-white">{event.title}</div>
                  <div className="text-[11px] text-slate-500 leading-snug">{event.description}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    {new Date(event.timestamp).toLocaleString('en-IN')} {event.actor ? `• By ${event.actor}` : ''}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Internal Staff Notes */}
          <div className="space-y-3 pt-2">
            <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
              <MessageSquare className="w-4 h-4 text-indigo-600" />
              <span>Internal Staff Notes ({order.notes.length})</span>
            </h4>

            {/* Note form */}
            <form onSubmit={handleNoteSubmit} className="flex gap-2">
              <input
                type="text"
                placeholder="Add internal note for warehouse or customer care..."
                value={newNote}
                onChange={e => setNewNote(e.target.value)}
                className="flex-1 px-3 py-1.5 rounded-lg text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="submit"
                disabled={isSubmittingNote || !newNote.trim()}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 flex items-center gap-1"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Add Note</span>
              </button>
            </form>

            <div className="space-y-2">
              {order.notes.map(note => (
                <div key={note.id} className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-xs">
                  <div className="flex justify-between items-center text-[10px] text-slate-400 mb-1">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">{note.author} ({note.authorRole})</span>
                    <span>{new Date(note.createdAt).toLocaleString('en-IN')}</span>
                  </div>
                  <div className="text-slate-800 dark:text-slate-200">{note.content}</div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

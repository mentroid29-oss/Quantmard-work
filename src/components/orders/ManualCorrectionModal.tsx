'use client';

import React, { useState } from 'react';
import { X, Check, AlertTriangle, ShieldCheck } from 'lucide-react';
import { Order } from '@/types';

interface ManualCorrectionModalProps {
  order: Order;
  isOpen: boolean;
  onClose: () => void;
  onSave: (orderId: string, updates: Partial<Order>) => Promise<void>;
}

export function ManualCorrectionModal({
  order,
  isOpen,
  onClose,
  onSave,
}: ManualCorrectionModalProps) {
  const [formData, setFormData] = useState({
    customerName: order.customer.name || '',
    customerEmail: order.customer.email || '',
    customerPhone: order.customer.phone || '',
    street: order.shippingAddress.street || '',
    city: order.shippingAddress.city || '',
    state: order.shippingAddress.state || '',
    postalCode: order.shippingAddress.postalCode || '',
    sku: order.items[0]?.sku || '',
    productName: order.items[0]?.name || '',
    quantity: order.items[0]?.quantity || 1,
    unitPrice: order.items[0]?.unitPrice || order.totalAmount,
    courierPartner: order.courierPartner || '',
    trackingNumber: order.trackingNumber || '',
    paymentMethod: order.paymentMethod || 'Prepaid',
  });
  const [isSaving, setIsSaving] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const updatedTotal = Number(formData.quantity) * Number(formData.unitPrice);
      const updates: Partial<Order> = {
        customer: {
          ...order.customer,
          name: formData.customerName,
          email: formData.customerEmail,
          phone: formData.customerPhone,
        },
        shippingAddress: {
          ...order.shippingAddress,
          street: formData.street,
          city: formData.city,
          state: formData.state,
          postalCode: formData.postalCode,
        },
        items: [
          {
            ...(order.items[0] || { id: 'item-1' }),
            sku: formData.sku,
            name: formData.productName,
            quantity: Number(formData.quantity),
            unitPrice: Number(formData.unitPrice),
            totalPrice: updatedTotal,
          }
        ],
        subtotal: updatedTotal,
        totalAmount: updatedTotal,
        courierPartner: formData.courierPartner,
        trackingNumber: formData.trackingNumber,
        paymentMethod: formData.paymentMethod,
        isManualCorrection: true,
        unknownFields: [], // Cleared once manual corrections are saved!
      };

      await onSave(order.id, updates);
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 z-10 animate-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>Manual Field Correction</span>
              <span className="text-xs font-mono font-normal text-slate-500">({order.orderNumber})</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Refine or complete fields where the email provider omitted specific details.
            </p>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-xs">
          {/* Customer Details */}
          <div>
            <div className="font-semibold text-slate-900 dark:text-white mb-2">Customer & Contact Information</div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">Customer Name</label>
                <input
                  type="text"
                  required
                  value={formData.customerName}
                  onChange={e => setFormData({ ...formData, customerName: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">Customer Email</label>
                <input
                  type="email"
                  value={formData.customerEmail}
                  onChange={e => setFormData({ ...formData, customerEmail: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">Phone Number</label>
                <input
                  type="text"
                  value={formData.customerPhone}
                  onChange={e => setFormData({ ...formData, customerPhone: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div>
            <div className="font-semibold text-slate-900 dark:text-white mb-2">Shipping & Delivery Destination</div>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">Street Address</label>
                <input
                  type="text"
                  required
                  value={formData.street}
                  onChange={e => setFormData({ ...formData, street: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">City</label>
                <input
                  type="text"
                  required
                  value={formData.city}
                  onChange={e => setFormData({ ...formData, city: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">PIN / Postal Code</label>
                <input
                  type="text"
                  required
                  value={formData.postalCode}
                  onChange={e => setFormData({ ...formData, postalCode: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Product & SKU */}
          <div>
            <div className="font-semibold text-slate-900 dark:text-white mb-2">Product & SKU Details</div>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">Product Title</label>
                <input
                  type="text"
                  required
                  value={formData.productName}
                  onChange={e => setFormData({ ...formData, productName: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">Master SKU</label>
                <input
                  type="text"
                  required
                  value={formData.sku}
                  onChange={e => setFormData({ ...formData, sku: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">Unit Price (₹)</label>
                <input
                  type="number"
                  required
                  value={formData.unitPrice}
                  onChange={e => setFormData({ ...formData, unitPrice: Number(e.target.value) })}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Logistics & Payment */}
          <div>
            <div className="font-semibold text-slate-900 dark:text-white mb-2">Logistics & Tracking</div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">Courier Partner</label>
                <input
                  type="text"
                  placeholder="e.g. Delhivery, Ekart, ATS"
                  value={formData.courierPartner}
                  onChange={e => setFormData({ ...formData, courierPartner: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">AWB / Tracking Number</label>
                <input
                  type="text"
                  placeholder="e.g. DLV8492019"
                  value={formData.trackingNumber}
                  onChange={e => setFormData({ ...formData, trackingNumber: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">Payment Method</label>
                <input
                  type="text"
                  value={formData.paymentMethod}
                  onChange={e => setFormData({ ...formData, paymentMethod: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Action Footer */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-4 py-2 rounded-lg text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm transition disabled:opacity-50 flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>{isSaving ? 'Saving Changes...' : 'Save Manual Corrections'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

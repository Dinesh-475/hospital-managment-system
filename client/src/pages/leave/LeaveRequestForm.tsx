import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Upload, Send, X } from 'lucide-react';
import { LeaveType, LeaveBalance } from '@/types/leave';
import { submitLeaveRequest, getLeaveBalance, calculateLeaveDays } from '@/services/leaveApi';
import { toast } from 'sonner';

const LEAVE_TYPES: { value: LeaveType; label: string; color: string }[] = [
  { value: 'sick', label: 'Sick Leave', color: 'bg-red-100 text-red-800' },
  { value: 'vacation', label: 'Vacation', color: 'bg-blue-100 text-blue-800' },
  { value: 'personal', label: 'Personal Leave', color: 'bg-purple-100 text-purple-800' },
  { value: 'emergency', label: 'Emergency Leave', color: 'bg-orange-100 text-orange-800' },
  { value: 'unpaid', label: 'Unpaid Leave', color: 'bg-gray-100 text-gray-800' }
];

export const LeaveRequestForm: React.FC = () => {
  const [leaveType, setLeaveType] = useState<LeaveType>('vacation');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');
  const [documents, setDocuments] = useState<File[]>([]);
  const [balance, setBalance] = useState<LeaveBalance | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadBalance();
  }, []);

  const loadBalance = async () => {
    const data = await getLeaveBalance();
    setBalance(data);
  };

  const numberOfDays = startDate && endDate
    ? calculateLeaveDays(new Date(startDate), new Date(endDate))
    : 0;

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setDocuments(prev => [...prev, ...files]);
  };

  const removeDocument = (index: number) => {
    setDocuments(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!startDate || !endDate || !reason.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (new Date(startDate) > new Date(endDate)) {
      toast.error('End date must be after start date');
      return;
    }

    setIsSubmitting(true);

    try {
      await submitLeaveRequest(
        leaveType,
        new Date(startDate),
        new Date(endDate),
        reason,
        documents.length > 0 ? documents : undefined
      );

      toast.success('Leave request submitted successfully!', {
        description: 'Your manager will review your request soon.'
      });

      // Reset form
      setLeaveType('vacation');
      setStartDate('');
      setEndDate('');
      setReason('');
      setDocuments([]);
      loadBalance();
    } catch {
      toast.error('Failed to submit leave request');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-purple-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Request Leave</h1>
          <p className="text-gray-600 mt-1">Submit a new leave request for approval</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Leave Balance Card */}
          {balance && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="lg:col-span-1 bg-white rounded-2xl shadow-lg p-6"
            >
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Leave Balance</h2>
              
              {/* Circular Progress */}
              <div className="relative w-32 h-32 mx-auto mb-4">
                <svg className="transform -rotate-90 w-32 h-32">
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="#e5e7eb"
                    strokeWidth="12"
                    fill="none"
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="#3b82f6"
                    strokeWidth="12"
                    fill="none"
                    strokeDasharray={`${(balance.remainingLeave / balance.totalAnnualLeave) * 351.86} 351.86`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-bold text-gray-900">{balance.remainingLeave}</span>
                  <span className="text-xs text-gray-500">days left</span>
                </div>
              </div>

              {/* Stats */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Total</span>
                  <span className="font-semibold">{balance.totalAnnualLeave} days</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Used</span>
                  <span className="font-semibold text-red-600">{balance.usedLeave} days</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Pending</span>
                  <span className="font-semibold text-orange-600">{balance.pendingLeave} days</span>
                </div>
              </div>
            </motion.div>
          )}

          {/* Request Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-8"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Leave Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Leave Type *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {LEAVE_TYPES.map((type) => (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() => setLeaveType(type.value)}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        leaveType === type.value
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${type.color}`}>
                        {type.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Date Range */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Date *
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Date *
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      min={startDate || new Date().toISOString().split('T')[0]}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Number of Days */}
              {numberOfDays > 0 && (
                <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-900">
                    <span className="font-semibold">Total Days:</span> {numberOfDays} day{numberOfDays > 1 ? 's' : ''}
                  </p>
                </div>
              )}

              {/* Reason */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason *
                </label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  rows={4}
                  placeholder="Please provide a reason for your leave request..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  required
                />
              </div>

              {/* Supporting Documents */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Supporting Documents (Optional)
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 mb-2">
                    Upload medical certificates or other supporting documents
                  </p>
                  <input
                    type="file"
                    onChange={handleFileSelect}
                    multiple
                    accept=".pdf,.jpg,.jpeg,.png"
                    className="hidden"
                    id="file-upload"
                  />
                  <label
                    htmlFor="file-upload"
                    className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-colors"
                  >
                    Choose Files
                  </label>
                  <p className="text-xs text-gray-500 mt-2">PDF, JPG, PNG (max 5MB each)</p>
                </div>

                {/* Document List */}
                {documents.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {documents.map((doc, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between bg-gray-50 p-3 rounded-lg"
                      >
                        <span className="text-sm text-gray-700 truncate">{doc.name}</span>
                        <button
                          type="button"
                          onClick={() => removeDocument(index)}
                          className="p-1 hover:bg-gray-200 rounded transition-colors"
                        >
                          <X className="w-4 h-4 text-gray-600" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Submit Request
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

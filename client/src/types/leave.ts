export type LeaveType = 'sick' | 'vacation' | 'personal' | 'emergency' | 'unpaid';
export type LeaveStatus = 'pending' | 'approved' | 'rejected' | 'cancelled';

export interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeRole: string;
  employeeAvatar?: string;
  leaveType: LeaveType;
  startDate: Date;
  endDate: Date;
  numberOfDays: number;
  reason: string;
  supportingDocuments?: {
    name: string;
    url: string;
    size: number;
  }[];
  status: LeaveStatus;
  approvedBy?: string;
  approverName?: string;
  approvalDate?: Date;
  rejectionReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface LeaveBalance {
  employeeId: string;
  totalAnnualLeave: number;
  usedLeave: number;
  remainingLeave: number;
  pendingLeave: number;
  leaveByType: {
    sick: { total: number; used: number };
    vacation: { total: number; used: number };
    personal: { total: number; used: number };
    emergency: { total: number; used: number };
  };
}

export interface LeaveCalendarEvent {
  id: string;
  employeeId: string;
  employeeName: string;
  leaveType: LeaveType;
  startDate: Date;
  endDate: Date;
  status: LeaveStatus;
}

export interface LeavePolicy {
  annualLeaveQuota: number;
  sickLeaveQuota: number;
  personalLeaveQuota: number;
  emergencyLeaveQuota: number;
  maxConsecutiveDays: number;
  minAdvanceNoticeDays: number;
  carryOverAllowed: boolean;
  maxCarryOverDays: number;
}

export interface LeaveStatistics {
  totalRequests: number;
  pendingRequests: number;
  approvedRequests: number;
  rejectedRequests: number;
  averageApprovalTime: number; // in hours
  mostCommonLeaveType: LeaveType;
  peakLeaveMonths: string[];
}

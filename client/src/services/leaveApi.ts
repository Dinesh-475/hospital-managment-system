import { LeaveRequest, LeaveBalance, LeaveCalendarEvent, LeaveType } from '@/types/leave';

// Mock leave requests
const mockLeaveRequests: LeaveRequest[] = [
  {
    id: 'leave-1',
    employeeId: 'user-1',
    employeeName: 'Dr. Sarah Johnson',
    employeeRole: 'Doctor',
    employeeAvatar: 'https://i.pravatar.cc/150?img=1',
    leaveType: 'vacation',
    startDate: new Date('2026-02-15'),
    endDate: new Date('2026-02-20'),
    numberOfDays: 6,
    reason: 'Family vacation to Europe',
    status: 'pending',
    createdAt: new Date(Date.now() - 86400000),
    updatedAt: new Date(Date.now() - 86400000)
  },
  {
    id: 'leave-2',
    employeeId: 'user-2',
    employeeName: 'Nurse Emily Chen',
    employeeRole: 'Nurse',
    employeeAvatar: 'https://i.pravatar.cc/150?img=5',
    leaveType: 'sick',
    startDate: new Date('2026-01-20'),
    endDate: new Date('2026-01-22'),
    numberOfDays: 3,
    reason: 'Flu and fever',
    supportingDocuments: [{
      name: 'medical_certificate.pdf',
      url: '/mock/medical_cert.pdf',
      size: 512000
    }],
    status: 'approved',
    approvedBy: 'user-4',
    approverName: 'Admin John Smith',
    approvalDate: new Date('2026-01-19'),
    createdAt: new Date('2026-01-18'),
    updatedAt: new Date('2026-01-19')
  },
  {
    id: 'leave-3',
    employeeId: 'user-3',
    employeeName: 'Dr. Michael Brown',
    employeeRole: 'Doctor',
    employeeAvatar: 'https://i.pravatar.cc/150?img=12',
    leaveType: 'personal',
    startDate: new Date('2026-01-25'),
    endDate: new Date('2026-01-25'),
    numberOfDays: 1,
    reason: 'Personal appointment',
    status: 'rejected',
    approvedBy: 'user-4',
    approverName: 'Admin John Smith',
    approvalDate: new Date('2026-01-24'),
    rejectionReason: 'Insufficient staff coverage on that day',
    createdAt: new Date('2026-01-23'),
    updatedAt: new Date('2026-01-24')
  }
];

// Mock leave balance
const mockLeaveBalance: LeaveBalance = {
  employeeId: 'current-user',
  totalAnnualLeave: 20,
  usedLeave: 8,
  remainingLeave: 12,
  pendingLeave: 3,
  leaveByType: {
    sick: { total: 10, used: 2 },
    vacation: { total: 15, used: 5 },
    personal: { total: 5, used: 1 },
    emergency: { total: 3, used: 0 }
  }
};

export async function getLeaveRequests(employeeId?: string): Promise<LeaveRequest[]> {
  await new Promise(resolve => setTimeout(resolve, 300));
  if (employeeId) {
    return mockLeaveRequests.filter(r => r.employeeId === employeeId);
  }
  return mockLeaveRequests;
}

export async function getPendingLeaveRequests(): Promise<LeaveRequest[]> {
  await new Promise(resolve => setTimeout(resolve, 300));
  return mockLeaveRequests.filter(r => r.status === 'pending');
}

export async function getLeaveBalance(): Promise<LeaveBalance> {
  await new Promise(resolve => setTimeout(resolve, 200));
  return mockLeaveBalance;
}

export async function submitLeaveRequest(
  leaveType: LeaveType,
  startDate: Date,
  endDate: Date,
  reason: string,
  documents?: File[]
): Promise<LeaveRequest> {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const numberOfDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  
  const newRequest: LeaveRequest = {
    id: `leave-${Date.now()}`,
    employeeId: 'current-user',
    employeeName: 'You',
    employeeRole: 'Doctor',
    leaveType,
    startDate,
    endDate,
    numberOfDays,
    reason,
    supportingDocuments: documents?.map(doc => ({
      name: doc.name,
      url: URL.createObjectURL(doc),
      size: doc.size
    })),
    status: 'pending',
    createdAt: new Date(),
    updatedAt: new Date()
  };

  mockLeaveRequests.push(newRequest);
  mockLeaveBalance.pendingLeave += numberOfDays;
  
  return newRequest;
}

export async function approveLeaveRequest(
  requestId: string,
  approverId: string,
  approverName: string
): Promise<void> {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const request = mockLeaveRequests.find(r => r.id === requestId);
  if (request) {
    request.status = 'approved';
    request.approvedBy = approverId;
    request.approverName = approverName;
    request.approvalDate = new Date();
    request.updatedAt = new Date();
  }
}

export async function rejectLeaveRequest(
  requestId: string,
  approverId: string,
  approverName: string,
  reason: string
): Promise<void> {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const request = mockLeaveRequests.find(r => r.id === requestId);
  if (request) {
    request.status = 'rejected';
    request.approvedBy = approverId;
    request.approverName = approverName;
    request.approvalDate = new Date();
    request.rejectionReason = reason;
    request.updatedAt = new Date();
  }
}

export async function cancelLeaveRequest(requestId: string): Promise<void> {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const request = mockLeaveRequests.find(r => r.id === requestId);
  if (request) {
    request.status = 'cancelled';
    request.updatedAt = new Date();
  }
}

export async function getLeaveCalendar(
  startDate: Date,
  endDate: Date
): Promise<LeaveCalendarEvent[]> {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return mockLeaveRequests
    .filter(r => r.status === 'approved')
    .filter(r => r.startDate >= startDate && r.endDate <= endDate)
    .map(r => ({
      id: r.id,
      employeeId: r.employeeId,
      employeeName: r.employeeName,
      leaveType: r.leaveType,
      startDate: r.startDate,
      endDate: r.endDate,
      status: r.status
    }));
}

export function calculateLeaveDays(startDate: Date, endDate: Date): number {
  return Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
}

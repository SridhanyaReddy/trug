export type AdminVendorVerificationStatus = 'Verified' | 'Pending Review' | 'Action Needed' | 'Rejected';
export type AdminVendorAccountStatus = 'Active' | 'Suspended';

export interface AdminVendorRecord {
  id: string;
  slug: string;
  businessName: string;
  category: string;
  ownerName: string;
  phone: string;
  email: string;
  locality: string;
  city: string;
  gstNumber: string;
  fssaiNumber: string;
  verificationStatus: AdminVendorVerificationStatus;
  accountStatus: AdminVendorAccountStatus;
  joinedDate: string;
  productCount: number;
  totalOrders: number;
  grossSales: number;
  rating: number;
  plan: string;
  planExpiry: string;
  documents: {
    fssaiDoc: string;
    gstDoc: string;
    storefrontPhoto: string;
  };
}

export interface AdminCategoryRecord {
  id: string;
  slug: string;
  name: string;
  description: string;
  image: string;
  displayOrder: number;
  isEnabled: boolean;
  productCount: number;
  vendorCount: number;
}

export interface AdminSupportTicket {
  id: string;
  ticketNumber: string;
  requesterType: 'Customer' | 'Vendor';
  requesterName: string;
  requesterContact: string;
  relatedOrderId?: string;
  issueCategory: 'Late Delivery' | 'Damaged Goods' | 'Refund Request' | 'Payout & Billing' | 'Subscription Pause' | 'App Issue';
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  status: 'Open' | 'In Progress' | 'Resolved' | 'Closed';
  assignedAgent: string;
  createdAt: string;
  updatedAt: string;
  description: string;
  conversation: {
    sender: string;
    role: 'customer' | 'vendor' | 'agent';
    timestamp: string;
    message: string;
  }[];
  internalNotes?: string;
  resolutionNotes?: string;
}

export interface AdminDispute {
  id: string;
  orderNumber: string;
  vendorName: string;
  customerName: string;
  amount: number;
  disputeReason: 'Milk curdled upon arrival' | 'Missing items in package' | 'Rider delayed past 45m' | 'Order never delivered';
  status: 'Under Investigation' | 'Refund Approved' | 'Refund Rejected' | 'Resolved with Replacement';
  createdAt: string;
  evidenceNotes: string;
  refundInitiated?: boolean;
}

export interface AdminAuditLog {
  id: string;
  action: string;
  performedBy: string;
  target: string;
  timestamp: string;
  details: string;
}

export interface PlatformConfig {
  platformName: string;
  supportHelpline: string;
  supportEmail: string;
  defaultDeliveryRadiusKm: number;
  standardCommissionPercent: number; // 0%
  maintenanceMode: boolean;
  autoApproveSubscriptions: boolean;
}


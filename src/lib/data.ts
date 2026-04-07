export type Priority = "low" | "medium" | "high" | "critical";
export type Status = "submitted" | "assigned" | "in-progress" | "resolved" | "escalated";
export type Sentiment = "positive" | "neutral" | "negative";
export type Category = "environment" | "transport" | "safety" | "infrastructure" | "digital-services" | "government-schemes";

export interface Complaint {
  id: string;
  ticketId: string;
  title: string;
  description: string;
  category: Category;
  priority: Priority;
  status: Status;
  sentiment: Sentiment;
  confidence: number;
  keywords: string[];
  location: string;
  submittedAt: string;
  updatedAt: string;
  department: string;
  timeline: TimelineEvent[];
}

export interface TimelineEvent {
  status: Status;
  date: string;
  note: string;
}

export const categoryLabels: Record<Category, string> = {
  environment: "Environment",
  transport: "Transport",
  safety: "Public Safety",
  infrastructure: "Infrastructure",
  "digital-services": "Digital Services",
  "government-schemes": "Government Schemes",
};

export const categoryIcons: Record<Category, string> = {
  environment: "🌿",
  transport: "🚌",
  safety: "🛡️",
  infrastructure: "🏗️",
  "digital-services": "💻",
  "government-schemes": "📋",
};

export const priorityColors: Record<Priority, string> = {
  low: "bg-priority-low/15 text-success",
  medium: "bg-warning/15 text-warning",
  high: "bg-priority-high/15 text-priority-high",
  critical: "bg-critical/15 text-critical",
};

export const statusColors: Record<Status, string> = {
  submitted: "bg-info/15 text-info",
  assigned: "bg-warning/15 text-warning",
  "in-progress": "bg-secondary/15 text-secondary",
  resolved: "bg-success/15 text-success",
  escalated: "bg-critical/15 text-critical",
};

export const sampleComplaints: Complaint[] = [
  {
    id: "1", ticketId: "GRV-2024-0847",
    title: "Overflowing garbage bins near MG Road",
    description: "Multiple garbage bins overflowing for 3 days causing health hazard. Stray animals scattering waste.",
    category: "environment", priority: "high", status: "in-progress", sentiment: "negative", confidence: 0.94,
    keywords: ["garbage", "overflow", "health hazard", "stray animals"],
    location: "MG Road, Bengaluru", submittedAt: "2024-03-15T09:30:00", updatedAt: "2024-03-16T14:20:00",
    department: "BBMP Waste Management",
    timeline: [
      { status: "submitted", date: "2024-03-15T09:30:00", note: "Complaint registered via web portal" },
      { status: "assigned", date: "2024-03-15T11:00:00", note: "Assigned to BBMP Waste Management" },
      { status: "in-progress", date: "2024-03-16T14:20:00", note: "Cleanup crew dispatched" },
    ],
  },
  {
    id: "2", ticketId: "GRV-2024-0848",
    title: "Pothole causing accidents on NH-44",
    description: "Large pothole near toll booth causing multiple two-wheeler accidents. Immediate repair needed.",
    category: "infrastructure", priority: "critical", status: "assigned", sentiment: "negative", confidence: 0.97,
    keywords: ["pothole", "accident", "road damage", "safety risk"],
    location: "NH-44, Hyderabad", submittedAt: "2024-03-14T16:45:00", updatedAt: "2024-03-15T08:30:00",
    department: "NHAI Road Maintenance",
    timeline: [
      { status: "submitted", date: "2024-03-14T16:45:00", note: "Complaint registered with photo evidence" },
      { status: "assigned", date: "2024-03-15T08:30:00", note: "Escalated to NHAI Road Maintenance division" },
    ],
  },
  {
    id: "3", ticketId: "GRV-2024-0849",
    title: "Bus route 500C frequently delayed",
    description: "Route 500C consistently 20-30 min late during morning hours affecting daily commuters.",
    category: "transport", priority: "medium", status: "submitted", sentiment: "negative", confidence: 0.88,
    keywords: ["bus delay", "commute", "schedule", "public transport"],
    location: "Koramangala, Bengaluru", submittedAt: "2024-03-16T07:15:00", updatedAt: "2024-03-16T07:15:00",
    department: "BMTC Operations",
    timeline: [
      { status: "submitted", date: "2024-03-16T07:15:00", note: "Complaint registered" },
    ],
  },
  {
    id: "4", ticketId: "GRV-2024-0850",
    title: "Aadhaar update portal not working",
    description: "Online Aadhaar address update portal showing server error for past 2 days.",
    category: "digital-services", priority: "medium", status: "resolved", sentiment: "neutral", confidence: 0.91,
    keywords: ["Aadhaar", "portal", "server error", "digital"],
    location: "Online Service", submittedAt: "2024-03-10T11:00:00", updatedAt: "2024-03-13T16:00:00",
    department: "UIDAI Technical",
    timeline: [
      { status: "submitted", date: "2024-03-10T11:00:00", note: "Complaint registered" },
      { status: "assigned", date: "2024-03-10T14:00:00", note: "Forwarded to UIDAI tech team" },
      { status: "in-progress", date: "2024-03-11T09:00:00", note: "Server maintenance initiated" },
      { status: "resolved", date: "2024-03-13T16:00:00", note: "Portal restored and verified" },
    ],
  },
  {
    id: "5", ticketId: "GRV-2024-0851",
    title: "Streetlights not working in Sector 12",
    description: "All streetlights in Sector 12 residential area non-functional for a week creating safety concerns.",
    category: "safety", priority: "high", status: "escalated", sentiment: "negative", confidence: 0.92,
    keywords: ["streetlight", "dark", "safety", "residential"],
    location: "Sector 12, Noida", submittedAt: "2024-03-08T19:30:00", updatedAt: "2024-03-15T10:00:00",
    department: "Noida Authority Electrical",
    timeline: [
      { status: "submitted", date: "2024-03-08T19:30:00", note: "Complaint registered" },
      { status: "assigned", date: "2024-03-09T10:00:00", note: "Assigned to electrical division" },
      { status: "in-progress", date: "2024-03-10T14:00:00", note: "Inspection scheduled" },
      { status: "escalated", date: "2024-03-15T10:00:00", note: "Escalated due to no resolution in 7 days" },
    ],
  },
  {
    id: "6", ticketId: "GRV-2024-0852",
    title: "PM-KISAN installment not received",
    description: "Have not received PM-KISAN 16th installment despite being eligible. Bank account verified.",
    category: "government-schemes", priority: "low", status: "in-progress", sentiment: "neutral", confidence: 0.85,
    keywords: ["PM-KISAN", "installment", "payment", "scheme"],
    location: "Lucknow, UP", submittedAt: "2024-03-12T10:00:00", updatedAt: "2024-03-14T12:00:00",
    department: "Agriculture Department",
    timeline: [
      { status: "submitted", date: "2024-03-12T10:00:00", note: "Complaint registered" },
      { status: "assigned", date: "2024-03-13T09:00:00", note: "Assigned to Agriculture Dept" },
      { status: "in-progress", date: "2024-03-14T12:00:00", note: "Verification in progress" },
    ],
  },
];

export const dashboardStats = {
  total: 1247,
  active: 342,
  resolved: 856,
  escalated: 49,
  avgResolutionDays: 4.2,
  satisfactionRate: 87,
};

export const categoryDistribution = [
  { name: "Infrastructure", value: 320, fill: "hsl(215, 80%, 22%)" },
  { name: "Transport", value: 245, fill: "hsl(175, 60%, 40%)" },
  { name: "Environment", value: 198, fill: "hsl(152, 60%, 40%)" },
  { name: "Safety", value: 187, fill: "hsl(38, 92%, 50%)" },
  { name: "Digital Services", value: 165, fill: "hsl(215, 80%, 55%)" },
  { name: "Gov. Schemes", value: 132, fill: "hsl(15, 80%, 50%)" },
];

export const resolutionTrend = [
  { month: "Oct", resolved: 95, submitted: 120 },
  { month: "Nov", resolved: 110, submitted: 105 },
  { month: "Dec", resolved: 130, submitted: 145 },
  { month: "Jan", resolved: 140, submitted: 135 },
  { month: "Feb", resolved: 155, submitted: 150 },
  { month: "Mar", resolved: 125, submitted: 160 },
];

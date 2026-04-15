import type { DemoState } from "~/data/demo-state";

export interface Lead {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  status: "New" | "Contacted" | "Qualified" | "Hot" | "Cold";
  source: "Website" | "Referral" | "Cold Call" | "Social Media" | "Event";
  value: number;
  createdAt: string;
}

export interface Opportunity {
  id: string;
  name: string;
  account: string;
  value: number;
  stage:
    | "Prospecting"
    | "Qualification"
    | "Proposal"
    | "Negotiation"
    | "Closed Won"
    | "Closed Lost";
  probability: number;
  closeDate: string;
  owner: string;
  isHighValue: boolean;
  daysToClose?: number;
}

export interface Account {
  id: string;
  name: string;
  industry: string;
  type: "Enterprise" | "Mid-Market" | "Small Business";
  revenue: number;
  employees: number;
  status: "Active" | "Inactive" | "Prospect";
  owner: string;
}

export interface Contact {
  id: string;
  name: string;
  title: string;
  account: string;
  email: string;
  phone: string;
  status: "Active" | "Inactive";
}

export interface Quote {
  id: string;
  name: string;
  account: string;
  amount: number;
  status: "Draft" | "Sent" | "Accepted" | "Rejected";
  validUntil: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  account: string;
  amount: number;
  status: "Processing" | "Shipped" | "Delivered" | "Cancelled";
  date: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  account: string;
  amount: number;
  status: "Paid" | "Pending" | "Overdue" | "Cancelled";
  dueDate: string;
  paidDate: string | null;
}

export const mockLeads: Lead[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    company: "TechVision Solutions",
    email: "sarah.j@techvision.com",
    phone: "555-0101",
    status: "Hot",
    source: "Website",
    value: 50000,
    createdAt: "2026-03-20",
  },
  {
    id: "2",
    name: "Michael Chen",
    company: "GlobalFinance Corp",
    email: "mchen@globalfinance.com",
    phone: "555-0102",
    status: "Hot",
    source: "Referral",
    value: 75000,
    createdAt: "2026-03-19",
  },
  {
    id: "3",
    name: "Emily Rodriguez",
    company: "RetailMax Group",
    email: "emily.r@retailmax.com",
    phone: "555-0103",
    status: "Qualified",
    source: "Event",
    value: 45000,
    createdAt: "2026-03-18",
  },
  {
    id: "4",
    name: "David Park",
    company: "TransLogistics Inc",
    email: "dpark@translog.com",
    phone: "555-0104",
    status: "Hot",
    source: "Cold Call",
    value: 60000,
    createdAt: "2026-03-17",
  },
  {
    id: "5",
    name: "Jessica Williams",
    company: "HealthTech Innovations",
    email: "j.williams@healthtech.com",
    phone: "555-0105",
    status: "Contacted",
    source: "Website",
    value: 40000,
    createdAt: "2026-03-16",
  },
  {
    id: "6",
    name: "Robert Taylor",
    company: "EduSmart Platform",
    email: "rtaylor@edusmart.com",
    phone: "555-0106",
    status: "Hot",
    source: "Social Media",
    value: 55000,
    createdAt: "2026-03-15",
  },
  {
    id: "7",
    name: "Amanda Martinez",
    company: "CloudSync Solutions",
    email: "amanda.m@cloudsync.com",
    phone: "555-0107",
    status: "New",
    source: "Website",
    value: 35000,
    createdAt: "2026-03-14",
  },
  {
    id: "8",
    name: "James Anderson",
    company: "DataAnalytics Pro",
    email: "j.anderson@dataanalytics.com",
    phone: "555-0108",
    status: "Hot",
    source: "Referral",
    value: 70000,
    createdAt: "2026-03-13",
  },
  {
    id: "9",
    name: "Maria Garcia",
    company: "SecureNet Systems",
    email: "mgarcia@securenet.com",
    phone: "555-0109",
    status: "Qualified",
    source: "Event",
    value: 48000,
    createdAt: "2026-03-12",
  },
  {
    id: "10",
    name: "Christopher Lee",
    company: "AutoManage Tech",
    email: "clee@automanage.com",
    phone: "555-0110",
    status: "Hot",
    source: "Website",
    value: 52000,
    createdAt: "2026-03-11",
  },
];

export const mockOpportunities: Opportunity[] = [
  {
    id: "1",
    name: "Digital Transformation Initiative",
    account: "TechVision Solutions",
    value: 500000,
    stage: "Qualification",
    probability: 40,
    closeDate: "2026-04-15",
    owner: "John Smith",
    isHighValue: true,
    daysToClose: 22,
  },
  {
    id: "2",
    name: "CRM Implementation - Enterprise",
    account: "TechVision Solutions",
    value: 450000,
    stage: "Proposal",
    probability: 60,
    closeDate: "2026-04-20",
    owner: "Jane Doe",
    isHighValue: true,
    daysToClose: 27,
  },
  {
    id: "3",
    name: "Warehouse Management System",
    account: "TransLogistics Inc",
    value: 445000,
    stage: "Negotiation",
    probability: 75,
    closeDate: "2026-03-28",
    owner: "John Smith",
    isHighValue: true,
    daysToClose: 4,
  },
  {
    id: "4",
    name: "Risk Management System",
    account: "GlobalFinance Corp",
    value: 425000,
    stage: "Proposal",
    probability: 50,
    closeDate: "2026-04-10",
    owner: "Sarah Wilson",
    isHighValue: true,
    daysToClose: 17,
  },
  {
    id: "5",
    name: "Retail POS System Upgrade",
    account: "RetailMax Group",
    value: 420000,
    stage: "Proposal",
    probability: 55,
    closeDate: "2026-04-05",
    owner: "Mike Johnson",
    isHighValue: true,
    daysToClose: 12,
  },
  {
    id: "6",
    name: "Cloud Migration Project",
    account: "HealthTech Innovations",
    value: 380000,
    stage: "Qualification",
    probability: 35,
    closeDate: "2026-04-25",
    owner: "John Smith",
    isHighValue: true,
    daysToClose: 32,
  },
  {
    id: "7",
    name: "Security Infrastructure Upgrade",
    account: "SecureNet Systems",
    value: 350000,
    stage: "Prospecting",
    probability: 20,
    closeDate: "2026-05-01",
    owner: "Jane Doe",
    isHighValue: true,
    daysToClose: 38,
  },
  {
    id: "8",
    name: "E-Learning Platform Development",
    account: "EduSmart Platform",
    value: 325000,
    stage: "Proposal",
    probability: 65,
    closeDate: "2026-04-08",
    owner: "Sarah Wilson",
    isHighValue: true,
    daysToClose: 15,
  },
  {
    id: "9",
    name: "Data Analytics Suite",
    account: "DataAnalytics Pro",
    value: 310000,
    stage: "Qualification",
    probability: 45,
    closeDate: "2026-04-18",
    owner: "Mike Johnson",
    isHighValue: true,
    daysToClose: 25,
  },
  {
    id: "10",
    name: "Mobile App Development",
    account: "CloudSync Solutions",
    value: 285000,
    stage: "Prospecting",
    probability: 25,
    closeDate: "2026-04-30",
    owner: "John Smith",
    isHighValue: true,
    daysToClose: 37,
  },
  {
    id: "11",
    name: "Customer Portal Enhancement",
    account: "TechVision Solutions",
    value: 265000,
    stage: "Negotiation",
    probability: 80,
    closeDate: "2026-03-26",
    owner: "Jane Doe",
    isHighValue: true,
    daysToClose: 2,
  },
  {
    id: "12",
    name: "Supply Chain Optimization",
    account: "TransLogistics Inc",
    value: 255000,
    stage: "Proposal",
    probability: 50,
    closeDate: "2026-04-12",
    owner: "Sarah Wilson",
    isHighValue: true,
    daysToClose: 19,
  },
  {
    id: "13",
    name: "Business Intelligence Platform",
    account: "GlobalFinance Corp",
    value: 245000,
    stage: "Qualification",
    probability: 40,
    closeDate: "2026-04-22",
    owner: "Mike Johnson",
    isHighValue: true,
    daysToClose: 29,
  },
  {
    id: "14",
    name: "Marketing Automation Setup",
    account: "RetailMax Group",
    value: 180000,
    stage: "Prospecting",
    probability: 30,
    closeDate: "2026-05-05",
    owner: "John Smith",
    isHighValue: false,
    daysToClose: 42,
  },
  {
    id: "15",
    name: "IT Support Services Contract",
    account: "HealthTech Innovations",
    value: 165000,
    stage: "Negotiation",
    probability: 85,
    closeDate: "2026-03-27",
    owner: "Jane Doe",
    isHighValue: false,
    daysToClose: 3,
  },
];

export const mockAccounts: Account[] = [
  {
    id: "1",
    name: "TechVision Solutions",
    industry: "Technology",
    type: "Enterprise",
    revenue: 50000000,
    employees: 500,
    status: "Active",
    owner: "John Smith",
  },
  {
    id: "2",
    name: "GlobalFinance Corp",
    industry: "Financial Services",
    type: "Enterprise",
    revenue: 120000000,
    employees: 1200,
    status: "Active",
    owner: "Sarah Wilson",
  },
  {
    id: "3",
    name: "RetailMax Group",
    industry: "Retail",
    type: "Enterprise",
    revenue: 85000000,
    employees: 850,
    status: "Active",
    owner: "Mike Johnson",
  },
  {
    id: "4",
    name: "TransLogistics Inc",
    industry: "Transportation",
    type: "Mid-Market",
    revenue: 35000000,
    employees: 350,
    status: "Active",
    owner: "John Smith",
  },
  {
    id: "5",
    name: "HealthTech Innovations",
    industry: "Healthcare",
    type: "Mid-Market",
    revenue: 28000000,
    employees: 280,
    status: "Active",
    owner: "Jane Doe",
  },
  {
    id: "6",
    name: "EduSmart Platform",
    industry: "Education",
    type: "Mid-Market",
    revenue: 22000000,
    employees: 220,
    status: "Prospect",
    owner: "Sarah Wilson",
  },
  {
    id: "7",
    name: "CloudSync Solutions",
    industry: "Technology",
    type: "Small Business",
    revenue: 12000000,
    employees: 120,
    status: "Prospect",
    owner: "Mike Johnson",
  },
  {
    id: "8",
    name: "DataAnalytics Pro",
    industry: "Technology",
    type: "Mid-Market",
    revenue: 30000000,
    employees: 300,
    status: "Active",
    owner: "John Smith",
  },
  {
    id: "9",
    name: "SecureNet Systems",
    industry: "Cybersecurity",
    type: "Mid-Market",
    revenue: 25000000,
    employees: 250,
    status: "Active",
    owner: "Jane Doe",
  },
  {
    id: "10",
    name: "AutoManage Tech",
    industry: "Manufacturing",
    type: "Small Business",
    revenue: 15000000,
    employees: 150,
    status: "Prospect",
    owner: "Sarah Wilson",
  },
];

export const getAccountNames = (state: Pick<DemoState, "accounts">) =>
  state.accounts.map((account) => account.name);

export const mockContacts: Contact[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    title: "CTO",
    account: "TechVision Solutions",
    email: "sarah.j@techvision.com",
    phone: "555-0101",
    status: "Active",
  },
  {
    id: "2",
    name: "Michael Chen",
    title: "VP of Operations",
    account: "GlobalFinance Corp",
    email: "mchen@globalfinance.com",
    phone: "555-0102",
    status: "Active",
  },
  {
    id: "3",
    name: "Emily Rodriguez",
    title: "Director of IT",
    account: "RetailMax Group",
    email: "emily.r@retailmax.com",
    phone: "555-0103",
    status: "Active",
  },
  {
    id: "4",
    name: "David Park",
    title: "CIO",
    account: "TransLogistics Inc",
    email: "dpark@translog.com",
    phone: "555-0104",
    status: "Active",
  },
  {
    id: "5",
    name: "Jessica Williams",
    title: "Head of Digital Innovation",
    account: "HealthTech Innovations",
    email: "j.williams@healthtech.com",
    phone: "555-0105",
    status: "Active",
  },
  {
    id: "6",
    name: "Robert Taylor",
    title: "VP of Technology",
    account: "EduSmart Platform",
    email: "rtaylor@edusmart.com",
    phone: "555-0106",
    status: "Active",
  },
  {
    id: "7",
    name: "Amanda Martinez",
    title: "IT Director",
    account: "CloudSync Solutions",
    email: "amanda.m@cloudsync.com",
    phone: "555-0107",
    status: "Active",
  },
  {
    id: "8",
    name: "James Anderson",
    title: "Chief Data Officer",
    account: "DataAnalytics Pro",
    email: "j.anderson@dataanalytics.com",
    phone: "555-0108",
    status: "Active",
  },
  {
    id: "9",
    name: "Maria Garcia",
    title: "Security Director",
    account: "SecureNet Systems",
    email: "mgarcia@securenet.com",
    phone: "555-0109",
    status: "Active",
  },
  {
    id: "10",
    name: "Christopher Lee",
    title: "Operations Manager",
    account: "AutoManage Tech",
    email: "clee@automanage.com",
    phone: "555-0110",
    status: "Active",
  },
];

export const mockQuotes: Quote[] = [
  {
    id: "1",
    name: "Q-2026-001",
    account: "TechVision Solutions",
    amount: 500000,
    status: "Sent",
    validUntil: "2026-04-15",
  },
  {
    id: "2",
    name: "Q-2026-002",
    account: "GlobalFinance Corp",
    amount: 425000,
    status: "Accepted",
    validUntil: "2026-04-10",
  },
  {
    id: "3",
    name: "Q-2026-003",
    account: "RetailMax Group",
    amount: 420000,
    status: "Sent",
    validUntil: "2026-04-05",
  },
  {
    id: "4",
    name: "Q-2026-004",
    account: "TransLogistics Inc",
    amount: 445000,
    status: "Draft",
    validUntil: "2026-04-20",
  },
  {
    id: "5",
    name: "Q-2026-005",
    account: "HealthTech Innovations",
    amount: 380000,
    status: "Sent",
    validUntil: "2026-04-25",
  },
];

export const mockOrders: Order[] = [
  {
    id: "1",
    orderNumber: "ORD-2026-001",
    account: "TechVision Solutions",
    amount: 500000,
    status: "Processing",
    date: "2026-03-20",
  },
  {
    id: "2",
    orderNumber: "ORD-2026-002",
    account: "GlobalFinance Corp",
    amount: 425000,
    status: "Shipped",
    date: "2026-03-18",
  },
  {
    id: "3",
    orderNumber: "ORD-2026-003",
    account: "RetailMax Group",
    amount: 420000,
    status: "Delivered",
    date: "2026-03-15",
  },
  {
    id: "4",
    orderNumber: "ORD-2026-004",
    account: "TransLogistics Inc",
    amount: 445000,
    status: "Processing",
    date: "2026-03-22",
  },
];

export const mockInvoices: Invoice[] = [
  {
    id: "1",
    invoiceNumber: "INV-2026-001",
    account: "TechVision Solutions",
    amount: 500000,
    status: "Paid",
    dueDate: "2026-03-30",
    paidDate: "2026-03-25",
  },
  {
    id: "2",
    invoiceNumber: "INV-2026-002",
    account: "GlobalFinance Corp",
    amount: 425000,
    status: "Pending",
    dueDate: "2026-04-05",
    paidDate: null,
  },
  {
    id: "3",
    invoiceNumber: "INV-2026-003",
    account: "RetailMax Group",
    amount: 420000,
    status: "Overdue",
    dueDate: "2026-03-20",
    paidDate: null,
  },
  {
    id: "4",
    invoiceNumber: "INV-2026-004",
    account: "TransLogistics Inc",
    amount: 445000,
    status: "Paid",
    dueDate: "2026-04-01",
    paidDate: "2026-03-28",
  },
];

const nextId = (records: Array<{ id: string }>) =>
  String(
    records.reduce((max, record) => {
      const value = Number.parseInt(record.id, 10);
      return Number.isNaN(value) ? max : Math.max(max, value);
    }, 0) + 1,
  );

const todayIso = () => new Date().toISOString().slice(0, 10);

const calculateDaysToClose = (closeDate: string) => {
  const target = new Date(closeDate).getTime();
  if (Number.isNaN(target)) {
    return undefined;
  }

  return Math.max(Math.ceil((target - Date.now()) / (1000 * 60 * 60 * 24)), 0);
};

const updateRecord = <T extends { id: string }>(
  records: T[],
  id: string,
  updates: Partial<Omit<T, "id">>,
) => {
  const record = records.find((item) => item.id === id);
  if (!record) {
    return null;
  }

  Object.assign(record, updates);
  return record;
};

const touchDemoState = (state: DemoState) => {
  state.version += 1;
};

const isClosedOpportunityStage = (stage: Opportunity["stage"]) =>
  stage === "Closed Won" || stage === "Closed Lost";

const cascadeAccountRename = (
  state: DemoState,
  previousName: string,
  nextName: string,
) => {
  for (const contact of state.contacts) {
    if (contact.account === previousName) {
      contact.account = nextName;
    }
  }

  for (const opportunity of state.opportunities) {
    if (opportunity.account === previousName) {
      opportunity.account = nextName;
    }
  }

  for (const quote of state.quotes) {
    if (quote.account === previousName) {
      quote.account = nextName;
    }
  }

  for (const order of state.orders) {
    if (order.account === previousName) {
      order.account = nextName;
    }
  }

  for (const invoice of state.invoices) {
    if (invoice.account === previousName) {
      invoice.account = nextName;
    }
  }
};

const normalizeInvoice = (invoice: Invoice) => {
  if (invoice.status === "Paid") {
    invoice.paidDate = invoice.paidDate || todayIso();
  } else {
    invoice.paidDate = null;
  }

  return invoice;
};

export function addLead(
  state: DemoState,
  input: Omit<Lead, "id" | "createdAt">,
) {
  const lead: Lead = {
    ...input,
    id: nextId(state.leads),
    createdAt: todayIso(),
  };
  state.leads.unshift(lead);
  touchDemoState(state);
  return lead;
}

export function updateLead(
  state: DemoState,
  id: string,
  updates: Partial<Omit<Lead, "id" | "createdAt">>,
) {
  const lead = updateRecord(state.leads, id, updates);
  if (lead) {
    touchDemoState(state);
  }
  return lead;
}

export function deleteLead(state: DemoState, id: string) {
  const index = state.leads.findIndex((item) => item.id === id);
  if (index < 0) {
    return false;
  }

  state.leads.splice(index, 1);
  touchDemoState(state);
  return true;
}

export function addAccount(state: DemoState, input: Omit<Account, "id">) {
  const account: Account = {
    ...input,
    id: nextId(state.accounts),
  };
  state.accounts.unshift(account);
  touchDemoState(state);
  return account;
}

export function updateAccount(
  state: DemoState,
  id: string,
  updates: Partial<Omit<Account, "id">>,
) {
  const account = state.accounts.find((item) => item.id === id);
  if (!account) {
    return null;
  }

  const previousName = account.name;
  Object.assign(account, updates);

  if (updates.name && updates.name !== previousName) {
    cascadeAccountRename(state, previousName, account.name);
  }

  touchDemoState(state);
  return account;
}

export function addContact(state: DemoState, input: Omit<Contact, "id">) {
  const contact: Contact = {
    ...input,
    id: nextId(state.contacts),
  };
  state.contacts.unshift(contact);
  touchDemoState(state);
  return contact;
}

export function updateContact(
  state: DemoState,
  id: string,
  updates: Partial<Omit<Contact, "id">>,
) {
  const contact = updateRecord(state.contacts, id, updates);
  if (contact) {
    touchDemoState(state);
  }
  return contact;
}

export function addOpportunity(
  state: DemoState,
  input: Omit<Opportunity, "id" | "daysToClose">,
) {
  const opportunity: Opportunity = {
    ...input,
    id: nextId(state.opportunities),
    daysToClose: isClosedOpportunityStage(input.stage)
      ? 0
      : calculateDaysToClose(input.closeDate),
  };
  state.opportunities.unshift(opportunity);
  touchDemoState(state);
  return opportunity;
}

export function updateOpportunity(
  state: DemoState,
  id: string,
  updates: Partial<Omit<Opportunity, "id" | "daysToClose">>,
) {
  const opportunity = updateRecord(state.opportunities, id, updates);
  if (opportunity) {
    if (isClosedOpportunityStage(opportunity.stage)) {
      opportunity.daysToClose = 0;
    } else if (updates.closeDate !== undefined || updates.stage !== undefined) {
      opportunity.daysToClose = calculateDaysToClose(opportunity.closeDate);
    }
    touchDemoState(state);
  }
  return opportunity;
}

export function addQuote(state: DemoState, input: Omit<Quote, "id">) {
  const quote: Quote = {
    ...input,
    id: nextId(state.quotes),
  };
  state.quotes.unshift(quote);
  touchDemoState(state);
  return quote;
}

export function updateQuote(
  state: DemoState,
  id: string,
  updates: Partial<Omit<Quote, "id">>,
) {
  const quote = updateRecord(state.quotes, id, updates);
  if (quote) {
    touchDemoState(state);
  }
  return quote;
}

export function addOrder(state: DemoState, input: Omit<Order, "id">) {
  const order: Order = {
    ...input,
    id: nextId(state.orders),
  };
  state.orders.unshift(order);
  touchDemoState(state);
  return order;
}

export function updateOrder(
  state: DemoState,
  id: string,
  updates: Partial<Omit<Order, "id">>,
) {
  const order = updateRecord(state.orders, id, updates);
  if (order) {
    touchDemoState(state);
  }
  return order;
}

export function addInvoice(state: DemoState, input: Omit<Invoice, "id">) {
  const invoice: Invoice = {
    ...input,
    id: nextId(state.invoices),
    paidDate: input.paidDate || null,
  };
  normalizeInvoice(invoice);
  state.invoices.unshift(invoice);
  touchDemoState(state);
  return invoice;
}

export function updateInvoice(
  state: DemoState,
  id: string,
  updates: Partial<Omit<Invoice, "id">>,
) {
  const invoice = updateRecord(state.invoices, id, updates);
  if (invoice) {
    normalizeInvoice(invoice);
    touchDemoState(state);
  }
  return invoice;
}

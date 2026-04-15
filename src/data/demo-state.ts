import { createContextId, useContext } from "@builder.io/qwik";
import {
  mockAccounts,
  mockContacts,
  mockInvoices,
  mockLeads,
  mockOpportunities,
  mockOrders,
  mockQuotes,
  type Account,
  type Contact,
  type Invoice,
  type Lead,
  type Opportunity,
  type Order,
  type Quote,
} from "~/data/mock-data";

const cloneRecords = <T>(records: T[]) =>
  records.map((record) => ({ ...record }));

export interface DemoState {
  leads: Lead[];
  opportunities: Opportunity[];
  accounts: Account[];
  contacts: Contact[];
  quotes: Quote[];
  orders: Order[];
  invoices: Invoice[];
  version: number;
}

export const DEMO_STORAGE_KEY = "salesforce-crm-demo-state-v1";

export const demoStateContext = createContextId<DemoState>(
  "salesforce-demo-state",
);

export const createDemoState = (): DemoState => ({
  leads: cloneRecords(mockLeads),
  opportunities: cloneRecords(mockOpportunities),
  accounts: cloneRecords(mockAccounts),
  contacts: cloneRecords(mockContacts),
  quotes: cloneRecords(mockQuotes),
  orders: cloneRecords(mockOrders),
  invoices: cloneRecords(mockInvoices),
  version: 0,
});

export const useDemoData = () => useContext(demoStateContext);

export const loadPersistedDemoState = (): DemoState | null => {
  if (typeof window === "undefined") {
    return null;
  }

  const raw = window.localStorage.getItem(DEMO_STORAGE_KEY);
  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as DemoState;
    return {
      leads: cloneRecords((parsed.leads ?? []) as Lead[]),
      opportunities: cloneRecords(
        (parsed.opportunities ?? []) as Opportunity[],
      ),
      accounts: cloneRecords((parsed.accounts ?? []) as Account[]),
      contacts: cloneRecords((parsed.contacts ?? []) as Contact[]),
      quotes: cloneRecords((parsed.quotes ?? []) as Quote[]),
      orders: cloneRecords((parsed.orders ?? []) as Order[]),
      invoices: cloneRecords((parsed.invoices ?? []) as Invoice[]),
      version: parsed.version ?? 0,
    };
  } catch {
    return null;
  }
};

export const saveDemoState = (state: DemoState) => {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(state));
};

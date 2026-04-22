export const DEMO_ACCESS_ROUTE = "/demo-access";
export const DEMO_ACCESS_STORAGE_KEY = "salesforce-crm-demo-access-v1";
export const DEMO_ACCESS_COOKIE = "salesforce-crm-demo-access";
export const DEMO_ACCESS_TTL_MS = 8 * 60 * 60 * 1000;
export const DEMO_ACCESS_TTL_SECONDS = DEMO_ACCESS_TTL_MS / 1000;

export interface DemoTarget {
  accent: string;
  accentSoft: string;
  descriptionEn: string;
  descriptionTr: string;
  href: string;
  icon:
    | "dashboard"
    | "leads"
    | "opportunities"
    | "accounts"
    | "contacts"
    | "quotes"
    | "orders"
    | "invoices"
    | "search";
  signalEn: string;
  signalTr: string;
  titleEn: string;
  titleTr: string;
}

export interface DemoAccessDraft {
  name: string;
  email: string;
  role: string;
  organization: string;
}

export interface DemoAccessSession extends DemoAccessDraft {
  accessId: string;
  startedAt: string;
}

export const demoTargets: DemoTarget[] = [
  {
    accent: "#2563eb",
    accentSoft: "rgba(37, 99, 235, 0.16)",
    descriptionEn:
      "Forecast health, stage coverage, and near-term execution in the main command surface.",
    descriptionTr:
      "Ana komuta yüzeyinde tahmin sağlığını, aşama dağılımını ve yakın dönem yürütmeyi izleyin.",
    href: "/dashboard",
    icon: "dashboard",
    signalEn: "Revenue control surface",
    signalTr: "Gelir kontrol yüzeyi",
    titleEn: "Sales Command Center",
    titleTr: "Satış Komuta Merkezi",
  },
  {
    accent: "#0f766e",
    accentSoft: "rgba(15, 118, 110, 0.16)",
    descriptionEn:
      "Review hot leads, qualification status, and ownership before the pipeline handoff.",
    descriptionTr:
      "Pipeline handoff öncesinde sıcak leadleri, nitelendirme durumunu ve sahiplik dağılımını inceleyin.",
    href: "/leads",
    icon: "leads",
    signalEn: "Lead intake review",
    signalTr: "Lead intake incelemesi",
    titleEn: "Lead Qualification",
    titleTr: "Lead Nitelendirme",
  },
  {
    accent: "#7c3aed",
    accentSoft: "rgba(124, 58, 237, 0.16)",
    descriptionEn:
      "Follow active opportunities, close probability, and deal momentum inside the live pipeline.",
    descriptionTr:
      "Canlı pipeline içinde aktif fırsatları, kapanış olasılığını ve anlaşma momentumunu takip edin.",
    href: "/opportunities",
    icon: "opportunities",
    signalEn: "Pipeline inspection",
    signalTr: "Pipeline denetimi",
    titleEn: "Opportunity Pipeline",
    titleTr: "Fırsat Pipeline'ı",
  },
  {
    accent: "#1d4ed8",
    accentSoft: "rgba(29, 78, 216, 0.16)",
    descriptionEn:
      "Open account health, industry mix, and commercial ownership across the customer base.",
    descriptionTr:
      "Müşteri bazında hesap sağlığını, sektör karmasını ve ticari sahipliği açın.",
    href: "/accounts",
    icon: "accounts",
    signalEn: "Account coverage",
    signalTr: "Hesap kapsamı",
    titleEn: "Account Coverage",
    titleTr: "Hesap Kapsamı",
  },
  {
    accent: "#0891b2",
    accentSoft: "rgba(8, 145, 178, 0.16)",
    descriptionEn:
      "Move through stakeholder records, role context, and relationship readiness for active deals.",
    descriptionTr:
      "Aktif fırsatlar için paydaş kayıtlarını, rol bağlamını ve ilişki hazırlığını inceleyin.",
    href: "/contacts",
    icon: "contacts",
    signalEn: "Stakeholder records",
    signalTr: "Paydaş kayıtları",
    titleEn: "Contact Directory",
    titleTr: "Kişi Dizini",
  },
  {
    accent: "#c2410c",
    accentSoft: "rgba(194, 65, 12, 0.16)",
    descriptionEn:
      "Inspect proposal readiness, approval status, and customer quote history before closing.",
    descriptionTr:
      "Kapanış öncesinde teklif hazırlığını, onay durumunu ve müşteri teklif geçmişini inceleyin.",
    href: "/quotes",
    icon: "quotes",
    signalEn: "Proposal review",
    signalTr: "Teklif incelemesi",
    titleEn: "Quote Review",
    titleTr: "Teklif İncelemesi",
  },
  {
    accent: "#475569",
    accentSoft: "rgba(71, 85, 105, 0.18)",
    descriptionEn:
      "Track order movement, shipment readiness, and execution confidence after the deal closes.",
    descriptionTr:
      "Anlaşma kapandıktan sonra sipariş hareketini, sevkiyat hazırlığını ve operasyon güvenini izleyin.",
    href: "/orders",
    icon: "orders",
    signalEn: "Order execution",
    signalTr: "Sipariş operasyonu",
    titleEn: "Order Tracking",
    titleTr: "Sipariş Takibi",
  },
  {
    accent: "#be123c",
    accentSoft: "rgba(190, 18, 60, 0.16)",
    descriptionEn:
      "Monitor billing posture, due dates, and payment risk in the final revenue stage.",
    descriptionTr:
      "Gelirin son aşamasında faturalama durumunu, vade tarihlerini ve ödeme riskini izleyin.",
    href: "/invoices",
    icon: "invoices",
    signalEn: "Billing control",
    signalTr: "Faturalama kontrolü",
    titleEn: "Invoice Control",
    titleTr: "Fatura Kontrolü",
  },
  {
    accent: "#0f172a",
    accentSoft: "rgba(15, 23, 42, 0.12)",
    descriptionEn:
      "Jump directly into cross-object lookup when the walkthrough starts from a specific customer or deal.",
    descriptionTr:
      "Walkthrough belirli bir müşteri veya anlaşmadan başlıyorsa nesneler arası aramaya doğrudan geçin.",
    href: "/search",
    icon: "search",
    signalEn: "Cross-object lookup",
    signalTr: "Nesneler arası arama",
    titleEn: "Global Search",
    titleTr: "Global Arama",
  },
];

const normalizeTargetPath = (targetPath: string) => {
  const path = (targetPath || "/dashboard").split("?")[0];

  if (path === "/" || path === DEMO_ACCESS_ROUTE) {
    return "/dashboard";
  }

  if (path.startsWith("/dashboard")) {
    return "/dashboard";
  }

  if (path.startsWith("/leads")) {
    return "/leads";
  }

  if (path.startsWith("/opportunities")) {
    return "/opportunities";
  }

  if (path.startsWith("/accounts")) {
    return "/accounts";
  }

  if (path.startsWith("/contacts")) {
    return "/contacts";
  }

  if (path.startsWith("/quotes")) {
    return "/quotes";
  }

  if (path.startsWith("/orders")) {
    return "/orders";
  }

  if (path.startsWith("/invoices")) {
    return "/invoices";
  }

  if (path.startsWith("/search")) {
    return "/search";
  }

  return "/dashboard";
};

const hasWindow = () => typeof window !== "undefined";

const isValidSession = (
  value: Partial<DemoAccessSession> | null,
): value is DemoAccessSession => {
  if (!value) {
    return false;
  }

  return (
    typeof value.accessId === "string" &&
    typeof value.name === "string" &&
    typeof value.email === "string" &&
    typeof value.role === "string" &&
    typeof value.organization === "string" &&
    typeof value.startedAt === "string"
  );
};

const cookieAttributes = () => {
  if (!hasWindow()) {
    return "";
  }

  return [
    "Path=/",
    `Max-Age=${DEMO_ACCESS_TTL_SECONDS}`,
    "SameSite=Lax",
    window.location.protocol === "https:" ? "Secure" : "",
  ]
    .filter(Boolean)
    .join("; ");
};

export const createDemoAccessSession = (
  draft: DemoAccessDraft,
): DemoAccessSession => ({
  accessId: `vertex-${Math.random().toString(36).slice(2, 10)}`,
  email: draft.email.trim(),
  name: draft.name.trim(),
  organization: draft.organization.trim(),
  role: draft.role.trim(),
  startedAt: new Date().toISOString(),
});

export const readDemoAccessSession = (): DemoAccessSession | null => {
  if (!hasWindow()) {
    return null;
  }

  try {
    const raw = window.sessionStorage.getItem(DEMO_ACCESS_STORAGE_KEY);
    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw) as Partial<DemoAccessSession>;
    if (!isValidSession(parsed)) {
      clearDemoAccessSession();
      return null;
    }

    const startedAt = new Date(parsed.startedAt);
    if (
      Number.isNaN(startedAt.getTime()) ||
      Date.now() - startedAt.getTime() > DEMO_ACCESS_TTL_MS
    ) {
      clearDemoAccessSession();
      return null;
    }

    return parsed;
  } catch {
    clearDemoAccessSession();
    return null;
  }
};

export const writeDemoAccessSession = (session: DemoAccessSession) => {
  if (!hasWindow()) {
    return;
  }

  window.sessionStorage.setItem(DEMO_ACCESS_STORAGE_KEY, JSON.stringify(session));
};

export const writeDemoAccessCookie = (accessId: string) => {
  if (!hasWindow()) {
    return;
  }

  document.cookie = `${DEMO_ACCESS_COOKIE}=${encodeURIComponent(accessId)}; ${cookieAttributes()}`;
};

export const clearDemoAccessCookie = () => {
  if (!hasWindow()) {
    return;
  }

  document.cookie = `${DEMO_ACCESS_COOKIE}=; Path=/; Max-Age=0; SameSite=Lax`;
};

export const clearDemoAccessSession = () => {
  if (!hasWindow()) {
    return;
  }

  window.sessionStorage.removeItem(DEMO_ACCESS_STORAGE_KEY);
  clearDemoAccessCookie();
};

export const buildDemoAccessHref = (targetPath: string) => {
  const params = new URLSearchParams();
  params.set("next", targetPath || "/dashboard");
  return `${DEMO_ACCESS_ROUTE}?${params.toString()}`;
};

export const getRequestedTarget = (search: string, fallback = "/dashboard") => {
  const params = new URLSearchParams(search);
  const next = params.get("next");

  if (!next || !next.startsWith("/") || next.startsWith(DEMO_ACCESS_ROUTE)) {
    return fallback;
  }

  return next;
};

export const getDemoTarget = (targetPath: string) =>
  demoTargets.find((target) => target.href === normalizeTargetPath(targetPath)) ??
  demoTargets[0];

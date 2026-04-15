import { createContextId, useContext, type Signal } from "@builder.io/qwik";

export type Locale = "en" | "tr";

export const SUPPORTED_LOCALES: Locale[] = ["en", "tr"];
export const LOCALE_STORAGE_KEY = "salesforce-crm-demo-locale-v1";

export const localeContext = createContextId<Signal<Locale>>(
  "salesforce-crm-demo-locale",
);

export const useLocale = () => useContext(localeContext);

export const loadPersistedLocale = (): Locale | null => {
  if (typeof window === "undefined") {
    return null;
  }

  const raw = window.localStorage.getItem(LOCALE_STORAGE_KEY);
  if (raw === "en" || raw === "tr") {
    return raw;
  }

  return null;
};

export const savePersistedLocale = (locale: Locale) => {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(LOCALE_STORAGE_KEY, locale);
};

export const layoutCopy = {
  en: {
    salesSection: "Sales",
    collateralSection: "Collateral",
    demoWorkspace: "Demo Workspace",
    salesManager: "Sales Manager",
    searchPlaceholder: "Search accounts, contacts, opportunities...",
    language: "Language",
    nav: {
      dashboard: "Dashboard",
      leads: "Leads",
      opportunities: "Opportunities",
      accounts: "Accounts",
      contacts: "Contacts",
      quotes: "Quotes",
      orders: "Orders",
      invoices: "Invoices",
    },
  },
  tr: {
    salesSection: "Satış",
    collateralSection: "Dokümanlar",
    demoWorkspace: "Demo Çalışma Alanı",
    salesManager: "Satış Yöneticisi",
    searchPlaceholder: "Hesapları, kişileri, fırsatları ara...",
    language: "Dil",
    nav: {
      dashboard: "Pano",
      leads: "Adaylar",
      opportunities: "Fırsatlar",
      accounts: "Hesaplar",
      contacts: "Kişiler",
      quotes: "Teklifler",
      orders: "Siparişler",
      invoices: "Faturalar",
    },
  },
} as const;

export const dashboardCopy = {
  en: {
    title: "Sales Command Center",
    intro:
      "Keep pipeline health, forecast confidence, and near-term execution in one polished workspace.",
    lastUpdated: "Last updated",
    performanceSnapshot: "Performance Snapshot",
    executiveNotes: "Executive Notes",
    salesFunnel: "Sales Funnel",
    leadSourcesHeading: "Lead Sources",
    pipelineHealth: "Pipeline Health",
    topOpportunities: "Top Opportunities",
    largestDeals: "Largest deals by current value",
    funnelStages: {
      prospecting: "Prospecting",
      qualification: "Qualification",
      proposal: "Proposal",
      negotiation: "Negotiation",
      closedWon: "Closed Won",
    },
    leadSources: {
      website: "Website",
      referral: "Referral",
      events: "Events",
      coldCall: "Cold Call",
      social: "Social Media",
    },
    pipelineHealthCards: {
      strong: {
        title: "Strong Pipeline",
        description: (activeValue: string) =>
          `${activeValue} in active opportunities`,
      },
      followUp: {
        title: "Follow-up Needed",
        description: (hotLeads: number) =>
          `${hotLeads} hot leads require attention`,
      },
      closingSoon: {
        title: "Closing Soon",
        description: (count: number) =>
          `${count} opportunities expected to close this month`,
      },
    },
    metrics: {
      pipelineCoverage: "Pipeline Coverage",
      conversion: "Conversion",
      dealsClosingSoon: "Deals Closing Soon",
      totalLeads: "Total Leads",
      openOpportunities: "Open Opportunities",
      totalPipelineValue: "Total Pipeline Value",
      wonThisMonth: "Won This Month",
      winRate: "Win Rate",
      leadConversionRate: "Lead Conversion Rate",
      averageDealSize: "Average Deal Size",
    },
    subtitles: {
      againstQuarterlyTarget: "against quarterly target",
      qualifiedLeads: "qualified leads",
      within30Days: "within 30 days",
      hotLeads: "hot leads",
      closingWithin30Days: "closing within 30 days",
      highValueDeals: "high-value deals",
      vsLastMonth: "vs. last month",
      last90Days: "Last 90 days",
      acrossAllOpenOpportunities: "Across all open opportunities",
      ofLeadsQualified: "of leads qualified",
    },
    notes: {
      bestMomentum: "Best Momentum",
      attentionNeeded: "Attention Needed",
      executionQuality: "Execution Quality",
      bestMomentumBody: (highValueDeals: number) =>
        `${highValueDeals} enterprise opportunities. Large deal mix remains healthy with strong late-stage value.`,
      attentionNeededBody: (hotLeads: number) =>
        `${hotLeads} hot leads awaiting follow-up. Re-engaging these prospects quickly should improve conversion this week.`,
      executionQualityBody: (wonThisMonth: number) =>
        `${wonThisMonth} wins recorded this month. Closed business remains steady despite slightly slower month-over-month pace.`,
    },
    topOppLabels: {
      stage: "Stage",
      value: "Value",
      owner: "Owner",
    },
  },
  tr: {
    title: "Satış Komuta Merkezi",
    intro:
      "Pipeline sağlığını, tahmin güvenini ve kısa vadeli yürütmeyi tek bir düzenli çalışma alanında takip edin.",
    lastUpdated: "Son güncelleme",
    performanceSnapshot: "Performans Özeti",
    executiveNotes: "Yönetici Notları",
    salesFunnel: "Satış Hunisi",
    leadSourcesHeading: "Lead Kaynakları",
    pipelineHealth: "Pipeline Sağlığı",
    topOpportunities: "En İyi Fırsatlar",
    largestDeals: "Mevcut değere göre en büyük fırsatlar",
    funnelStages: {
      prospecting: "Keşif",
      qualification: "Nitelendirme",
      proposal: "Teklif",
      negotiation: "Müzakere",
      closedWon: "Kazanıldı",
    },
    leadSources: {
      website: "Web Sitesi",
      referral: "Referans",
      events: "Etkinlikler",
      coldCall: "Soğuk Arama",
      social: "Sosyal Medya",
    },
    pipelineHealthCards: {
      strong: {
        title: "Güçlü Pipeline",
        description: (activeValue: string) =>
          `Aktif fırsatlarda ${activeValue} bulunuyor`,
      },
      followUp: {
        title: "Takip Gerekli",
        description: (hotLeads: number) =>
          `${hotLeads} sıcak lead takip bekliyor`,
      },
      closingSoon: {
        title: "Yakında Kapanacak",
        description: (count: number) =>
          `${count} fırsatın bu ay kapanması bekleniyor`,
      },
    },
    metrics: {
      pipelineCoverage: "Pipeline Kapsamı",
      conversion: "Dönüşüm",
      dealsClosingSoon: "Yakında Kapanacak İşler",
      totalLeads: "Toplam Lead",
      openOpportunities: "Açık Fırsatlar",
      totalPipelineValue: "Toplam Pipeline Değeri",
      wonThisMonth: "Bu Ay Kazanılan",
      winRate: "Kazanma Oranı",
      leadConversionRate: "Lead Dönüşüm Oranı",
      averageDealSize: "Ortalama İş Büyüklüğü",
    },
    subtitles: {
      againstQuarterlyTarget: "çeyreklik hedefe göre",
      qualifiedLeads: "nitelikli lead",
      within30Days: "30 gün içinde",
      hotLeads: "sıcak lead",
      closingWithin30Days: "30 gün içinde kapanacak",
      highValueDeals: "yüksek değerli işler",
      vsLastMonth: "geçen aya göre",
      last90Days: "Son 90 gün",
      acrossAllOpenOpportunities: "Tüm açık fırsatlar arasında",
      ofLeadsQualified: "lead niteliklendi",
    },
    notes: {
      bestMomentum: "En Güçlü Momentum",
      attentionNeeded: "Dikkat Gerekiyor",
      executionQuality: "Yürütme Kalitesi",
      bestMomentumBody: (highValueDeals: number) =>
        `${highValueDeals} kurumsal fırsat. Büyük iş karması, geç aşamadaki güçlü değer sayesinde sağlıklı kalıyor.`,
      attentionNeededBody: (hotLeads: number) =>
        `${hotLeads} sıcak lead takip bekliyor. Bu potansiyelleri hızlıca yeniden devreye almak bu hafta dönüşümü artırmalı.`,
      executionQualityBody: (wonThisMonth: number) =>
        `${wonThisMonth} kazanım bu ay kaydedildi. Aylık hız biraz yavaşlamış olsa da kapanan iş hacmi istikrarlı kalıyor.`,
    },
    topOppLabels: {
      stage: "Aşama",
      value: "Değer",
      owner: "Sahip",
    },
  },
} as const;

export const chartCopy = {
  en: {
    deals: "deals",
    conversion: "Conversion",
    leads: "leads",
  },
  tr: {
    deals: "fırsat",
    conversion: "Dönüşüm",
    leads: "lead",
  },
} as const;

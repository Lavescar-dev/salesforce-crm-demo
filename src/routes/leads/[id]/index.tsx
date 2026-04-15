import { $, component$, useVisibleTask$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import {
  ArrowLeftIcon,
  CalendarIcon,
  CheckCircleIcon,
  DollarSignIcon,
  EditIcon,
  FileTextIcon,
  MailIcon,
  PhoneIcon,
  Trash2Icon,
} from "lucide-qwik";
import { Link, useLocation, useNavigate } from "@builder.io/qwik-city";
import { useDemoData } from "~/data/demo-state";
import { deleteLead } from "~/data/mock-data";
import { useLocale } from "~/data/i18n";

const leadStatusLabels = {
  en: {
    Hot: "Hot",
    Qualified: "Qualified",
    Contacted: "Contacted",
    New: "New",
    Cold: "Cold",
  },
  tr: {
    Hot: "Sıcak",
    Qualified: "Nitelikli",
    Contacted: "İletişim Kuruldu",
    New: "Yeni",
    Cold: "Soğuk",
  },
} as const;

const leadSourceLabels = {
  en: {
    Website: "Website",
    Referral: "Referral",
    Event: "Event",
    "Cold Call": "Cold Call",
    "Social Media": "Social Media",
  },
  tr: {
    Website: "Web Sitesi",
    Referral: "Referans",
    Event: "Etkinlik",
    "Cold Call": "Soğuk Arama",
    "Social Media": "Sosyal Medya",
  },
} as const;

const leadDetailCopy = {
  en: {
    backToLeads: "Back to Leads",
    delete: "Delete",
    editLead: "Edit Lead",
    notFound: "Lead not found",
    contactInformation: "Contact Information",
    email: "Email",
    phone: "Phone",
    company: "Company",
    leadSource: "Lead Source",
    leadDetails: "Lead Details",
    potentialValue: "Potential Value",
    status: "Status",
    createdDate: "Created Date",
    activityTimeline: "Activity Timeline",
    emailSent: "Email sent",
    emailSentBody: "Follow-up email sent to discuss product features",
    phoneCall: "Phone call",
    phoneCallBody: "Initial discovery call completed - 30 minutes",
    leadCreated: "Lead created",
    leadCreatedBody: (source: string) => `Lead added from ${source}`,
    daysAgo2: "2 days ago",
    daysAgo5: "5 days ago",
    createdOn: "created on",
    quickActions: "Quick Actions",
    sendEmail: "Send Email",
    makeCall: "Make Call",
    scheduleMeeting: "Schedule Meeting",
    leadScore: "Lead Score",
    highQualityLead: "High quality lead",
    engagement: "Engagement",
    fitScore: "Fit Score",
    intent: "Intent",
    relatedOpportunities: "Related Opportunities",
    noOpportunitiesYet: "No opportunities created yet.",
    convertToOpportunity: "Convert to Opportunity",
  },
  tr: {
    backToLeads: "Adalara Dön",
    delete: "Sil",
    editLead: "Adayı Düzenle",
    notFound: "Aday bulunamadı",
    contactInformation: "İletişim Bilgileri",
    email: "E-posta",
    phone: "Telefon",
    company: "Şirket",
    leadSource: "Lead Kaynağı",
    leadDetails: "Aday Detayları",
    potentialValue: "Potansiyel Değer",
    status: "Durum",
    createdDate: "Oluşturulma Tarihi",
    activityTimeline: "Aktivite Zaman Çizelgesi",
    emailSent: "E-posta gönderildi",
    emailSentBody:
      "Ürün özelliklerini görüşmek için takip e-postası gönderildi",
    phoneCall: "Telefon görüşmesi",
    phoneCallBody: "İlk keşif görüşmesi tamamlandı - 30 dakika",
    leadCreated: "Aday oluşturuldu",
    leadCreatedBody: (source: string) => `${source} kaynağından aday eklendi`,
    daysAgo2: "2 gün önce",
    daysAgo5: "5 gün önce",
    createdOn: "oluşturulma tarihi",
    quickActions: "Hızlı İşlemler",
    sendEmail: "E-posta Gönder",
    makeCall: "Arama Yap",
    scheduleMeeting: "Toplantı Planla",
    leadScore: "Aday Skoru",
    highQualityLead: "Yüksek kaliteli aday",
    engagement: "Etkileşim",
    fitScore: "Uyum Skoru",
    intent: "Niyet",
    relatedOpportunities: "İlişkili Fırsatlar",
    noOpportunitiesYet: "Henüz fırsat oluşturulmadı.",
    convertToOpportunity: "Fırsata Dönüştür",
  },
} as const;

export default component$(() => {
  const locale = useLocale();
  const copy = leadDetailCopy[locale.value];
  const demoData = useDemoData();
  const location = useLocation();
  const navigate = useNavigate();
  const id = location.params.id;
  const lead = demoData.leads.find((item) => item.id === id);
  const relatedOpportunities = [] as typeof demoData.opportunities;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Hot":
        return "bg-rose-100 text-rose-800";
      case "Qualified":
        return "bg-emerald-100 text-emerald-800";
      case "Contacted":
        return "bg-blue-100 text-blue-800";
      case "New":
        return "bg-slate-100 text-slate-800";
      case "Cold":
        return "bg-slate-100 text-slate-700";
      default:
        return "bg-slate-100 text-slate-800";
    }
  };

  const getSourceColor = (source: string) => {
    switch (source) {
      case "Website":
        return "bg-blue-50 text-blue-700";
      case "Referral":
        return "bg-emerald-50 text-emerald-700";
      case "Event":
        return "bg-violet-50 text-violet-700";
      case "Cold Call":
        return "bg-amber-50 text-amber-700";
      case "Social Media":
        return "bg-pink-50 text-pink-700";
      default:
        return "bg-slate-50 text-slate-700";
    }
  };
  const surfaceCardClass =
    "group rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md sm:p-6";
  const numberLocale = locale.value === "tr" ? "tr-TR" : "en-US";

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(() => {
    document.title = locale.value === "tr" ? "Aday Detayı" : "Lead Detail";
  });

  const handleDelete = $(() => {
    if (
      window.confirm(
        locale.value === "tr"
          ? "Bu adayı silmek istediğine emin misin?"
          : "Are you sure you want to delete this lead?",
      )
    ) {
      deleteLead(demoData, id);
      navigate("/leads");
    }
  });

  if (!lead) {
    return (
      <div class="p-4 sm:p-6">
        <div class="rounded-xl border border-slate-200 bg-white p-12 text-center shadow-sm">
          <p class="text-slate-500">{copy.notFound}</p>
          <Link
            href="/leads"
            class="mt-4 inline-block text-blue-700 transition hover:text-blue-800"
          >
            {copy.backToLeads}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div class="space-y-4 p-4 sm:space-y-6 sm:p-6">
      <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div class="flex items-center gap-3 sm:gap-4">
          <Link
            href="/leads"
            class="flex-shrink-0 rounded-xl border border-slate-200 bg-white p-2 text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
          >
            <ArrowLeftIcon class="h-5 w-5" />
          </Link>
          <div class="min-w-0">
            <h1 class="truncate text-2xl font-semibold text-slate-900 sm:text-3xl">
              {lead.name}
            </h1>
            <p class="mt-1 truncate text-sm text-slate-600 sm:text-base">
              {lead.company}
            </p>
          </div>
        </div>

        <div class="flex items-center gap-2 sm:gap-3">
          <button
            onClick$={handleDelete}
            class="flex items-center justify-center gap-2 rounded-xl border border-rose-200 bg-white px-3 py-2 text-rose-700 transition hover:bg-rose-50 sm:px-4"
          >
            <Trash2Icon class="h-4 w-4 sm:h-5 sm:w-5" />
            <span class="text-xs font-medium sm:text-sm">{copy.delete}</span>
          </button>
          <Link
            href={`/leads/${id}/edit`}
            class="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-3 py-2 text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 sm:px-4"
          >
            <EditIcon class="h-4 w-4 sm:h-5 sm:w-5" />
            <span class="text-xs font-medium sm:text-sm">{copy.editLead}</span>
          </Link>
        </div>
      </div>

      <div class="flex flex-wrap items-center gap-2 sm:gap-3">
        <span
          class={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium sm:px-3 sm:text-sm ${getStatusColor(lead.status)}`}
        >
          {leadStatusLabels[locale.value][lead.status]}
        </span>
        <span
          class={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium sm:px-3 sm:text-sm ${getSourceColor(lead.source)}`}
        >
          {leadSourceLabels[locale.value][lead.source]}
        </span>
      </div>

      <div class="grid grid-cols-1 gap-4 lg:grid-cols-3 sm:gap-6">
        <div class="space-y-4 lg:col-span-2 sm:space-y-6">
          <div class={surfaceCardClass}>
            <h2 class="mb-4 text-base font-semibold text-slate-900 sm:text-lg">
              {copy.contactInformation}
            </h2>
            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
              <div class="flex items-start gap-3">
                <div class="rounded-xl bg-blue-50 p-2 transition duration-200 group-hover:scale-105">
                  <MailIcon class="h-4 w-4 text-blue-600 sm:h-5 sm:w-5" />
                </div>
                <div class="min-w-0">
                  <p class="text-xs text-slate-600 sm:text-sm">{copy.email}</p>
                  <a
                    href={`mailto:${lead.email}`}
                    class="mt-1 break-all text-sm font-medium text-blue-700 transition hover:text-blue-800 sm:text-base"
                  >
                    {lead.email}
                  </a>
                </div>
              </div>
              <div class="flex items-start gap-3">
                <div class="rounded-xl bg-emerald-50 p-2 transition duration-200 group-hover:scale-105">
                  <PhoneIcon class="h-4 w-4 text-emerald-600 sm:h-5 sm:w-5" />
                </div>
                <div class="min-w-0">
                  <p class="text-xs text-slate-600 sm:text-sm">{copy.phone}</p>
                  <a
                    href={`tel:${lead.phone}`}
                    class="mt-1 text-sm font-medium text-slate-900 transition hover:text-blue-700 sm:text-base"
                  >
                    {lead.phone}
                  </a>
                </div>
              </div>
              <div class="flex items-start gap-3">
                <div class="rounded-xl bg-violet-50 p-2 transition duration-200 group-hover:scale-105">
                  <FileTextIcon class="h-4 w-4 text-violet-600 sm:h-5 sm:w-5" />
                </div>
                <div class="min-w-0">
                  <p class="text-xs text-slate-600 sm:text-sm">
                    {copy.company}
                  </p>
                  <p class="mt-1 text-sm font-medium text-slate-900 sm:text-base">
                    {lead.company}
                  </p>
                </div>
              </div>
              <div class="flex items-start gap-3">
                <div class="rounded-xl bg-amber-50 p-2 transition duration-200 group-hover:scale-105">
                  <FileTextIcon class="h-4 w-4 text-amber-600 sm:h-5 sm:w-5" />
                </div>
                <div class="min-w-0">
                  <p class="text-xs text-slate-600 sm:text-sm">
                    {copy.leadSource}
                  </p>
                  <p class="mt-1 text-sm font-medium text-slate-900 sm:text-base">
                    {leadSourceLabels[locale.value][lead.source]}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div class={surfaceCardClass}>
            <h2 class="mb-4 text-base font-semibold text-slate-900 sm:text-lg">
              {copy.leadDetails}
            </h2>
            <div class="space-y-3 sm:space-y-4">
              <div class="flex items-center justify-between border-b border-slate-100 py-3">
                <div class="flex items-center gap-2 sm:gap-3">
                  <DollarSignIcon class="h-4 w-4 text-slate-400 sm:h-5 sm:w-5" />
                  <span class="text-xs text-slate-600 sm:text-sm">
                    {copy.potentialValue}
                  </span>
                </div>
                <span class="text-sm font-semibold text-slate-900 sm:text-base">
                  ${new Intl.NumberFormat(numberLocale).format(lead.value)}
                </span>
              </div>
              <div class="flex items-center justify-between border-b border-slate-100 py-3">
                <div class="flex items-center gap-2 sm:gap-3">
                  <FileTextIcon class="h-4 w-4 text-slate-400 sm:h-5 sm:w-5" />
                  <span class="text-xs text-slate-600 sm:text-sm">
                    {copy.status}
                  </span>
                </div>
                <span
                  class={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(lead.status)}`}
                >
                  {leadStatusLabels[locale.value][lead.status]}
                </span>
              </div>
              <div class="flex items-center justify-between border-b border-slate-100 py-3">
                <div class="flex items-center gap-2 sm:gap-3">
                  <CalendarIcon class="h-4 w-4 text-slate-400 sm:h-5 sm:w-5" />
                  <span class="text-xs text-slate-600 sm:text-sm">
                    {copy.createdDate}
                  </span>
                </div>
                <span class="text-sm text-slate-900 sm:text-base">
                  {new Date(lead.createdAt).toLocaleDateString(
                    locale.value === "tr" ? "tr-TR" : "en-US",
                    {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    },
                  )}
                </span>
              </div>
            </div>
          </div>

          <div class={surfaceCardClass}>
            <h2 class="mb-4 text-base font-semibold text-slate-900 sm:text-lg">
              {copy.activityTimeline}
            </h2>
            <div class="space-y-4">
              <div class="group flex gap-3 rounded-xl px-2 py-2 transition duration-200 hover:bg-slate-50 sm:gap-4">
                <div class="flex flex-col items-center flex-shrink-0">
                  <div class="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 transition duration-200 group-hover:scale-105">
                    <MailIcon class="h-4 w-4 text-blue-600" />
                  </div>
                  <div class="mt-2 h-full w-0.5 bg-slate-200" />
                </div>
                <div class="min-w-0 flex-1 pb-6">
                  <p class="text-xs font-medium text-slate-900 sm:text-sm">
                    {copy.emailSent}
                  </p>
                  <p class="mt-1 text-xs text-slate-600 sm:text-sm">
                    {copy.emailSentBody}
                  </p>
                  <p class="mt-2 text-xs text-slate-500">{copy.daysAgo2}</p>
                </div>
              </div>
              <div class="group flex gap-3 rounded-xl px-2 py-2 transition duration-200 hover:bg-slate-50 sm:gap-4">
                <div class="flex flex-col items-center flex-shrink-0">
                  <div class="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 transition duration-200 group-hover:scale-105">
                    <PhoneIcon class="h-4 w-4 text-emerald-600" />
                  </div>
                  <div class="mt-2 h-full w-0.5 bg-slate-200" />
                </div>
                <div class="min-w-0 flex-1 pb-6">
                  <p class="text-xs font-medium text-slate-900 sm:text-sm">
                    {copy.phoneCall}
                  </p>
                  <p class="mt-1 text-xs text-slate-600 sm:text-sm">
                    {copy.phoneCallBody}
                  </p>
                  <p class="mt-2 text-xs text-slate-500">{copy.daysAgo5}</p>
                </div>
              </div>
              <div class="group flex gap-3 rounded-xl px-2 py-2 transition duration-200 hover:bg-slate-50 sm:gap-4">
                <div class="flex flex-col items-center flex-shrink-0">
                  <div class="flex h-8 w-8 items-center justify-center rounded-full bg-violet-100 transition duration-200 group-hover:scale-105">
                    <CheckCircleIcon class="h-4 w-4 text-violet-600" />
                  </div>
                </div>
                <div class="min-w-0 flex-1">
                  <p class="text-xs font-medium text-slate-900 sm:text-sm">
                    {copy.leadCreated}
                  </p>
                  <p class="mt-1 text-xs text-slate-600 sm:text-sm">
                    {copy.leadCreatedBody(
                      leadSourceLabels[locale.value][lead.source],
                    )}
                  </p>
                  <p class="mt-2 text-xs text-slate-500">
                    {new Date(lead.createdAt).toLocaleDateString(
                      locale.value === "tr" ? "tr-TR" : "en-US",
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="space-y-4 sm:space-y-6">
          <div class={surfaceCardClass}>
            <h3 class="mb-4 text-sm font-semibold text-slate-900 sm:text-base">
              {copy.quickActions}
            </h3>
            <div class="space-y-2">
              <a
                href={`mailto:${lead.email}?subject=${encodeURIComponent(
                  locale.value === "tr"
                    ? `${lead.name} ile takip`
                    : `Following up with ${lead.name}`,
                )}`}
                class="group flex w-full items-center gap-3 rounded-xl bg-blue-50 px-3 py-2.5 text-left text-blue-700 transition duration-200 hover:-translate-y-0.5 hover:bg-blue-100 hover:shadow-sm sm:px-4 sm:py-3"
              >
                <MailIcon class="h-4 w-4 flex-shrink-0 transition duration-200 group-hover:scale-105 sm:h-5 sm:w-5" />
                <span class="text-xs font-medium sm:text-sm">
                  {copy.sendEmail}
                </span>
              </a>
              <a
                href={`tel:${lead.phone}`}
                class="group flex w-full items-center gap-3 rounded-xl bg-emerald-50 px-3 py-2.5 text-left text-emerald-700 transition duration-200 hover:-translate-y-0.5 hover:bg-emerald-100 hover:shadow-sm sm:px-4 sm:py-3"
              >
                <PhoneIcon class="h-4 w-4 flex-shrink-0 transition duration-200 group-hover:scale-105 sm:h-5 sm:w-5" />
                <span class="text-xs font-medium sm:text-sm">
                  {copy.makeCall}
                </span>
              </a>
              <a
                href={`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
                  locale.value === "tr"
                    ? `${lead.name} ile toplantı`
                    : `Meeting with ${lead.name}`,
                )}&details=${encodeURIComponent(
                  locale.value === "tr"
                    ? `${lead.company} ile takip`
                    : `Follow up with ${lead.company}`,
                )}`}
                target="_blank"
                rel="noreferrer"
                class="group flex w-full items-center gap-3 rounded-xl bg-violet-50 px-3 py-2.5 text-left text-violet-700 transition duration-200 hover:-translate-y-0.5 hover:bg-violet-100 hover:shadow-sm sm:px-4 sm:py-3"
              >
                <CalendarIcon class="h-4 w-4 flex-shrink-0 transition duration-200 group-hover:scale-105 sm:h-5 sm:w-5" />
                <span class="text-xs font-medium sm:text-sm">
                  {copy.scheduleMeeting}
                </span>
              </a>
            </div>
          </div>

          <div class={surfaceCardClass}>
            <h3 class="mb-4 text-sm font-semibold text-slate-900 sm:text-base">
              {copy.leadScore}
            </h3>
            <div class="text-center">
              <div class="mb-3 inline-flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-violet-600 text-white sm:h-24 sm:w-24">
                <span class="text-2xl font-bold sm:text-3xl">85</span>
              </div>
              <p class="text-xs text-slate-600 sm:text-sm">
                {copy.highQualityLead}
              </p>
              <div class="mt-4 space-y-2 text-sm">
                <div class="flex items-center justify-between text-xs sm:text-sm">
                  <span class="text-slate-600">{copy.engagement}</span>
                  <span class="font-medium text-slate-900">90%</span>
                </div>
                <div class="h-2 overflow-hidden rounded-full bg-slate-100">
                  <div class="h-full w-[90%] rounded-full bg-blue-500" />
                </div>
                <div class="flex items-center justify-between text-xs sm:text-sm">
                  <span class="text-slate-600">{copy.fitScore}</span>
                  <span class="font-medium text-slate-900">80%</span>
                </div>
                <div class="h-2 overflow-hidden rounded-full bg-slate-100">
                  <div class="h-full w-[80%] rounded-full bg-violet-500" />
                </div>
                <div class="flex items-center justify-between text-xs sm:text-sm">
                  <span class="text-slate-600">{copy.intent}</span>
                  <span class="font-medium text-slate-900">85%</span>
                </div>
                <div class="h-2 overflow-hidden rounded-full bg-slate-100">
                  <div class="h-full w-[85%] rounded-full bg-emerald-500" />
                </div>
              </div>
            </div>
          </div>

          <div class={surfaceCardClass}>
            <h3 class="mb-4 text-sm font-semibold text-slate-900 sm:text-base">
              {copy.relatedOpportunities}
            </h3>
            {relatedOpportunities.length > 0 ? (
              <div class="space-y-3">
                {relatedOpportunities.map((opportunity) => (
                  <div
                    key={opportunity.id}
                    class="rounded-xl border border-slate-200 bg-slate-50 p-4 transition duration-200 hover:-translate-y-0.5 hover:bg-slate-100/70 hover:shadow-sm"
                  >
                    <p class="text-sm font-medium text-slate-900">
                      {opportunity.name}
                    </p>
                    <p class="mt-1 text-xs text-slate-500">
                      {opportunity.stage}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div class="space-y-3">
                <p class="text-sm text-slate-500">{copy.noOpportunitiesYet}</p>
                <Link
                  href={`/opportunities/new?account=${encodeURIComponent(lead.company)}`}
                  class="inline-flex items-center justify-center rounded-xl border border-blue-200 bg-white px-4 py-2 text-sm font-medium text-blue-700 transition hover:bg-blue-50"
                >
                  {copy.convertToOpportunity}
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});

export const head: DocumentHead = {
  title: "Lead Detail",
  meta: [
    {
      name: "description",
      content: "Inspect and edit a lead in the Qwik CRM demo.",
    },
  ],
};

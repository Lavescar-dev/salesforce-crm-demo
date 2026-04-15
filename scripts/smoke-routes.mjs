const baseUrl = process.argv[2] || process.env.SMOKE_BASE_URL;

if (!baseUrl) {
  console.error("Usage: npm run smoke:routes -- <base-url>");
  console.error("Example: npm run smoke:routes -- http://127.0.0.1:4173");
  process.exit(2);
}

const routes = [
  "/",
  "/dashboard",
  "/leads",
  "/leads/new",
  "/leads/1",
  "/leads/1/edit",
  "/opportunities",
  "/opportunities/1",
  "/opportunities/1/edit",
  "/accounts",
  "/accounts/1",
  "/accounts/1/edit",
  "/contacts",
  "/contacts/1",
  "/contacts/1/edit",
  "/quotes",
  "/quotes/1",
  "/quotes/1/edit",
  "/orders",
  "/orders/1",
  "/orders/1/edit",
  "/invoices",
  "/invoices/1",
  "/invoices/1/edit",
  "/search?q=tech",
];

const normalizeBaseUrl = (value) => {
  const parsed = new URL(value);
  parsed.pathname = parsed.pathname.replace(/\/+$/, "");
  return parsed;
};

const fetchWithTimeout = async (url, timeoutMs = 10000) => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(url, {
      headers: {
        "user-agent": "salesforce-crm-demo-smoke/1.0",
      },
      redirect: "follow",
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timer);
  }
};

const base = normalizeBaseUrl(baseUrl);
const failures = [];

for (const route of routes) {
  const url = new URL(route, base);

  try {
    const response = await fetchWithTimeout(url);

    if (response.status !== 200) {
      failures.push(`${route} -> ${response.status}`);
      continue;
    }

    console.log(`ok ${route}`);
  } catch (error) {
    failures.push(`${route} -> ${error.message}`);
  }
}

if (failures.length > 0) {
  console.error("\nSmoke route failures:");
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log(`\nSmoke routes passed for ${base.origin}`);

import crypto from "crypto";
import type { BenchmarkDataset } from "@/types/benchmark";
import { computeRankingScore } from "@/lib/benchmarkRanking";
import { getFallbackBenchmarks } from "@/lib/benchmarkFallback";

const getEnv = (key: string) => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`${key} is not set`);
  }
  return value;
};

const getPrivateKey = () =>
  getEnv("GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY").replace(/\\n/g, "\n");

const getAccessToken = async () => {
  const clientEmail = getEnv("GOOGLE_SERVICE_ACCOUNT_EMAIL");
  const privateKey = getPrivateKey();
  const now = Math.floor(Date.now() / 1000);
  const payload = {
    iss: clientEmail,
    scope: "https://www.googleapis.com/auth/spreadsheets",
    aud: "https://oauth2.googleapis.com/token",
    exp: now + 3600,
    iat: now,
  };

  const header = { alg: "RS256", typ: "JWT" };
  const encode = (data: object) =>
    Buffer.from(JSON.stringify(data)).toString("base64url");
  const unsignedToken = `${encode(header)}.${encode(payload)}`;

  const signer = crypto.createSign("RSA-SHA256");
  signer.update(unsignedToken);
  const signature = signer.sign(privateKey).toString("base64url");
  const jwt = `${unsignedToken}.${signature}`;

  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: jwt,
    }),
    cache: "no-store",
  });

  const data = (await response.json()) as { access_token?: string };
  if (!data.access_token) {
    throw new Error("Failed to obtain access token");
  }
  return data.access_token;
};

type SheetOverride = {
  spreadsheetId?: string;
  sheetTab?: string;
};

const getSheetConfig = (override?: SheetOverride) => {
  const spreadsheetId = override?.spreadsheetId ?? getEnv("GOOGLE_SHEETS_ID");
  const overrideTab = override?.sheetTab?.trim();
  const range = overrideTab
    ? `${overrideTab}!A1:N`
    : process.env.GOOGLE_SHEETS_RANGE ?? "Benchmarks!A1:N";
  const sheetTab = overrideTab || range.split("!")[0] || "Benchmarks";
  return { spreadsheetId, range, sheetTab };
};

const fetchSheetIdByTitle = async (
  token: string,
  spreadsheetId: string,
  title: string
) => {
  const response = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}?fields=sheets(properties(sheetId,title))`,
    {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    }
  );
  if (!response.ok) {
    return 0;
  }
  const data = (await response.json()) as {
    sheets?: { properties?: { sheetId?: number; title?: string } }[];
  };
  const sheets = data.sheets ?? [];
  const match = sheets.find((sheet) => sheet.properties?.title === title);
  return match?.properties?.sheetId ?? 0;
};

const mapRowToBenchmark = (row: string[]): BenchmarkDataset | null => {
  if (row.length < 14) {
    return null;
  }
  const rawRankingScore = row[11]?.trim();
  const rankingScore = rawRankingScore ? Number(rawRankingScore) : Number.NaN;
  const latency = Number(row[5]) || 0;
  const accuracy = Number(row[6]) || 0;
  const pollingRate = Number(row[7]) || 0;
  const computedRankingScore = Number.isFinite(rankingScore)
    ? rankingScore
    : computeRankingScore(latency, accuracy, pollingRate);
  return {
    id: row[0],
    name: row[1],
    category: row[2],
    subcategory: row[3],
    brand: row[4],
    latency,
    accuracy,
    pollingRate,
    labScore: Number(row[8]),
    tier: row[9],
    image: row[10],
    rankingScore: computedRankingScore,
    testDate: row[12],
    notes: row[13],
    createdAt: row[12],
  };
};

export const fetchBenchmarks = async () => {
  if (
    !process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL ||
    !process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY ||
    !process.env.GOOGLE_SHEETS_ID
  ) {
    return getFallbackBenchmarks();
  }
  const token = await getAccessToken();
  const { spreadsheetId, range } = getSheetConfig();
  const url = new URL(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}`
  );
  try {
    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
      next: { revalidate: 300 },
    });
    if (!response.ok) {
      return getFallbackBenchmarks();
    }
    const data = (await response.json()) as { values?: string[][] };
    const rows = data.values ?? [];
    const [header, ...values] = rows;
    if (!header) {
      return getFallbackBenchmarks();
    }
    const mapped = values
      .map(mapRowToBenchmark)
      .filter((item): item is BenchmarkDataset => Boolean(item));
    return mapped.length ? mapped : getFallbackBenchmarks();
  } catch {
    return getFallbackBenchmarks();
  }
};

export const appendBenchmark = async (
  benchmark: BenchmarkDataset,
  override?: SheetOverride
) => {
  const token = await getAccessToken();
  const { spreadsheetId, range } = getSheetConfig(override);
  const rankingScoreValue =
    Number.isFinite(benchmark.rankingScore) && benchmark.rankingScore > 0
      ? benchmark.rankingScore
      : "";
  const response = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}:append?valueInputOption=USER_ENTERED`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        values: [
          [
            benchmark.id,
            benchmark.name,
            benchmark.category,
            benchmark.subcategory,
            benchmark.brand,
            benchmark.latency,
            benchmark.accuracy,
            benchmark.pollingRate,
            benchmark.labScore,
            benchmark.tier,
            benchmark.image,
            rankingScoreValue,
            benchmark.testDate,
            benchmark.notes,
          ],
        ],
      }),
    }
  );
  if (!response.ok) {
    throw new Error("Failed to append benchmark");
  }
};

export const updateBenchmark = async (
  benchmark: BenchmarkDataset,
  override?: SheetOverride
) => {
  const token = await getAccessToken();
  const { spreadsheetId, range, sheetTab } = getSheetConfig(override);
  const rankingScoreValue =
    Number.isFinite(benchmark.rankingScore) && benchmark.rankingScore > 0
      ? benchmark.rankingScore
      : "";
  const response = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}`,
    {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    }
  );
  const data = (await response.json()) as { values?: string[][] };
  const rows = data.values ?? [];
  const [, ...values] = rows;
  const rowIndex = values.findIndex((row) => row[0] === benchmark.id);
  if (rowIndex === -1) {
    throw new Error("Benchmark not found");
  }
  const targetRange = `${sheetTab}!A${rowIndex + 2}:N${rowIndex + 2}`;
  const updateResponse = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${targetRange}?valueInputOption=USER_ENTERED`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        values: [
          [
            benchmark.id,
            benchmark.name,
            benchmark.category,
            benchmark.subcategory,
            benchmark.brand,
            benchmark.latency,
            benchmark.accuracy,
            benchmark.pollingRate,
            benchmark.labScore,
            benchmark.tier,
            benchmark.image,
            rankingScoreValue,
            benchmark.testDate,
            benchmark.notes,
          ],
        ],
      }),
    }
  );
  if (!updateResponse.ok) {
    throw new Error("Failed to update benchmark");
  }
};

export const deleteBenchmark = async (id: string, override?: SheetOverride) => {
  const token = await getAccessToken();
  const { spreadsheetId, sheetTab } = getSheetConfig(override);
  const response = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${sheetTab}!A1:N`,
    {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    }
  );
  const data = (await response.json()) as { values?: string[][] };
  const rows = data.values ?? [];
  const [, ...values] = rows;
  const rowIndex = values.findIndex((row) => row[0] === id);
  if (rowIndex === -1) {
    throw new Error("Benchmark not found");
  }
  const sheetId = await fetchSheetIdByTitle(token, spreadsheetId, sheetTab);
  const deleteResponse = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}:batchUpdate`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        requests: [
          {
            deleteDimension: {
              range: {
                sheetId,
                dimension: "ROWS",
                startIndex: rowIndex + 1,
                endIndex: rowIndex + 2,
              },
            },
          },
        ],
      }),
    }
  );
  if (!deleteResponse.ok) {
    throw new Error("Failed to delete benchmark");
  }
};

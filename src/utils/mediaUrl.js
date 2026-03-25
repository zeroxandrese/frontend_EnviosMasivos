const BASE_URL =
  typeof window !== "undefined"
    ? window.location.origin
    : "http://localhost:4000"; // fallback

export const normalizeMediaUrl = (value) => {
  if (typeof value !== "string") return null;

  const trimmed = value.trim();
  if (!trimmed) return null;

  // ya válidas
  if (
    trimmed.startsWith("blob:") ||
    trimmed.startsWith("data:") ||
    trimmed.startsWith("http://") ||
    trimmed.startsWith("https://")
  ) {
    return trimmed;
  }

  // 🔥 AQUÍ ESTÁ EL FIX REAL
  if (trimmed.startsWith("/")) {
    return `${BASE_URL}${trimmed}`;
  }

  if (trimmed.startsWith("public/")) {
    return `${BASE_URL}/${trimmed}`;
  }

  return null;
};

export const isRequestableMediaUrl = (value) => {
  const normalized = normalizeMediaUrl(value);

  if (!normalized) return false;

  return (
    normalized.startsWith("http") ||
    normalized.startsWith("blob:") ||
    normalized.startsWith("data:")
  );
};
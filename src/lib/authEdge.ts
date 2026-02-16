const base64UrlDecode = (input: string) => {
  const padded = input.replace(/-/g, "+").replace(/_/g, "/");
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
};

const base64UrlToString = (input: string) => {
  const bytes = base64UrlDecode(input);
  return new TextDecoder().decode(bytes);
};

export const verifyAdminTokenEdge = async (token: string, secret: string) => {
  const [encodedHeader, encodedPayload, signature] = token.split(".");
  if (!encodedHeader || !encodedPayload || !signature) {
    return null;
  }
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["verify"]
  );
  const data = new TextEncoder().encode(`${encodedHeader}.${encodedPayload}`);
  const signatureBytes = base64UrlDecode(signature);
  const isValid = await crypto.subtle.verify("HMAC", key, signatureBytes, data);
  if (!isValid) {
    return null;
  }
  const payload = JSON.parse(base64UrlToString(encodedPayload)) as {
    role: string;
    exp: number;
  };
  if (payload.exp < Math.floor(Date.now() / 1000) || payload.role !== "admin") {
    return null;
  }
  return payload;
};

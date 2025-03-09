export const normalizeIp = (ip: string | null): string | null => {
  if (!ip) {
    return null;
  }
  ip = ip.trim();
  if (ip.startsWith("[")) {
    return ip.replace(/\[|\]/g, "");
  }

  if (ip === "::1") {
    return "127.0.0.1"; // Convertir IPv6 loopback a IPv4
  }
  return ip;
};

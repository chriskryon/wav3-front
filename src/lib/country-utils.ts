// Utilitário para mapear código ISO 3166-1 alpha-2 para nome do país
// Pode ser expandido conforme necessário
export const countryCodeToName: Record<string, string> = {
  BR: 'Brazil',
  US: 'United States',
  MX: 'Mexico',
  AR: 'Argentina',
  CO: 'Colombia',
  CA: 'Canada',
};

export function getCountryName(code: string | undefined): string {
  if (!code) return '-';
  return countryCodeToName[code.toUpperCase()] || code;
}

// src/lib/id-type-utils.ts
// Helpers para mapear tax_id_type e local_id_type para labels amigáveis

export const TAX_ID_TYPE_LABELS: Record<string, string> = {
  'cpf': 'CPF (Cadastro de Pessoas Físicas)',
  'cnpj': 'CNPJ (Cadastro Nacional da Pessoa Jurídica)',
  'ssn': 'SSN (Social Security Number)',
  'ein': 'EIN (Employer Identification Number)',
  'passport': 'Passaporte',
  'dni': 'DNI (Documento Nacional de Identidad)',
  'other': 'Outro',
};

export const LOCAL_ID_TYPE_LABELS: Record<string, string> = {
  'rg': 'RG (General Registration)',
  'driver_license': 'Carteira de Motorista',
  'voter_id': 'Voter ID',
  'residence_permit': 'Residence Permit',
  'other': 'Other',
};

export function getTaxIdTypeLabel(type?: string): string {
  if (!type) return '';
  return TAX_ID_TYPE_LABELS[type] || type;
}

export function getLocalIdTypeLabel(type?: string): string {
  if (!type) return '';
  return LOCAL_ID_TYPE_LABELS[type] || type;
}

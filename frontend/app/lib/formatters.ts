// Formatadores de apresentação (lógica pura síncrona, sem React).

// Formata um CPF para o padrão xxx.xxx.xxx-xx. Se não tiver 11 dígitos, retorna
// o valor original (evita mascarar dados inesperados).
export const formatarCpf = (cpf: string | undefined | null): string => {
  const digitos = (cpf || "").replace(/\D/g, "");
  if (digitos.length !== 11) return cpf || "";
  return digitos.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
};

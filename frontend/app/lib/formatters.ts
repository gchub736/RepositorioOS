// Formatadores de apresentação (lógica pura síncrona, sem React).

// Formata um CPF para o padrão xxx.xxx.xxx-xx. Se não tiver 11 dígitos, retorna
// o valor original (evita mascarar dados inesperados).
// Converte uma duração em horas para um texto curto e legível (ex.: 480.9 -> "20d 0h").
// Retorna "—" quando não há amostra.
export const formatarDuracaoHoras = (horas: number | null | undefined): string => {
  if (horas === null || horas === undefined) return "—";
  if (horas < 1) {
    const minutos = Math.round(horas * 60);
    return `${minutos}min`;
  }
  if (horas < 24) {
    return `${Math.round(horas * 10) / 10}h`;
  }
  const dias = Math.floor(horas / 24);
  const resto = Math.round(horas % 24);
  return resto > 0 ? `${dias}d ${resto}h` : `${dias}d`;
};

// Máscara progressiva para digitação: vai formatando conforme o usuário digita
// (diferente de formatarCpf, que só formata o CPF já completo).
export const mascararCpf = (valor: string): string => {
  const d = (valor || "").replace(/\D/g, "").slice(0, 11);
  if (d.length <= 3) return d;
  if (d.length <= 6) return `${d.slice(0, 3)}.${d.slice(3)}`;
  if (d.length <= 9) return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6)}`;
  return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6, 9)}-${d.slice(9)}`;
};

export const formatarCpf = (cpf: string | undefined | null): string => {
  const digitos = (cpf || "").replace(/\D/g, "");
  if (digitos.length !== 11) return cpf || "";
  return digitos.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
};

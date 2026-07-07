// Valida se a URL de um anexo aponta para um host confiável (back-end, localhost
// ou o próprio host do front). Lógica pura, sem dependência de React.
export const isUrlSegura = (url: string): boolean => {
  try {
    const parsedUrl = new URL(url);
    const apiEnvUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";
    const backendUrl = new URL(apiEnvUrl);

    const hostAnexo = parsedUrl.hostname.toLowerCase();
    const hostBackend = backendUrl.hostname.toLowerCase();

    // Conjunto de domínios/hosts confiáveis
    const hostnamesConfiaveis = new Set([hostBackend, "localhost", "127.0.0.1"]);

    // Adiciona o hostname onde o frontend está rodando no navegador
    if (typeof window !== "undefined") {
      hostnamesConfiaveis.add(window.location.hostname.toLowerCase());
    }

    return hostnamesConfiaveis.has(hostAnexo);
  } catch {
    return url.startsWith("/") || url.startsWith("./") || url.startsWith("../");
  }
};

import api from "./api";
import { PeriodoEstatisticas } from "../types";

// Métricas do painel (restrito a Admin no back-end).
// `periodo` em dias (0 = todo o histórico); a filtragem é feita pelo back.
export const obterEstatisticas = (periodo: PeriodoEstatisticas = 0) =>
  api.get("/dashboard/estatisticas", { params: { periodo } });

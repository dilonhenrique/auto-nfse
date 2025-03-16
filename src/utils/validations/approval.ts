export function validateApproval(response: string): boolean | string {
  const validResponses = ["y", "yes", "n", "no", "s", "sim", "nao"];
  if (!validResponses.includes(response.toLowerCase())) {
    return "Resposta inválida! Digite s/sim para aprovar ou n/nao para rejeitar.";
  }
  return true;
}

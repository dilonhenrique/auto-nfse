# Emissão automática de Nota fiscal no padrão Abstrato

- Emita Nota Fiscal com usuário e senha
- Escolha todos os dados da nota com valores padrão pré definidos
- Envie sua Nota para financeiro no padrão Abstrato

## Configurar sistema
Para o sistema ser totalmente funcional é preciso definir algumas variáveis de ambiente:

### Usuário (você)
- USER_NAME: Seu nome completo
- USER_CNPJ: Seu Cnpj responsável pela emissão da Nota
- USER_PASS: Sua senha para login no sistema de emissão

### E-mail (SMTP)
- EMAIL_HOST: Host do seu e-mail
- EMAIL_PORT: Porta do e-mail
- EMAIL_USER: Usuário para fazer login
- EMAIL_PASS: Senha para fazer login
- EMAIL_FROM: E-mail remetente
  
### Valores padrão (opcionais)
Para facilitar o envio, você pode configurar pré definições para todos os parâmetros da Nota Fiscal:
- INVOICE_DEFAULT_CNPJ: Cnpj do Tomador
- INVOICE_DEFAULT_VALUE: Valor da Nota Fiscal
- INVOICE_DEFAULT_PIX: Chave do Pix
- INVOICE_DEFAULT_TRIBNAC: Número da Tributação Nacional (formato: 00.00.00)
- INVOICE_DEFAULT_NBS: Número do código NBS (formato: 000000000)
- INVOICE_DEFAULT_CITY: Cidade em que o serviço foi feito
- INVOICE_DEFAULT_EMAIL: E-mail do financeiro que a nota será enviada

*Data de referência é sempre definida como dia 12 do mês anterior, mas pode ser alterada no momento do envio.*

## Para rodar o sistema
Execute `npm run start` no terminal e siga as instruções.
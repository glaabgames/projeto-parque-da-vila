# Parque Vivo — API e banco de dados

Back-end inicial para o aplicativo React Native/Expo Parque Vivo. O projeto é independente do Coleta Fácil.

## Requisitos
- Node.js 18 ou superior
- MySQL 8.0 ou compatível

## 1. Criar o banco
1. Abra MySQL Workbench (ou outro cliente MySQL).
2. Abra e execute `database/schema.sql`.
3. O script cria o banco `parque_vivo`, as tabelas `usuarios`, `quadras`, `agendamentos` e duas quadras de exemplo. Troque os exemplos pelos dados reais do parque.

Para um ambiente local de desenvolvimento, crie um usuário MySQL próprio para a aplicação e conceda acesso apenas ao banco `parque_vivo`. Evite usar a conta `root` na aplicação.

## 2. Configurar o servidor
No terminal, dentro da pasta `parque-vivo-backend`:

```bash
npm install
```

Copie `.env.example` para `.env` e preencha as credenciais reais do MySQL. Troque `JWT_SECRET` por uma chave aleatória longa (mínimo de 32 caracteres). Nunca envie `.env` ao GitHub.

No Windows PowerShell:

```powershell
Copy-Item .env.example .env
npm install
npm run dev
```

O servidor fica disponível em `http://localhost:3000`.

## 3. Rotas da API

| Método | Rota | Autenticação | Uso |
|---|---|---|---|
| GET | `/api/health` | Não | Verificar API e conexão MySQL |
| POST | `/api/auth/cadastro` | Não | Criar conta |
| POST | `/api/auth/login` | Não | Entrar e receber token JWT |
| GET | `/api/auth/me` | Bearer token | Consultar conta atual |
| GET | `/api/quadras` | Não | Listar quadras ativas |
| POST | `/api/agendamentos` | Bearer token | Reservar uma hora |
| GET | `/api/agendamentos` | Bearer token | Listar reservas do usuário |
| PATCH | `/api/agendamentos/:id/cancelar` | Bearer token | Cancelar reserva futura própria |

### Exemplo: cadastro
`POST /api/auth/cadastro`, JSON:

```json
{
  "nome": "Maria Silva",
  "email": "maria@example.com",
  "senha": "umaSenhaForte123"
}
```

### Exemplo: login
`POST /api/auth/login`, JSON:

```json
{
  "email": "maria@example.com",
  "senha": "umaSenhaForte123"
}
```

Copie o valor `token` da resposta. Para rotas protegidas, envie o cabeçalho:

```text
Authorization: Bearer SEU_TOKEN
```

### Exemplo: agendar uma hora
`POST /api/agendamentos`, com token, JSON:

```json
{
  "id_quadra": 1,
  "inicio": "2026-11-05T14:00"
}
```

O horário deve ser futuro e começar em hora cheia. A API calcula o término uma hora depois e confirma automaticamente se estiver livre. O exemplo de data é ilustrativo; use uma data futura ao testar. Os horários são interpretados em UTC nesta primeira versão; antes de produção, definir explicitamente o fuso horário do parque (por exemplo, `America/Sao_Paulo`) e alinhar front-end, API e MySQL.

## 4. Integração com o aplicativo Expo
- Android Emulator: normalmente use `http://10.0.2.2:3000` para acessar o computador host.
- iOS Simulator: normalmente use `http://localhost:3000`.
- Celular físico: use o IP local do computador, por exemplo `http://192.168.0.10:3000`, com ambos na mesma rede Wi-Fi e firewall permitindo a porta 3000.
- Um aplicativo em produção precisa de uma API hospedada com HTTPS; não use `localhost` no celular físico como se fosse o computador.

No front-end, configure uma constante `API_URL` para o endereço adequado. Depois de login, guarde o token de forma segura e envie-o nas chamadas protegidas. Não coloque senha do banco ou `JWT_SECRET` no aplicativo.

## Notas
- Senhas são armazenadas usando bcrypt; nunca em texto puro.
- As consultas usam parâmetros para reduzir risco de SQL injection.
- O agendamento usa transação e bloqueio da linha da quadra para evitar reservas simultâneas conflitantes.
- Ainda não foram definidos horário de funcionamento, antecedência máxima, limites de reservas por usuário, perfis de administrador nem regras para manutenção da quadra. Esses requisitos devem ser confirmados antes de produção.

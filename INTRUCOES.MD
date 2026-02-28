# Sistema de Gerenciamento de Estacionamento com NestJs
```
gerenciamento-de-estacionamento/
├── src/
│   ├── domain/             
│   │   ├── entities/
│   │   │   ├── spot.entity.ts
│   │   │   ├── vehicle.entity.ts
│   │   │   └── parking-ticket.entity.ts
│   │   ├── enums/
│   │   │   ├── spot-status.enum.ts
│   │   │   └── payment-status.enum.ts
│   │   └── interfaces/
│   │       └── repository.interface.ts
│   ├── application/          
│   │   ├── dto/
│   │   │   ├── request/
│   │   │   │   ├── check-in.request.ts
│   │   │   │   └── check-out.request.ts
│   │   │   └── response/
│   │   │       ├── ticket.response.ts
│   │   │       └── error.response.ts
│   │   ├── exceptions/
│   │   │   ├── business.exception.ts
│   │   │   └── resource-not-found.exception.ts
│   │   └── services/
│   │       └── parking.service.ts
│   ├── infrastructure/       
│   │   ├── database/
│   │   │   ├── database.module.ts
│   │   │   ├── database.providers.ts
│   │   │   └── repositories/
│   │   │       ├── implementations/
│   │   │       │   ├── postgres/
│   │   │       │   │   ├── postgres-spot.repository.ts
│   │   │       │   │   ├── postgres-vehicle.repository.ts
│   │   │       │   │   └── postgres-ticket.repository.ts
│   │   │       │   ├── sqlserver/
│   │   │       │   │   ├── sqlserver-spot.repository.ts
│   │   │       │   │   ├── sqlserver-vehicle.repository.ts
│   │   │       │   │   └── sqlserver-ticket.repository.ts
│   │   │       │   └── memory/
│   │   │       │       ├── memory-spot.repository.ts
│   │   │       │       ├── memory-vehicle.repository.ts
│   │   │       │       └── memory-ticket.repository.ts
│   │   │       └── factory/
│   │   │           └── repository.factory.ts
│   │   └── config/
│   │       └── database.config.ts
│   ├── presentation/        
│   │   ├── controllers/
│   │   │   └── parking.controller.ts
│   │   └── filters/
│   │       └── http-exception.filter.ts
│   ├── shared/               
│   │   └── utils/
│   │       └── ticket-code.util.ts
│   ├── app.module.ts
│   └── main.ts
├── test/                    
│   ├── unit/
│   │   ├── domain/
│   │   ├── application/
│   │   └── presentation/
│   ├── integration/
│   └── e2e/
├── docker-compose.yml
├── .env.example
├── .env.test
├── nest-cli.json
├── package.json
├── tsconfig.json
├── INSTRUCOES.md
└── README.md
```
## Pré-requisitos

- Node.js 18+
- npm 
- Docker e Docker Compose (opcional, para PostgreSQL/SQL Server)

## Instalação

```bash
# Instalar dependências
npm install

# Copiar arquivo de ambiente
cp .env.example .env

# Para usar PostgreSQL, edite .env:
DB_TYPE=postgres

# Para usar SQL Server, edite .env:
DB_TYPE=sqlserver
```
### Banco de Dados Docker
```
# Iniciar todos os bancos
docker-compose up -d

# Apenas PostgreSQL
docker-compose up -d postgres

# Apenas SQL Server
docker-compose up -d sqlserver
```
### Executando a Aplicação
```
# Modo desenvolvimento
npm run start:dev

# Modo produção
npm run build
npm run start:prod
```
### Executando Testes
```
# Todos os testes
npm test

# Testes com watch mode
npm run test:watch

# Cobertura de testes
npm run test:cov

# Testes com banco em memória (padrão)
npm run test:memory

# Testes com PostgreSQL
npm run test:postgres

# Testes com SQL Server
npm run test:sqlserver

# Testes e2e
npm run test:e2e
```
## Listar vagas disponíveis
```
curl http://localhost:3000/api/parking/spots/available
```
## Estrutura do Projeto (Clean Architecture)
```
src/
├── domain/          # Entidades e regras de negócio
├── application/     # Casos de uso e DTOs
├── infrastructure/  # Repositórios e configurações
├── presentation/    # Controllers e filters
└── shared/         # Código compartilhado
```
## Para executar com PostgreSQL
```
docker-compose up -d postgres
DB_TYPE=postgres npm run start:dev
```

## Testando os Endpoints
### Endpoint 1: Check-in (Registrar Entrada)
```
POST: http://localhost:3000/api/parking/check-in
```
### Corpo da requisição (JSON):
```
{
  "licensePlate": "ABC1234",
  "model": "Toyota Corolla",
  "color": "Preto"
}
```

### Resposta esperada (201 Created):
```
{
  "ticketCode": "TKT-1A2B3C4D",
  "licensePlate": "ABC1234",
  "spotNumber": "01",
  "checkInTime": "2024-01-15T10:30:45",
  "checkOutTime": null,
  "totalHours": null,
  "totalAmount": null,
  "paymentStatus": "PENDENTE",
  "formattedCheckIn": "15/01/2024 10:30:45",
  "formattedCheckOut": null
}
```

### Endpoint 2: Check-out (Registrar Saída)
```
POST: http://localhost:3000/api/parking/check-out
```

### Corpo da requisição (JSON):
```
{
  "ticketCodeOrPlate": "TKT-1A2B3C4D"
}

Ou

{
  "ticketCodeOrPlate": "ABC1234"
}
```

### Resposta esperada (200 OK):
```
{
  "ticketCode": "TKT-1A2B3C4D",
  "licensePlate": "ABC1234",
  "spotNumber": "01",
  "checkInTime": "2024-01-15T10:30:45",
  "checkOutTime": "2024-01-15T14:30:45",
  "totalHours": 4.0,
  "totalAmount": 1200.00,
  "paymentStatus": "PAGO",
  "formattedCheckIn": "15/01/2024 10:30:45",
  "formattedCheckOut": "15/01/2024 14:30:45"
}
```
### Endpoint 3: Listar Todas Vagas
```
GET: http://localhost:3000/api/parking/spots
```

### Resposta esperada (200 OK):
```
[
  {
    "id": 1,
    "spotNumber": "01",
    "status": "LIVRE",
    "createdAt": "2024-01-15T00:00:00",
    "updatedAt": "2024-01-15T10:30:45"
  },
  {
    "id": 2,
    "spotNumber": "02",
    "status": "OCUPADO",
    "createdAt": "2024-01-15T00:00:00",
    "updatedAt": "2024-01-15T10:30:45"
  }
]
```
### Endpoint 4: Vagas Disponíveis
```
POST: http://localhost:3000/api/parking/spots/available
```
Resposta esperada (200 OK): (Lista apenas vagas com status LIVRE)

### Endpoint 5: Veículos Estacionados
```
GET: http://localhost:3000/api/parking/active
```

### Resposta esperada (200 OK):
```
[
  {
    "ticketCode": "TKT-1A2B3C4D",
    "licensePlate": "ABC1234",
    "spotNumber": "01",
    "checkInTime": "2024-01-15T10:30:45",
    "checkOutTime": null,
    "totalHours": null,
    "totalAmount": null,
    "paymentStatus": "PENDENTE",
    "formattedCheckIn": "15/01/2024 10:30:45",
    "formattedCheckOut": null
  }
]
```

### Endpoint 6: Histórico
```
GET: http://localhost:3000/api/parking/history
```

### Resposta esperada (200 OK):
```
[
  {
    "ticketCode": "TKT-5E6F7G8H",
    "licensePlate": "XYZ5678",
    "spotNumber": "02",
    "checkInTime": "2024-01-14T08:00:00",
    "checkOutTime": "2024-01-14T18:30:00",
    "totalHours": 10.5,
    "totalAmount": 2700.00,
    "paymentStatus": "PAGO",
    "formattedCheckIn": "14/01/2024 08:00:00",
    "formattedCheckOut": "14/01/2024 18:30:00"
  }
]
```
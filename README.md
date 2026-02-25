# 🧪 Desafio Técnico - Backend Java com Spring Boot
## Sistema de Gerenciamento de Estacionamento

Bem-vindo(a) ao desafio técnico para a vaga de Desenvolvedor(a) Backend no time da STATEMENT LABS.

---

## Descrição do Problema

Você deve desenvolver um sistema backend para gerenciamento de um estacionamento que controla vagas, entrada/saída de veículos e cálculo de tarifas.

---

## Requisitos Funcionais

1. Gestão de Vagas
   - O estacionamento tem 50 vagas fixas
   - Cada vaga tem um identificador único e status (LIVRE, OCUPADO)
   - Deve ser possível listar vagas disponíveis

2. Registro de Entrada de Veículo
   - Registrar entrada: placa do veículo, hora de entrada
   - Atribuir automaticamente uma vaga disponível
   - Retornar ticket com ID, placa, vaga e hora de entrada

3. Registro de Saída de Veículo
   - Registrar saída: ticket ID ou placa do veículo
   - Calcular tempo de permanência
   - Calcular valor a pagar conforme regra de negócio
   - Liberar a vaga

4. Cálculo de Tarifa
   - Até 6 horas: 300 Kz por hora (proporcional)
   - Após 6 horas: 200 Kz por hora adicional
   - Exemplo: 8 horas = (6 × 300) + (2 × 200) = 2200 Kz

5. Consultas
   - Vagas disponíveis/ocupadas
   - Histórico de estadias
   - Veículos atualmente estacionados

---

## Requisitos Técnicos

### Stack Tecnológica
- Java 17+ com Spring Boot 3.x
- Gradle como build tool
- Banco de dados PostgreSQL em container Docker
- DDD (Domain-Driven Design)
- Clean Architecture com camadas:
  - Domain
  - Application
  - Infrastructure
  - Presentation
- Clean Code (princípios SOLID, nomes significativos, etc.)
- TDD (opcional, mas recomendado)

---

## Sugestão de endpoints REST

POST   /api/parking/check-in        # Registrar entrada
POST   /api/parking/check-out       # Registrar saída
GET    /api/parking/spots           # Listar vagas
GET    /api/parking/spots/available # Vagas disponíveis
GET    /api/parking/active          # Veículos estacionados
GET    /api/parking/history         # Histórico

### Requisitos Não Funcionais
- Validação de dados de entrada
- Tratamento de erros apropriado
- Documentação básica da API
- Scripts Docker para banco de dados
- Testes unitários para domínio
- Testes de integração para controllers

### Critérios de Avaliação
1. Arquitetura: Seguimento da Clean Architecture e DDD
2. Segurança (ex: validações, autenticação)
3. Código: Qualidade, legibilidade, princípios SOLID
4. Funcionalidade: Implementação correta dos casos de uso
5. Persistência: Uso adequado do banco de dados
6. Docker: Configuração correta do container
7. Testes: Cobertura e qualidade dos testes (se TDD for aplicado)
8. Qualidade do README e instruções de execução

---

## Como submeter

1. Faça um fork ou clone deste repositório.
2. Implemente a sua solução em uma branch chamada `desafio-{seu-nome}`.
3. Crie um arquivo `INSTRUCOES.md` com:
   - Como rodar a aplicação localmente
   - Exemplos de chamadas (via Postman ou cURL)
4. Envie o link do seu repositório (GitHub ou GitLab) para nossa equipe técnica.

---

## Dicas

- Fique à vontade para usar camadas como `Controller`, `Service`, `Repository`, `DTOs`, etc.
- Se quiser, use Swagger/OpenAPI para documentar os endpoints.
- Use exception handlers globais para retornar erros consistentes.

---

Boa sorte!  
Em caso de dúvidas, entre em contato com o time técnico responsável pelo desafio.

# 🛠️ Team Task Manager – Backend

Backend do sistema de gerenciamento de times e tarefas, desenvolvido com NestJS e PostgreSQL.

---

## 📋 Funcionalidades

- Autenticação com JWT
- Gerenciamento de usuários
- Criação e gerenciamento de times
- Criação de tarefas com prioridade, status e responsável
- Comentários em tarefas
- WebSockets para notificações em tempo real
- Mensageria com RabbitMQ (eventos internos)
- Banco de dados relacional com PostgreSQL
- Migrations com TypeORM

---

## 🚀 Tecnologias

- [NestJS](https://nestjs.com/)
- [PostgreSQL](https://www.postgresql.org/)
- [TypeORM](https://typeorm.io/)
- [RabbitMQ](https://www.rabbitmq.com/)
- [WebSocket](https://docs.nestjs.com/websockets/gateways)
- [Docker Compose](https://docs.docker.com/compose/)

---

## 📦 Pré-requisitos

- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)

---

## ⚙️ Como rodar o projeto

### 1. Clone o repositório

```bash
git clone https://github.com/henriSandovalSilva/team-task-manager-backend.git
cd team-task-manager-backend
```

### 2. Suba os containers

```bash
docker-compose up --build
```
Esse comando irá:

- Clonar o front-end e rodar localmente (:4200)
- Subir o banco de dados PostgreSQL
- Subir o RabbitMQ (mensageria)
- Instalar dependências do backend
- Rodar as migrations automaticamente
- Iniciar o servidor NestJS em modo produção (:3000)

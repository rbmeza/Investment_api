# 💼 Investment API

API REST para gestión de inversiones y portafolios de acciones, construida con NestJS y PostgreSQL.

<p align="center">
  <img src="https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white" alt="NestJS" />
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white" alt="Prisma" />
</p>

---

## 📋 Tabla de Contenidos

- [Instrucciones de Ejecución](#-instrucciones-de-ejecución)
- [Rutas de la API](#-rutas-de-la-api)
- [Modelo de Datos](#-modelo-de-datos)
- [Uso de Inteligencia Artificial](#-uso-de-inteligencia-artificial)
- [Tecnologías Utilizadas](#-tecnologías-utilizadas)

---

## 🚀 Instrucciones de Ejecución

### Prerrequisitos

- Node.js (v18 o superior)
- PostgreSQL (v12 o superior)
- npm o yarn

### Configuración Inicial

1. **Clonar el repositorio** (si aplica)
   ```bash
   git clone <repository-url>
   cd Investment_api
   ```

2. **Instalar dependencias**
```bash
   npm install
   ```

3. **Configurar variables de entorno**
   
   Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:
   ```env
   DATABASE_URL="postgresql://usuario:contraseña@localhost:5432/investment_db"
   JWT_SECRET="tu-secret-key-super-segura"
   PORT=3000
   ```

4. **Configurar la base de datos**
```bash
   # Generar el cliente de Prisma
   npx prisma generate

   # Ejecutar migraciones
   npx prisma migrate dev

   # (Opcional) Poblar la base de datos con datos de ejemplo
   npm run prisma:seed
```

5. **Ejecutar la aplicación**
```bash
   # Modo desarrollo (con hot-reload)
   npm run start:dev
   
   # Modo producción
   npm run start:prod
   
   # Modo normal
   npm run start
   ```

La API estará disponible en `http://localhost:3000` (o el puerto especificado en `PORT`).

### Scripts Disponibles

| Script | Descripción |
|--------|-------------|
| `npm run start` | Inicia la aplicación en modo producción |
| `npm run start:dev` | Inicia la aplicación en modo desarrollo con hot-reload |
| `npm run start:debug` | Inicia la aplicación en modo debug |
| `npm run build` | Compila el proyecto TypeScript |
| `npm run test` | Ejecuta las pruebas unitarias |
| `npm run test:e2e` | Ejecuta las pruebas end-to-end |
| `npm run prisma:seed` | Pobla la base de datos con datos de ejemplo |

---

## 🛣️ Rutas de la API

### Autenticación

| Método | Ruta | Descripción | Autenticación |
|--------|------|-------------|---------------|
| `POST` | `/auth/register` | Registra un nuevo usuario y crea su portafolio inicial | ❌ No requerida |
| `POST` | `/auth/login` | Autentica al usuario y devuelve un JWT | ❌ No requerida |

**Ejemplo de registro:**
```json
POST /auth/register
{
  "email": "usuario@example.com",
  "password": "password123",
  "firstName": "Juan",
  "lastName": "Pérez"
}
```

**Ejemplo de login:**
```json
POST /auth/login
{
  "email": "usuario@example.com",
  "password": "password123"
}
```

### Usuarios

| Método | Ruta | Descripción | Autenticación |
|--------|------|-------------|---------------|
| `GET` | `/users/me` | Obtiene la información del usuario autenticado | ✅ JWT requerido |
| `PATCH` | `/users/me` | Actualiza la información personal del usuario (firstName, lastName) | ✅ JWT requerido |

**Ejemplo de actualización:**
```json
PATCH /users/me
Authorization: Bearer <token>
{
  "firstName": "Juan Carlos",
  "lastName": "Pérez González"
}
```

### Portafolio

| Método | Ruta | Descripción | Autenticación |
|--------|------|-------------|---------------|
| `PATCH` | `/portfolio` | Actualiza el nombre del portafolio | ✅ JWT requerido |
| `GET` | `/portfolio/total` | Calcula y devuelve el valor total del portafolio (efectivo + acciones) | ✅ JWT requerido |

**Ejemplo de actualización de portafolio:**
```json
PATCH /portfolio
Authorization: Bearer <token>
{
  "name": "Mi Portafolio Principal"
}
```

**Respuesta de total del portafolio:**
```json
GET /portfolio/total
Authorization: Bearer <token>

{
  "totalPortfolioValue": 150000.50,
  "availableCash": 50000.00,
  "stocksHeld": {
    "AAPL": 10,
    "MSFT": 5
  },
  "totalStockValue": 100000.50,
  "currency": "CLP"
}
```

### Movimientos (Depósitos/Retiros)

| Método | Ruta | Descripción | Autenticación |
|--------|------|-------------|---------------|
| `POST` | `/investments/movements` | Registra un depósito o retiro de efectivo | ✅ JWT requerido |
| `GET` | `/investments/movements?limit=10` | Obtiene el historial de movimientos (últimos N movimientos) | ✅ JWT requerido |

**Ejemplo de registro de movimiento:**
```json
POST /investments/movements
Authorization: Bearer <token>
{
  "type": "DEPOSIT",
  "amount": 100000.00,
  "date": "2024-01-15T10:30:00Z"
}
```

**Tipos de movimiento:**
- `DEPOSIT`: Depósito de efectivo
- `WITHDRAWAL`: Retiro de efectivo

### Transacciones (Compra/Venta de Acciones)

| Método | Ruta | Descripción | Autenticación |
|--------|------|-------------|---------------|
| `POST` | `/investments/transactions` | Registra una orden de compra o venta de acciones | ✅ JWT requerido |
| `GET` | `/investments/transactions/history` | Obtiene el historial completo de transacciones | ✅ JWT requerido |

**Ejemplo de registro de transacción:**
```json
POST /investments/transactions
Authorization: Bearer <token>
{
  "stockSymbol": "AAPL",
  "type": "BUY",
  "quantity": 10,
  "price": 175.50,
  "date": "2024-01-15T10:30:00Z"
}
```

**Tipos de transacción:**
- `BUY`: Compra de acciones
- `SELL`: Venta de acciones

### Endpoint Raíz

| Método | Ruta | Descripción | Autenticación |
|--------|------|-------------|---------------|
| `GET` | `/` | Endpoint de salud/verificación | ❌ No requerida |

---

## 🗄️ Modelo de Datos

### Diagrama de Entidades

```
┌─────────────┐
│    User     │
├─────────────┤
│ id (PK)     │
│ email       │◄─────┐
│ password    │      │
│ firstName   │      │
│ lastName    │      │
│ createdAt   │      │
│ updatedAt   │      │
└─────────────┘      │
      │              │
      │ 1:1          │ 1:N
      │              │
      ▼              │
┌─────────────┐      │
│  Portfolio  │      │
├─────────────┤      │
│ id (PK)     │      │
│ name        │      │
│ stocksHeld  │      │
│ (JSON)      │      │
│ cash        │      │
│ userId (FK) │──────┘
└─────────────┘
      │
      │ 1:N
      │
      ▼
┌─────────────┐
│  Movement   │
├─────────────┤
│ id (PK)     │
│ type        │
│ (ENUM)      │
│ amount      │
│ date        │
│ userId (FK) │
└─────────────┘

┌─────────────┐
│ Transaction │
├─────────────┤
│ id (PK)     │
│ stockSymbol │
│ type (ENUM) │
│ quantity    │
│ price       │
│ date        │
│ userId (FK) │
└─────────────┘

┌─────────────┐
│    Stock    │
├─────────────┤
│ id (PK)     │
│ symbol (UK) │
│ price       │
└─────────────┘
```

### Descripción de Modelos

#### 👤 User (Usuario)
Representa a los usuarios del sistema.

**Campos:**
- `id`: Identificador único (auto-incremental)
- `email`: Correo electrónico único del usuario
- `password`: Contraseña hasheada con bcrypt
- `firstName`: Nombre del usuario
- `lastName`: Apellido del usuario
- `createdAt`: Fecha de creación
- `updatedAt`: Fecha de última actualización

**Relaciones:**
- 1:1 con `Portfolio` (cada usuario tiene un portafolio)
- 1:N con `Movement` (un usuario puede tener múltiples movimientos)
- 1:N con `Transaction` (un usuario puede tener múltiples transacciones)

**Justificación:**
- Se utiliza un modelo de usuario separado para mantener la información de autenticación y perfil separada de la lógica de inversión
- El email es único para evitar duplicados y facilitar el login
- Las contraseñas se almacenan hasheadas por seguridad

---

#### 💼 Portfolio (Portafolio)
Representa el portafolio de inversiones de un usuario.

**Campos:**
- `id`: Identificador único (auto-incremental)
- `name`: Nombre descriptivo del portafolio
- `stocksHeld`: Objeto JSON que almacena las acciones poseídas en formato `{ "SYMBOL": cantidad }`
- `cash`: Efectivo disponible (Decimal para precisión financiera)
- `userId`: Referencia al usuario propietario (relación 1:1)

**Relaciones:**
- N:1 con `User` (cada portafolio pertenece a un usuario)

**Justificación:**
- **Relación 1:1 con User**: Cada usuario tiene un único portafolio, simplificando la lógica de negocio y evitando confusión sobre qué portafolio usar
- **stocksHeld como JSON**: Se eligió almacenar las tenencias como JSON para flexibilidad, permitiendo agregar nuevas acciones sin modificar el esquema. Esto es adecuado para un MVP, aunque en producción podría considerarse una tabla de relación normalizada
- **cash como Decimal**: Se utiliza el tipo `Decimal` de Prisma para evitar problemas de precisión con números de punto flotante en cálculos financieros
- **Separación de Portfolio y User**: Permite que el portafolio tenga su propio ciclo de vida y facilita futuras extensiones (múltiples portafolios por usuario, portafolios compartidos, etc.)

---

#### 💸 Movement (Movimiento)
Representa depósitos y retiros de efectivo.

**Campos:**
- `id`: Identificador único (auto-incremental)
- `type`: Tipo de movimiento (`DEPOSIT` o `WITHDRAWAL`)
- `amount`: Cantidad de dinero (Decimal)
- `date`: Fecha y hora del movimiento
- `userId`: Referencia al usuario (relación N:1)

**Relaciones:**
- N:1 con `User` (múltiples movimientos pertenecen a un usuario)

**Justificación:**
- **Enum para type**: Garantiza integridad de datos y facilita consultas y validaciones
- **Separación de Movements y Transactions**: Los movimientos representan flujo de efectivo (depósitos/retiros), mientras que las transacciones representan operaciones con acciones. Esta separación permite:
  - Auditoría clara de flujos de efectivo vs operaciones de mercado
  - Reportes diferenciados
  - Validaciones específicas para cada tipo de operación
- **amount como Decimal**: Precisión en cálculos monetarios

---

#### 📈 Transaction (Transacción)
Representa órdenes de compra o venta de acciones.

**Campos:**
- `id`: Identificador único (auto-incremental)
- `stockSymbol`: Símbolo de la acción (ej: "AAPL", "MSFT")
- `type`: Tipo de transacción (`BUY` o `SELL`)
- `quantity`: Cantidad de acciones
- `price`: Precio por acción al momento de la transacción (Decimal)
- `date`: Fecha y hora de la transacción
- `userId`: Referencia al usuario (relación N:1)

**Relaciones:**
- N:1 con `User` (múltiples transacciones pertenecen a un usuario)

**Justificación:**
- **Almacenamiento de precio histórico**: Se guarda el precio al momento de la transacción, permitiendo análisis histórico y cálculo de ganancias/pérdidas reales
- **Enum para type**: Garantiza que solo se permitan operaciones válidas
- **Separación de Transactions y Movements**: Ver justificación en el modelo Movement
- **stockSymbol como String**: Permite flexibilidad para agregar nuevas acciones sin modificar el esquema, aunque se valida contra la tabla `Stock`

---

#### 📊 Stock (Acción)
Catálogo de acciones disponibles con sus precios actuales.

**Campos:**
- `id`: Identificador único (auto-incremental)
- `symbol`: Símbolo único de la acción (ej: "AAPL")
- `price`: Precio actual de la acción (Decimal)

**Justificación:**
- **Tabla separada de Stock**: Permite mantener un catálogo centralizado de acciones y sus precios actuales
- **symbol único**: Garantiza que no haya duplicados y facilita búsquedas
- **Precio actualizado**: El precio en esta tabla representa el precio de mercado actual, mientras que el precio en `Transaction` es histórico
- **Facilita cálculos**: Permite calcular el valor actual del portafolio consultando los precios actuales de las acciones poseídas

---

### Decisiones de Diseño

#### 🔐 Seguridad y Autenticación
- **JWT (JSON Web Tokens)**: Se utiliza JWT para autenticación stateless, permitiendo escalabilidad horizontal
- **bcrypt para contraseñas**: Las contraseñas se hashean con bcrypt (10 rounds) antes de almacenarse
- **Guards de NestJS**: Se implementan guards para proteger rutas que requieren autenticación

#### 💰 Precisión Financiera
- **Decimal.js**: Se utiliza la librería `decimal.js` para todos los cálculos monetarios, evitando errores de precisión de punto flotante
- **Validación de fondos**: Se valida que el usuario tenga fondos suficientes antes de permitir compras
- **Validación de tenencias**: Se valida que el usuario tenga suficientes acciones antes de permitir ventas

#### 🏗️ Arquitectura
- **NestJS Modules**: La aplicación está organizada en módulos (Auth, Users, Portfolios, Investments) para mantener separación de responsabilidades
- **Prisma ORM**: Se utiliza Prisma como ORM para type-safety y migraciones de base de datos
- **DTOs (Data Transfer Objects)**: Se utilizan DTOs con validación para garantizar integridad de datos en las peticiones
- **Pipes de validación**: Se implementan pipes personalizados para validar y transformar datos de entrada

#### 📝 Auditoría
- **Timestamps automáticos**: Los modelos `User` incluyen `createdAt` y `updatedAt` para auditoría
- **Historial completo**: Tanto `Movement` como `Transaction` almacenan un historial completo e inmutable de operaciones

---

## 🤖 Uso de Inteligencia Artificial

### Estado Actual

Actualmente, la aplicación **no integra inteligencia artificial** en su flujo de trabajo. Todas las operaciones y decisiones se basan en lógica programática tradicional y validaciones de reglas de negocio.

### Oportunidades Futuras de Integración

Aunque no está implementado actualmente, existen varias áreas donde la IA podría agregar valor a la aplicación:

#### 📊 Análisis Predictivo
- **Predicción de precios de acciones**: Integración con modelos de machine learning para predecir tendencias de precios basados en datos históricos
- **Análisis de sentimiento**: Procesamiento de noticias financieras y redes sociales para evaluar el sentimiento del mercado
- **Detección de patrones**: Identificación de patrones en el comportamiento de trading del usuario

#### 💡 Recomendaciones Inteligentes
- **Sugerencias de inversión**: Recomendaciones personalizadas basadas en el perfil de riesgo del usuario y su historial de transacciones
- **Optimización de portafolio**: Sugerencias de rebalanceo de portafolio usando algoritmos de optimización
- **Alertas inteligentes**: Notificaciones proactivas sobre oportunidades de inversión o riesgos potenciales

#### 🔍 Análisis de Datos
- **Análisis de rendimiento**: Evaluación automática del rendimiento del portafolio con insights generados por IA
- **Detección de anomalías**: Identificación de transacciones inusuales o patrones sospechosos
- **Generación de reportes**: Creación automática de reportes de inversión con análisis contextual

#### 🗣️ Asistente Virtual
- **Chatbot financiero**: Asistente conversacional para responder preguntas sobre inversiones, explicar conceptos financieros o ayudar con decisiones de trading
- **Análisis de lenguaje natural**: Procesamiento de consultas en lenguaje natural sobre el estado del portafolio

### Consideraciones para Futura Implementación

Si se decide integrar IA en el futuro, se recomienda considerar:

1. **APIs de IA**: Integración con servicios como OpenAI GPT, Anthropic Claude, o modelos especializados en finanzas
2. **Procesamiento de datos**: Pipeline de datos para entrenar modelos personalizados o fine-tuning de modelos pre-entrenados
3. **Privacidad y seguridad**: Asegurar que los datos financieros sensibles se manejen de forma segura al interactuar con servicios de IA
4. **Validación y transparencia**: Implementar mecanismos para validar las recomendaciones de IA y explicar el razonamiento detrás de las decisiones
5. **Costo-beneficio**: Evaluar el costo de las APIs de IA versus el valor agregado para los usuarios

### Arquitectura Sugerida para IA

Si se implementa IA en el futuro, se podría estructurar de la siguiente manera:

```
src/
  ├── ai/
  │   ├── services/
  │   │   ├── prediction.service.ts      # Predicciones de precios
  │   │   ├── recommendation.service.ts  # Recomendaciones
  │   │   └── analysis.service.ts        # Análisis de datos
  │   ├── models/
  │   │   └── (modelos de ML si se entrenan localmente)
  │   └── ai.module.ts
```

---

## 🛠️ Tecnologías Utilizadas

### Backend
- **NestJS**: Framework Node.js progresivo para construir aplicaciones del lado del servidor
- **TypeScript**: Superset de JavaScript con tipado estático
- **Prisma**: ORM moderno para TypeScript y Node.js
- **PostgreSQL**: Base de datos relacional robusta

### Autenticación y Seguridad
- **@nestjs/jwt**: Integración de JWT en NestJS
- **@nestjs/passport**: Estrategia de autenticación
- **passport-jwt**: Estrategia JWT para Passport
- **bcrypt**: Librería para hashing de contraseñas

### Validación y Transformación
- **class-validator**: Decoradores para validación de DTOs
- **class-transformer**: Transformación de objetos planos a instancias de clase

### Cálculos Financieros
- **decimal.js**: Librería para aritmética decimal de precisión arbitraria

### Desarrollo
- **ESLint**: Linter para mantener calidad de código
- **Prettier**: Formateador de código
- **Jest**: Framework de testing

---

## 📝 Notas Adicionales

### Variables de Entorno Requeridas

Asegúrate de configurar las siguientes variables en tu archivo `.env`:

```env
DATABASE_URL="postgresql://usuario:contraseña@localhost:5432/investment_db"
JWT_SECRET="tu-secret-key-super-segura-y-larga"
PORT=3000
```

### Base de Datos

La aplicación utiliza PostgreSQL como base de datos. Asegúrate de tener una instancia de PostgreSQL corriendo y accesible antes de ejecutar las migraciones.

### Seed de Datos

El script de seed (`prisma/seed.ts`) crea:
- 10 acciones de ejemplo (AAPL, MSFT, GOOGL, etc.)
- 3 usuarios de prueba con sus portafolios

Puedes ejecutarlo con:
```bash
npm run prisma:seed
```

---

## 📄 Licencia

Este proyecto es privado y no está licenciado para uso público.

---

## 👤 Autor

Desarrollado como parte del proyecto Investment API.

---

## 🤝 Contribuciones

Este es un proyecto privado. Las contribuciones externas no están permitidas en este momento.

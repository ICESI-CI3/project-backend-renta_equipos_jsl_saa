# Informe Técnico 

# Módulo de Autenticación

## 1. Descripción General
Módulo encargado de gestionar:
- Registro y autenticación de usuarios mediante JWT
- Control de acceso basado en roles (admin, user, superuser)
- Operaciones CRUD sobre usuarios (para roles autorizados)

**Tecnologías clave:**
- NestJS + TypeScript
- Passport JWT para autenticación
- Bcrypt para hashing de contraseñas
- Class-validator para validación de DTOs
- Swagger para documentación API

## 2. Endpoints Principales

### 2.1. Autenticación

#### POST `/api/v1/auth/login`
**Descripción:** Autentica usuario y genera token JWT  
**Body (SignInDto):**
```json
{
  "email": "usuario@ejemplo.com",
  "password": "contraseña123"
}
```
## Respuestas

### 200 OK (éxito)

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

## 401 Unauthorized (credenciales inválidas)

## 2.2. Registro  
**POST** `/api/v1/auth/register`  
**Descripción:** Crea nuevo usuario  

**Body (UserDTO):**  
```json
{
  "email": "nuevo@ejemplo.com",
  "password": "contraseña123",
  "role": "user"
}

```

## Respuestas

- **201 Created** (usuario creado)  
- **400 Bad Request** (datos inválidos)  

---

## 3. Endpoints Protegidos  
**Requieren header:** `Authorization: Bearer <token>`  

| Método | Endpoint               | Roles Permitidos       | Descripción               |
|--------|------------------------|------------------------|---------------------------|
| GET    | `/api/v1/auth`         | admin, superuser       | Lista usuarios paginados  |
| GET    | `/api/v1/auth/:id`     | admin, superuser       | Obtiene usuario por UUID  |
| PATCH  | `/api/v1/auth/:id`     | admin, superuser       | Actualiza usuario         |
| DELETE | `/api/v1/auth/:id`     | admin, superuser       | Elimina usuario           |

---

## 4. Implementación de Seguridad  
### 4.1. Autenticación JWT  
Tokens firmados con clave secreta (`JWT_SECRET`)  

**Payload contiene:**  
```typescript
{
  username: string, // email
  sub: string,      // user ID
  role: ValidRoles  // rol del usuario
}
```

**Expiración:** 1 hora

### 4.2. Autorización por Roles  
**Mecanismo:**  
El decorador `@Auth()` aplica:  
- `AuthGuard('jwt')`: Verifica que el token sea válido  
- `UserRoleGuard`: Compara el rol del usuario con los roles requeridos  

**Roles definidos en enum:**  
```typescript
export enum ValidRoles {
  admin = 'admin',
  user = 'user',
  superuser = 'superuser'
}
```

### 4.3. Protección de Datos

- **Almacenamiento de contraseñas:**  
  Se utiliza `bcrypt` para generar y almacenar hashes seguros de las contraseñas.

- **Validación de DTOs:**  
  Se aplican validaciones estrictas a los campos de entrada:

```typescript
@IsString()
@Matches(/^[\w.-]+@[\w.-]+\.[a-zA-Z]{2,}$/)
email: string;
```

# Módulo de Usuarios (Users)  
## API de Gestión de Alquiler de Equipos  
### Documentación de Endpoints y Funcionalidades  

---

## 1. Descripción General  
El módulo **Users** gestiona:  

- **CRUD completo** de usuarios (creación, lectura, actualización, eliminación).  
- **Procesamiento de solicitudes** de alquiler (aceptar/rechazar).  
- **Integración con otros módulos**:  
  - *Requests* (Solicitudes)  
  - *Contracts* (Contratos)  
  - *Devices* (Equipos)  

### Tecnologías Clave:  
- **Persistencia**:  
  - TypeORM con PostgreSQL/MySQL.  
- **Seguridad**:  
  - Hash de contraseñas con `bcrypt`.  
  - Validación de datos con `class-validator`.  
- **Relaciones**:  
  - Conexión con entidades: `Request`, `Contract` y `Device`.  

## 2. Endpoints

### 2.1. Gestión de Usuarios

| Endpoint                  | Método | Descripción                              | Parámetros               | Requiere Auth | Roles Permitidos                     |
|---------------------------|--------|------------------------------------------|--------------------------|---------------|---------------------------------------|
| `GET /api/v1/users`       | GET    | Lista todos los usuarios (paginado)      | `limit`, `offset`        | Sí            | Cualquier rol                        |
| `GET /api/v1/users/:id`   | GET    | Obtiene un usuario por UUID              | `id` (UUID)              | Sí            | Cualquier rol                        |
| `PATCH /api/v1/users/:id` | PATCH  | Actualiza un usuario                     | `id` + Body (UserDTO)    | Sí            | Propio usuario o admin/superuser*    |
| `DELETE /api/v1/users/:id`| DELETE | Elimina un usuario                       | `id`                     | Sí            | Propio usuario o admin/superuser*    |

*\*Solo el propio usuario o un admin/superuser pueden modificar/eliminar cuentas*

**Body (UserDTO):**
```json
{
  "name": "Juan Pérez",
  "email": "juan@example.com",
  "password": "Segura123",
  "cellphone": "3001234567",
  "address": "Calle 123",
  "role": "user"
}
```

## Validaciones

- **Email**:  
  - Formato válido (ejemplo: `usuario@dominio.com`)
  - Validación con regex: `/^[\w.-]+@[\w.-]+\.[a-zA-Z]{2,}$/`

- **Contraseña**:  
  - Longitud: 8-20 caracteres  
  - Requisitos:  
    - Al menos 1 letra mayúscula  
    - Al menos 1 número  
  - Regex recomendado: `/^(?=.*[A-Z])(?=.*\d).{8,20}$/`

- **Celular**:  
  - Exactamente 10 dígitos numéricos  
  - Validación con regex: `/^\d{10}$/`

---

## 2.2. Procesamiento de Solicitudes *(Admin/Superuser only)*  

| Endpoint                                | Método | Descripción                          |
|-----------------------------------------|--------|--------------------------------------|
| `PATCH /api/v1/users/accept/:idRequest` | PATCH  | Acepta solicitud de alquiler         |
| `PATCH /api/v1/users/reject/:idRequest` | PATCH  | Rechaza solicitud de alquiler        |

### Flujo de Aceptación

1. **Actualización de estado**:  
   - La solicitud (`Request`) cambia a estado `"accepted"`

2. **Creación de contrato**:  
   - Se genera automáticamente un nuevo `Contract` asociado a:  
     - El usuario solicitante  
     - Los dispositivos involucrados  

3. **Actualización de dispositivos**:  
   - El estado de los equipos (`Device`) se actualiza a `"rentado"`  
   - Se registra la fecha de inicio del alquiler  

**Nota**: Todo el proceso es atómico (se revierte si falla cualquier paso).  

## 3. Persistencia de Datos

### 3.1. Entidad User

```typescript
@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  name: string;

  @Column('text', { unique: true })
  email: string;

  @Column('text', { select: false }) 
  password: string; // No se selecciona en queries por defecto

  @Column('text')
  cellphone: string;

  @Column('text')
  address: string;

  @Column('text', { default: 'user' })
  role: string;
}

```
### 3.2. Relaciones

- **Solicitudes (Request):**  
  Relación `One-to-Many`: Un usuario puede tener múltiples solicitudes de alquiler.

- **Contratos (Contract):**  
  Relación `One-to-Many`: Un usuario puede tener múltiples contratos activos asociados.

- **Dispositivos (Device):**  
  Relación `Many-to-Many` indirecta a través de la entidad Contract (un usuario accede a dispositivos mediante sus contratos).

### 3.3. Seguridad

**🔒 Contraseñas:**  
- Almacenamiento seguro con hash `bcrypt` (10 salt rounds)  
- Exclusión automática en respuestas API (`select: false`)  
- Nunca se exponen en logs o JSON responses  

**📧 Emails:**  
- Campo único en base de datos (`unique: true`)  
- Validación de formato antes de persistir  
- Índice único para optimizar búsquedas  

**🛡️ Protecciones adicionales:**  
- Transacciones ACID para operaciones críticas  
- Auditoría de cambios en datos sensibles  

## 4. Flujos Clave

### 4.1. Creación de Usuario

1. **Validación de datos**  
   - Verifica el formato del UserDTO según las reglas de validación
   - Valida que todos los campos requeridos estén presentes

2. **Verificación de email único**  
   - Consulta la base de datos para asegurar que el email no exista previamente

3. **Procesamiento de contraseña**  
   - Genera hash de la contraseña usando bcrypt (10 salt rounds)
   - Reemplaza la contraseña en texto plano por el hash generado

4. **Persistencia**  
   - Crea el nuevo registro de usuario en la base de datos
   - Retorna el usuario creado (excluyendo la contraseña hash)

### 4.2. Aceptar Solicitud

1. **Búsqueda de solicitud**  
   - Obtiene la Request por ID verificando su existencia
   - Valida que esté en estado pendiente

2. **Actualización de estado**  
   - Cambia el estado de la Request a "accepted"
   - Registra la fecha/hora de aceptación

3. **Creación de contrato**  
   - Genera un nuevo Contract vinculando:
     - Usuario solicitante
     - Dispositivos solicitados
     - Fechas de alquiler
   - Establece estado inicial del contrato como "active"

4. **Actualización de dispositivos**  
   - Cambia el estado de cada Device involucrado a "rentado"
   - Registra el ID del contrato asociado en cada dispositivo


# Módulo de Dispositivos (Devices)

## API de Gestión de Alquiler de Equipos

### Documentación de Endpoints y Funcionalidades

---

## 1. Descripción General

El módulo **Devices** gestiona:

- **Inventario de dispositivos**: Creación, consulta y gestión de equipos disponibles para alquiler.
- **Control de stock**: Seguimiento de unidades disponibles por tipo de dispositivo.
- **Integración**: Relación con módulos de solicitudes (**Requests**) y contratos (**Contracts**).

### Tecnologías clave

- **Persistencia**: TypeORM con PostgreSQL/MySQL  
- **Validación**: `class-validator` para DTOs  
- **Seguridad**: Protección de endpoints con JWT y roles (`admin`, `superuser`)

# 2. Endpoints Principales

## 2.1. Gestión Básica de Dispositivos

| Endpoint                        | Método  | Descripción                               | Roles Requeridos     | Parámetros                                       |
|--------------------------------|---------|-------------------------------------------|----------------------|--------------------------------------------------|
| `/api/v1/devices/:stock`       | POST    | Crea múltiples unidades de un dispositivo | -                    | `stock`: Número de unidades + Body (`CreateDeviceDto`) |
| `/api/v1/devices`              | GET     | Lista todos los dispositivos              | -                    | -                                                |
| `/api/v1/devices/:id`          | GET     | Obtiene un dispositivo por UUID           | -                    | `id`: UUID del dispositivo                       |
| `/api/v1/devices/:id`          | PATCH   | Actualiza un dispositivo                  | admin o superuser    | `id` + Body (`CreateDeviceDto`)                 |
| `/api/v1/devices/:id`          | DELETE  | Elimina un dispositivo                    | admin o superuser    | `id`: UUID del dispositivo                       |

## 2.2. Consultas Especializadas

| Endpoint                              | Descripción                                              |
|--------------------------------------|----------------------------------------------------------|
| `/api/v1/devices/stock/:name`        | Obtiene el stock disponible por nombre de dispositivo    |
| (Implícito) GET by type/status       | Filtrado por tipo o estado (implementado en servicio)    |

---

# 3. Estructura de Datos

## 3.1. Entidad `Device`

```typescript
@Entity()
export class Device {
    @PrimaryGeneratedColumn('uuid') id: string;
    @Column('text') name: string;
    @Column('text') description: string;
    @Column('text') type: string;  // Ej: 'laptop', 'móvil'
    @Column('text') status: string; // 'activo', 'inactivo', 'rentado'
    @Column('text') owner: string;
    @Column('text') image: string;  // URL de imagen
}
```

## 3.2. DTO  `CreateDeviceDto`

```typescript
@Entity()
export class CreateDeviceDto {
    name: string;        // Nombre del dispositivo
    description: string; // Descripción detallada
    type: string;       // Categoría del dispositivo
    status: string;     // Estado actual
    owner: string;      // Propietario del equipo
    image: string;      // URL de imagen
}
```

## 4. Flujos Clave  

### 4.1. Creación de Dispositivos  
- Valida que no exista un dispositivo con el mismo nombre.  
- Crea N unidades (stock) con los mismos datos.  
- Retorna mensaje de confirmación.  

### 4.2. Gestión de Stock  
- **Consulta**: Cuenta dispositivos con mismo `name`.  
- **Actualización**: Cambia `status` a `'rentado'` cuando se acepta una solicitud (vía módulo `Users`).  

---

## 5. Seguridad  

**Endpoints protegidos**:  
```typescript
@Auth(ValidRoles.admin, ValidRoles.superuser) // PATCH, DELETE
```
## Validaciones:

    UUID válido en parámetros

    Campos requeridos en DTO

# Módulo de Solicitudes (Requests)

## API de Gestión de Alquiler de Equipos

### Documentación de Endpoints y Funcionalidades

---

## 1. Descripción General

El módulo **Requests** gestiona:

- **Solicitudes de alquiler**: Creación, consulta y gestión de peticiones de equipos.
- **Validaciones**: Fechas, estados y relaciones con usuarios.
- **Integración**: Conexión con los módulos **Users** y **Contracts**.

### Tecnologías clave

- **Persistencia**: TypeORM con PostgreSQL/MySQL  
- **Validación**: `class-validator` con reglas personalizadas  
- **Relaciones**: Vinculación con entidad `User`

## 2. Endpoints Principales

### 2.1. Gestión Básica de Solicitudes

| Endpoint                     | Método | Descripción                   | Parámetros               | Validaciones                     |
|------------------------------|--------|-------------------------------|--------------------------|----------------------------------|
| `POST /api/v1/requests`      | POST   | Crea nueva solicitud          | Body (CreateRequestDto)  | - Email válido<br>- Fechas coherentes<br>- Estado válido |
| `GET /api/v1/requests`       | GET    | Lista todas las solicitudes   | -                        | -                                |
| `GET /api/v1/requests/:id`   | GET    | Obtiene solicitud por UUID    | id (UUID)                | UUID válido                      |
| `PATCH /api/v1/requests/:id` | PATCH  | Actualiza solicitud           | id + Body (CreateRequestDto) | Mismas validaciones que POST     |
| `DELETE /api/v1/requests/:id`| DELETE | Elimina solicitud             | id (UUID)                | UUID válido                      |

### 2.2. Consultas Especializadas

| Endpoint                           | Descripción                  | Parámetros                   |
|------------------------------------|------------------------------|------------------------------|
| `GET /api/v1/requests/:user_email` | Solicitudes por usuario      | user_email válido            |
| `GET /api/v1/status/:status`       | Solicitudes por estado       | status (pendiente/aprobada/rechazada) |

# 3. Estructura de Datos

## 3.1. Entidad `Request`

```typescript
@Entity()
export class Request {
    @PrimaryGeneratedColumn('uuid') id: string;
    @Column('text') user_email: string; // Relación implícita con User
    @Column('date') date_start: Date;
    @Column('date') date_finish: Date;
    @Column('text') status: string; // 'pendiente', 'aprobada', 'rechazada'
    @Column('text') admin_comment: string;
}
```

## 3.2. DTO  `CreateRequestDto`

```typescript
@Validate(IsStartBeforeFinishConstraint) // Fecha inicio < fecha fin
@IsEmail() user_email: string;
@IsDateString() date_start: Date;
@IsDateString() date_Finish: Date;
@IsIn(['pendiente', 'aprobada', 'rechazada']) status: string;
```

## 4. Flujos Clave

### 4.1. Creación de Solicitud

- Verifica que el usuario exista (`user_email`)
- Valida coherencia de fechas (`inicio < fin`)
- Establece estado inicial como `pendiente`
- Almacena en base de datos

### 4.2. Procesamiento (Integración con Users)

- **Aprobación**: 
  - Cambia estado a `aprobada`
  - Genera contrato (vía `UsersService`)
  
- **Rechazo**:
  - Actualiza estado a `rechazada`
  - Opcionalmente añade `admin_comment`


  ## 5. Seguridad y Validaciones

### Relaciones

```typescript
// En servicio:
const userEmailExists = await this.userRepository.findOne(...);
if (!userEmailExists) throw new Error("El usuario no existe");
```

### Validadores personalizados:

```typescript
@ValidatorConstraint()
class IsStartBeforeFinishConstraint implements ValidatorConstraintInterface {
  validate() { /* lógica fecha */ }
}
```

# Módulo Request Devices

## API de Gestión de Alquiler de Equipos

### Documentación de Endpoints y Funcionalidades

---

## 1. Descripción General

El módulo **RequestDevices** gestiona:

- **Asociación entre solicitudes y dispositivos**: Relaciona equipos solicitados con peticiones de alquiler.
- **Control de inventario**: Verifica disponibilidad y actualiza estados de dispositivos.
- **Integración**: Conecta los módulos **Requests** y **Devices**.

### Tecnologías clave

- **Persistencia**: TypeORM con PostgreSQL/MySQL  
- **Validación**: Verificación de disponibilidad en tiempo real  
- **Transacciones**: Manejo seguro de operaciones múltiples

# 2. Endpoints Principales

## 2.1. Gestión de Asociaciones

| Endpoint                                | Método | Descripción                                     | Parámetros                                | Validaciones                              |
|-----------------------------------------|--------|-------------------------------------------------|--------------------------------------------|--------------------------------------------|
| POST /api/v1/request-devices/:quantity  | POST   | Crea asociaciones para múltiples dispositivos   | `quantity` + Body (`CreateRequestDeviceDto`) | - Dispositivos disponibles<br>- Request existente |
| GET /api/v1/request-devices             | GET    | Lista todas las asociaciones                    | -                                          | -                                          |
| GET /api/v1/request-devices/:id         | GET    | Obtiene asociación por ID                       | `id` (UUID)                                | UUID válido                                |
| PUT /api/v1/request-devices/:id         | PUT    | Actualiza asociación                            | `id` + Body (`CreateRequestDeviceDto`)     | Asociación existente                        |
| DELETE /api/v1/request-devices/:id      | DELETE | Elimina asociación                              | `id` (UUID)                                | UUID válido                                |

## 2.2. Consultas Especializadas

| Endpoint                                 | Descripción                          | Parámetros          |
|------------------------------------------|--------------------------------------|---------------------|
| GET /api/v1/request-devices/:deviceName  | Filtra por nombre de dispositivo     | `deviceName` (texto) |

# 3. Estructura de Datos

## 3.1. Entidad `RequestDevice`

```typescript
@Entity()
export class RequestDevice {
    @PrimaryGeneratedColumn('uuid') id: string;
    @Column('text') request_id: string;  // Relación con Request
    @Column('text') device_id: string;   // Relación con Device
    @Column('text') device_name: string; // Redundancia para consultas
}
```

## 3.2. DTO  `CreateRequestDeviceDto`

```typescript
export class CreateRequestDeviceDto {
    @IsString() request_id: string;     // UUID de la solicitud
    @IsString() device_name: string;    // Nombre del dispositivo
}
```

# 4. Flujos Clave

## 4.1. Creación de Asociaciones

- Verifica disponibilidad de dispositivos (`status: 'Disponible'`)
- Para cada unidad:
  - Crea registro en `request_devices`
  - Actualiza estado del dispositivo a `'Pedido'`
- Retorna confirmación

## 4.2. Integración con otros módulos

- **Requests**: Validación de existencia de solicitud
- **Devices**: Cambio de estado y control de inventario

# 5. Seguridad y Validaciones

## Verificaciones estrictas

```typescript
if (devicesAvailable.length < quantity) {
  throw new BadRequestException(`No hay suficientes dispositivos...`);
}
```

## Manejo de errores
    NotFoundException para registros inexistentes

    InternalServerErrorException para fallos inesperados

# Módulo de Contratos (Contracts)

## API de Gestión de Alquiler de Equipos

### Documentación de Endpoints y Funcionalidades

---

## 1. Descripción General

El módulo **Contracts** gestiona:

- **Contratos de alquiler**: Formalización de acuerdos entre usuarios y el sistema.
- **Seguimiento de estados**: Control del ciclo de vida de los contratos (Activo, Finalizado, etc.).
- **Integración**: Vinculación con solicitudes (**Requests**) y usuarios (**Users**).

### Tecnologías clave

- **Persistencia**: TypeORM con PostgreSQL/MySQL  
- **Validación**: Verificación de relaciones y estados  
- **Seguridad**: Protección de endpoints (pendiente implementar roles)

# 2. Endpoints Principales

## 2.1. Gestión Básica de Contratos

| Endpoint                         | Método | Descripción                    | Parámetros                | Validaciones                                  |
|----------------------------------|--------|--------------------------------|---------------------------|-----------------------------------------------|
| `POST /api/v1/contracts`         | `POST` | Crea nuevo contrato            | Body (`CreateContractDto`) | - Usuario existe<br>- Solicitud existe y está aceptada |
| `GET /api/v1/contracts`          | `GET`  | Lista todos los contratos      | -                         | -                                             |
| `GET /api/v1/contracts/:id`      | `GET`  | Obtiene contrato por ID        | id (UUID)                 | UUID válido                                   |
| `PUT /api/v1/contracts/:id`      | `PUT`  | Actualiza contrato             | id + Body (`CreateContractDto`) | Contrato existente                             |
| `DELETE /api/v1/contracts/:id`   | `DELETE` | Elimina contrato               | id (UUID)                 | UUID válido                                   |

## 2.2. Consultas Especializadas

| Endpoint                         | Descripción                         | Parámetros                  |
|----------------------------------|-------------------------------------|-----------------------------|
| `GET /api/v1/contracts/:email`   | Contratos por email de usuario      | email válido                |
| `GET /api/v1/contracts/:status`  | Contratos por estado                | status (ej: "Activo")       |

# 3. Estructura de Datos

## 3.1. Entidad Contract

```typescript
@Entity()
export class Contract {
    @PrimaryGeneratedColumn('uuid') id: string;
    @Column('text') user_email: string;  // Relación con User
    @Column('text') request_id: string;  // Relación con Request
    @Column('date') date_start: Date;
    @Column('date') date_finish: Date;
    @Column('text') status: string;
    @Column('text', { nullable: true }) client_signature: string;
}
```
## 3.2. DTO  CreateContractDto

```typescript
export class CreateContractDto {
    @IsString() id: string;
    @IsString() user_email: string;
    @IsString() request_id: string;
    @IsDate() date_start: Date;
    @IsDate() date_finish: Date;
    @IsString() status: string;
    @IsOptional() @IsString() client_signature?: string;
}
```

# 4. Flujos Clave

## 4.1. Creación de Contrato

Verifica que:

- El usuario exista (`user_email`)
- La solicitud exista (`request_id`)
- La solicitud tenga estado `accepted`

Crea registro en base de datos

Retorna el contrato creado

## 4.2. Validaciones

```typescript
// En servicio:
const requestAccepted = await this.requestRepository.findOne({ 
    where: { id: contract.request_id, status: 'accepted' }
});
if (!requestAccepted) throw new Error("La solicitud no ha sido aceptada");
```

# 5. Seguridad y Validaciones

- **Protección de endpoints**: *(Pendiente implementar `@Auth` con roles)*

- **Manejo de errores**:
  - `NotFoundException` para recursos inexistentes
  - `HttpException` con códigos de estado apropiados


# Módulo Contract Devices

**API de Gestión de Alquiler de Equipos**  
**Documentación de Endpoints y Funcionalidades**

## 1. Descripción General

El módulo `ContractDevices` gestiona:

- **Asignación de dispositivos a contratos**: Relación entre equipos y acuerdos de alquiler.
- **Control de inventario**: Actualización de estados de dispositivos al asignarlos.
- **Seguimiento de entregas**: Monitoreo del estado de entrega de cada equipo.

### Tecnologías clave:

- **Persistencia**: TypeORM con PostgreSQL/MySQL
- **Validación**: Verificación de disponibilidad y existencia de contratos
- **Transacciones**: Operaciones múltiples coordinadas


## 2. Endpoints Principales

### 2.1. Gestión de Asignaciones

| Endpoint                                      | Método | Descripción                                   | Parámetros                             | Validaciones                                 |
|----------------------------------------------|--------|-----------------------------------------------|----------------------------------------|----------------------------------------------|
| POST /api/v1/contract-devices/:quantity       | POST   | Asigna múltiples dispositivos a un contrato    | `quantity` + Body (`CreateContractDeviceDto`) | - Dispositivos disponibles<br>- Contrato existente |
| GET /api/v1/contract-devices                 | GET    | Lista todas las asignaciones                   | -                                      | -                                            |
| GET /api/v1/contract-devices/:id             | GET    | Obtiene asignación por ID                      | `id` (UUID)                            | UUID válido                                   |
| PUT /api/v1/contract-devices/:id             | PUT    | Actualiza asignación                           | `id` + Body (`CreateContractDeviceDto`) | Asignación existente                          |
| DELETE /api/v1/contract-devices/:id          | DELETE | Elimina asignación                             | `id` (UUID)                            | UUID válido                                   |

### 2.2. Consultas Especializadas

| Endpoint                                   | Descripción                            | Parámetros        |
|-------------------------------------------|----------------------------------------|-------------------|
| GET /api/v1/contract-devices/:deviceName  | Filtra por nombre de dispositivo       | `deviceName` (texto) |

## 3. Estructura de Datos

### 3.1. Entidad `ContractDevice`

```typescript
@Entity()
export class ContractDevice {
    @PrimaryGeneratedColumn('uuid') id: string;
    @Column('text') contract_id: string;  // Relación con Contract
    @Column('text') device_id: string;    // Relación con Device
    @Column('text') device_name: string;  // Redundancia para consultas
    @Column('text') delivery_status: string; // 'Entregado', 'Pendiente', etc.
}

```
### 3.2. DTO  `CreateContractDeviceDto`

```typescript
export class CreateContractDeviceDto {
    @IsString() contract_id: string;    // UUID del contrato
    @IsString() device_id: string;      // UUID del dispositivo
    @IsString() device_name: string;    // Nombre del dispositivo
    @IsString() delivery_status: string;// Estado de entrega
}
```

## 4. Flujos Clave

### 4.1. Asignación Múltiple de Dispositivos

- Verifica disponibilidad de dispositivos (`status: 'Disponible'`)
- Confirma existencia del contrato
- Por cada dispositivo:
  - Crea registro en `contract_devices`
  - Actualiza estado del dispositivo a `'Asignado'`
- Retorna confirmación

### 4.2. Integración con otros módulos

- **Contracts**: Validación de existencia de contrato
- **Devices**: Cambio de estado y control de inventario

## 5. Seguridad y Validaciones

### Verificaciones estrictas

```typescript
if (availableDevices.length < quantity) {
  throw new BadRequestException(`No hay suficientes dispositivos...`);
}
```
## Manejo de errores
    NotFoundException para recursos inexistentes

    BadRequestException para operaciones inválidas










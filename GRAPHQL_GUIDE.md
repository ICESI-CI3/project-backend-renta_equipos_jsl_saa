# GraphQL en el Proyecto - Guía de Uso

## Configuración Completada

El proyecto ya está configurado para usar GraphQL con Apollo Server. Puedes acceder al playground de GraphQL en: `http://localhost:3000/graphql`

## Estructura de Archivos GraphQL

### Módulo de Usuarios (Ejemplo)

```
src/users/
├── users.graphql          # Esquema GraphQL
├── users.resolver.ts      # Resolver de GraphQL
├── dto/
│   ├── create-user.input.ts    # Input para crear usuario
│   ├── update-user.input.ts    # Input para actualizar usuario
│   └── pagination.input.ts     # Input para paginación
└── types/
    └── user.type.ts       # Object Type de GraphQL
```

## Queries Disponibles

### 1. Obtener todos los usuarios con paginación
```graphql
query GetUsers {
  users(pagination: { limit: 10, offset: 0 }) {
    id
    name
    email
    cellphone
    address
    role
  }
}
```

### 2. Obtener un usuario por ID
```graphql
query GetUser($id: ID!) {
  user(id: $id) {
    id
    name
    email
    cellphone
    address
    role
  }
}
```

### 3. Obtener un usuario por email
```graphql
query GetUserByEmail($email: String!) {
  userByEmail(email: $email) {
    id
    name
    email
    cellphone
    address
    role
  }
}
```

## Mutations Disponibles

### 1. Crear un nuevo usuario
```graphql
mutation CreateUser($createUserInput: CreateUserInput!) {
  createUser(createUserInput: $createUserInput) {
    id
    name
    email
    cellphone
    address
    role
  }
}
```

Variables:
```json
{
  "createUserInput": {
    "name": "Juan Pérez",
    "email": "juan.perez@example.com",
    "password": "Segura123",
    "cellphone": "3001234567",
    "address": "Calle 123 #45-67",
    "role": "user"
  }
}
```

### 2. Actualizar un usuario
```graphql
mutation UpdateUser($id: ID!, $updateUserInput: UpdateUserInput!) {
  updateUser(id: $id, updateUserInput: $updateUserInput) {
    id
    name
    email
    cellphone
    address
    role
  }
}
```

Variables:
```json
{
  "id": "uuid-del-usuario",
  "updateUserInput": {
    "name": "Juan Carlos Pérez",
    "cellphone": "3009876543"
  }
}
```

### 3. Eliminar un usuario
```graphql
mutation RemoveUser($id: ID!) {
  removeUser(id: $id)
}
```

Variables:
```json
{
  "id": "uuid-del-usuario"
}
```

## Cómo Extender GraphQL a Otros Módulos

### 1. Crear el esquema GraphQL
Crea un archivo `.graphql` en el módulo correspondiente (ej: `devices.graphql`)

### 2. Crear los inputs
Crea los archivos de input en el directorio `dto/`:
- `create-[entity].input.ts`
- `update-[entity].input.ts`

### 3. Crear el Object Type
Crea el archivo de tipo en `types/[entity].type.ts`

### 4. Crear el Resolver
Crea el archivo `[entity].resolver.ts` con decoradores `@Query` y `@Mutation`

### 5. Registrar el Resolver
Agrega el resolver al array `providers` en el módulo correspondiente

## Ejemplo de Object Type

```typescript
import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class DeviceType {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field()
  description: string;

  @Field()
  status: string;
}
```

## Ejemplo de Input

```typescript
import { InputType, Field } from '@nestjs/graphql';
import { IsString, IsNotEmpty } from 'class-validator';

@InputType()
export class CreateDeviceInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  name: string;

  @Field()
  @IsString()
  description: string;

  @Field({ defaultValue: 'available' })
  status?: string;
}
```

## Ejemplo de Resolver

```typescript
import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { DevicesService } from './devices.service';
import { DeviceType } from './types/device.type';
import { CreateDeviceInput } from './dto/create-device.input';

@Resolver(() => DeviceType)
export class DevicesResolver {
  constructor(private readonly devicesService: DevicesService) {}

  @Query(() => [DeviceType], { name: 'devices' })
  async findAll(): Promise<DeviceType[]> {
    return await this.devicesService.findAll();
  }

  @Mutation(() => DeviceType)
  async createDevice(
    @Args('createDeviceInput') createDeviceInput: CreateDeviceInput
  ): Promise<DeviceType> {
    return await this.devicesService.create(createDeviceInput);
  }
}
```

## Validaciones

Los inputs de GraphQL utilizan las mismas validaciones de `class-validator` que los DTOs tradicionales:
- `@IsString()`
- `@IsEmail()`
- `@MinLength()`, `@MaxLength()`
- `@Matches()`
- `@IsOptional()`

## Configuración en app.module.ts

La configuración actual de GraphQL en el módulo principal:

```typescript
GraphQLModule.forRootAsync<ApolloDriverConfig>({
  driver: ApolloDriver,
  useFactory: () => ({
    typePaths: ['./**/*.graphql'],
    playground: true,
    introspection: true,
  }),
}),
```

## Herramientas de Desarrollo

- **GraphQL Playground**: http://localhost:3000/graphql
- **Introspección**: Habilitada para desarrollo
- **Validación automática**: Los inputs se validan automáticamente

## Notas Importantes

1. Los esquemas `.graphql` se cargan automáticamente desde cualquier directorio
2. Los resolvers deben estar registrados en sus respectivos módulos
3. Los Object Types y Inputs utilizan decoradores específicos de GraphQL
4. Las validaciones funcionan igual que en REST APIs
5. GraphQL coexiste con las APIs REST existentes

## Próximos Pasos

Para extender GraphQL a otros módulos del proyecto:
1. Devices
2. Requests
3. Contracts
4. Request Devices
5. Contract Devices

Cada módulo seguirá el mismo patrón establecido en el módulo de usuarios.

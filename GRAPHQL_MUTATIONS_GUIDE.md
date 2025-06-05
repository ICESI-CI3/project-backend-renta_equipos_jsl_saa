# Guía Completa de GraphQL Mutations

## ¿Qué son las Mutations en GraphQL?

Las **mutations** en GraphQL son operaciones que permiten modificar datos en el servidor. Son equivalentes a las operaciones POST, PUT, PATCH y DELETE en REST APIs.

## Estructura de una Mutation

```graphql
mutation {
  nombreDeLaMutation(argumentos) {
    camposDeRespuesta
  }
}
```

## Mutations Disponibles en tu API

### 1. createUser - Crear un nuevo usuario

**Sintaxis:**
```graphql
mutation {
  createUser(createUserInput: {
    name: "string"
    email: "string"
    password: "string"
    cellphone: "string"
    address: "string"
    role: "string" # opcional, por defecto es "user"
  }) {
    id
    name
    email
    cellphone
    address
    role
    createdAt
    updatedAt
  }
}
```

**Ejemplo Práctico:**
```graphql
mutation CreateNewUser {
  createUser(createUserInput: {
    name: "Juan Pérez"
    email: "juan.perez@gmail.com"
    password: "Password123"
    cellphone: "3001234567"
    address: "Calle 123 #45-67"
    role: "user"
  }) {
    id
    name
    email
    cellphone
    address
    role
    createdAt
  }
}
```

### 2. updateUser - Actualizar un usuario existente

**Sintaxis:**
```graphql
mutation {
  updateUser(id: "ID_DEL_USUARIO", updateUserInput: {
    name: "string"        # opcional
    email: "string"       # opcional
    cellphone: "string"   # opcional
    address: "string"     # opcional
    role: "string"        # opcional
  }) {
    id
    name
    email
    cellphone
    address
    role
    updatedAt
  }
}
```

**Ejemplo Práctico:**
```graphql
mutation UpdateExistingUser {
  updateUser(id: "675a123b456c789d012e3456", updateUserInput: {
    name: "Juan Carlos Pérez"
    cellphone: "3009876543"
    address: "Nueva Calle 456 #78-90"
  }) {
    id
    name
    email
    cellphone
    address
    updatedAt
  }
}
```

### 3. removeUser - Eliminar un usuario

**Sintaxis:**
```graphql
mutation {
  removeUser(id: "ID_DEL_USUARIO")
}
```

**Ejemplo Práctico:**
```graphql
mutation DeleteUser {
  removeUser(id: "675a123b456c789d012e3456")
}
```

## Cómo Probar las Mutations

### 1. Usando GraphQL Playground (Recomendado)

1. Ve a `http://localhost:3000/graphql`
2. En el panel izquierdo, escribe tu mutation
3. Haz click en el botón de play ▶️
4. Ve el resultado en el panel derecho

### 2. Usando cURL

```bash
# Crear usuario
curl -X POST http://localhost:3000/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "mutation { createUser(createUserInput: { name: \"Juan Pérez\", email: \"juan@gmail.com\", password: \"Password123\", cellphone: \"3001234567\", address: \"Calle 123\" }) { id name email } }"
  }'
```

### 3. Usando JavaScript/TypeScript (Frontend)

```javascript
// Con fetch
const createUser = async () => {
  const response = await fetch('http://localhost:3000/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: `
        mutation CreateUser($input: CreateUserInput!) {
          createUser(createUserInput: $input) {
            id
            name
            email
            cellphone
            address
            role
          }
        }
      `,
      variables: {
        input: {
          name: "María García",
          email: "maria@gmail.com",
          password: "Password123",
          cellphone: "3001234567",
          address: "Carrera 15 #20-30"
        }
      }
    })
  });
  
  const result = await response.json();
  return result.data.createUser;
};
```

## Variables en Mutations

Puedes usar variables para hacer tus mutations más reutilizables:

### Definir la Mutation con Variables:
```graphql
mutation CreateUserWithVariables($userInput: CreateUserInput!) {
  createUser(createUserInput: $userInput) {
    id
    name
    email
    cellphone
  }
}
```

### Panel de Variables (en GraphQL Playground):
```json
{
  "userInput": {
    "name": "Ana López",
    "email": "ana.lopez@gmail.com",
    "password": "SecurePass123",
    "cellphone": "3009876543",
    "address": "Avenida 80 #45-12",
    "role": "admin"
  }
}
```

## Validaciones y Errores

### Errores de Validación Comunes:

1. **Email inválido:**
```json
{
  "errors": [
    {
      "message": "Debe ser un email válido",
      "path": ["createUser"]
    }
  ]
}
```

2. **Contraseña débil:**
```json
{
  "errors": [
    {
      "message": "La contraseña debe tener al menos una letra mayúscula y un número",
      "path": ["createUser"]
    }
  ]
}
```

3. **Celular inválido:**
```json
{
  "errors": [
    {
      "message": "El número de celular debe tener 10 dígitos",
      "path": ["createUser"]
    }
  ]
}
```

## Mejores Prácticas

### 1. Siempre solicita los campos que necesitas
```graphql
mutation {
  createUser(createUserInput: { /* ... */ }) {
    id        # Siempre útil para referencias futuras
    name      # Solo si lo necesitas
    email     # Solo si lo necesitas
    createdAt # Solo si lo necesitas
  }
}
```

### 2. Usa variables para datos dinámicos
```graphql
mutation CreateUser($input: CreateUserInput!) {
  createUser(createUserInput: $input) {
    id
    name
    email
  }
}
```

### 3. Maneja errores apropiadamente
```javascript
try {
  const result = await createUser();
  console.log('Usuario creado:', result);
} catch (error) {
  console.error('Error al crear usuario:', error);
}
```

### 4. Valida datos del lado del cliente también
```javascript
const validateEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const validatePassword = (password) => {
  return /^(?=.*[A-Z])(?=.*\d).{8,}$/.test(password);
};
```

## Comparación con REST

| REST | GraphQL |
|------|---------|
| `POST /users` | `mutation { createUser(...) }` |
| `PUT /users/:id` | `mutation { updateUser(id: ...) }` |
| `DELETE /users/:id` | `mutation { removeUser(id: ...) }` |

## Ventajas de GraphQL Mutations

1. **Una sola URL:** Todas las mutations van a `/graphql`
2. **Flexibilidad:** Puedes solicitar exactamente los campos que necesitas
3. **Tipo seguro:** El schema define exactamente qué es válido
4. **Introspección:** Puedes explorar la API automáticamente
5. **Validación:** Las validaciones están definidas en el servidor

## Próximos Pasos

1. Prueba las mutations en GraphQL Playground
2. Implementa las mutations en tu frontend
3. Añade manejo de errores
4. Considera añadir autenticación a las mutations sensibles

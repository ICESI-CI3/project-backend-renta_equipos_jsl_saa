# Testing GraphQL API - Usuarios

## Ejemplos con cURL

### 1. Obtener todos los usuarios
```bash
curl -X POST http://localhost:3000/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "query GetUsers($pagination: PaginationInput) { users(pagination: $pagination) { id name email cellphone address role } }",
    "variables": {
      "pagination": {
        "limit": 5,
        "offset": 0
      }
    }
  }'
```

### 2. Obtener usuario por ID
```bash
curl -X POST http://localhost:3000/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "query GetUser($id: ID!) { user(id: $id) { id name email cellphone address role } }",
    "variables": {
      "id": "tu-user-id-aqui"
    }
  }'
```

### 3. Obtener usuario por email
```bash
curl -X POST http://localhost:3000/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "query GetUserByEmail($email: String!) { userByEmail(email: $email) { id name email cellphone address role } }",
    "variables": {
      "email": "juan@example.com"
    }
  }'
```

### 4. Crear usuario
```bash
curl -X POST http://localhost:3000/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "mutation CreateUser($createUserInput: CreateUserInput!) { createUser(createUserInput: $createUserInput) { id name email cellphone address role } }",
    "variables": {
      "createUserInput": {
        "name": "María García",
        "email": "maria@example.com",
        "password": "Segura123",
        "cellphone": "3009876543",
        "address": "Calle 456 #78-90",
        "role": "user"
      }
    }
  }'
```

### 5. Actualizar usuario
```bash
curl -X POST http://localhost:3000/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "mutation UpdateUser($id: ID!, $updateUserInput: UpdateUserInput!) { updateUser(id: $id, updateUserInput: $updateUserInput) { id name email cellphone address role } }",
    "variables": {
      "id": "tu-user-id-aqui",
      "updateUserInput": {
        "name": "María García Updated",
        "cellphone": "3001111111"
      }
    }
  }'
```

### 6. Eliminar usuario
```bash
curl -X POST http://localhost:3000/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "mutation RemoveUser($id: ID!) { removeUser(id: $id) }",
    "variables": {
      "id": "tu-user-id-aqui"
    }
  }'
```

## Ejemplos para Postman/Insomnia

### Configuración Base:
- **URL**: `http://localhost:3000/graphql`
- **Método**: `POST`
- **Headers**: 
  - `Content-Type: application/json`

### 1. Query: Obtener usuarios con paginación
```json
{
  "query": "query GetUsers($pagination: PaginationInput) { users(pagination: $pagination) { id name email cellphone address role } }",
  "variables": {
    "pagination": {
      "limit": 10,
      "offset": 0
    }
  }
}
```

### 2. Query: Buscar usuario por ID
```json
{
  "query": "query GetUser($id: ID!) { user(id: $id) { id name email cellphone address role } }",
  "variables": {
    "id": "replace-with-actual-user-id"
  }
}
```

### 3. Query: Buscar por email
```json
{
  "query": "query GetUserByEmail($email: String!) { userByEmail(email: $email) { id name email cellphone address role } }",
  "variables": {
    "email": "test@example.com"
  }
}
```

### 4. Mutation: Crear usuario
```json
{
  "query": "mutation CreateUser($createUserInput: CreateUserInput!) { createUser(createUserInput: $createUserInput) { id name email cellphone address role } }",
  "variables": {
    "createUserInput": {
      "name": "Carlos Rodriguez",
      "email": "carlos@example.com",
      "password": "MiPassword123",
      "cellphone": "3012345678",
      "address": "Carrera 15 #30-25",
      "role": "admin"
    }
  }
}
```

### 5. Mutation: Actualizar usuario
```json
{
  "query": "mutation UpdateUser($id: ID!, $updateUserInput: UpdateUserInput!) { updateUser(id: $id, updateUserInput: $updateUserInput) { id name email cellphone address role } }",
  "variables": {
    "id": "replace-with-user-id",
    "updateUserInput": {
      "name": "Carlos Rodriguez Updated",
      "address": "Nueva dirección 123",
      "role": "user"
    }
  }
}
```

### 6. Mutation: Eliminar usuario
```json
{
  "query": "mutation RemoveUser($id: ID!) { removeUser(id: $id) }",
  "variables": {
    "id": "replace-with-user-id"
  }
}
```

## Introspección del Schema

### Obtener el schema completo:
```json
{
  "query": "query IntrospectionQuery { __schema { types { name kind description fields { name type { name kind ofType { name kind } } } } } }"
}
```

### Obtener tipos disponibles:
```json
{
  "query": "query { __schema { types { name } } }"
}
```

### Obtener queries disponibles:
```json
{
  "query": "query { __schema { queryType { fields { name description args { name type { name } } } } } }"
}
```

### Obtener mutations disponibles:
```json
{
  "query": "query { __schema { mutationType { fields { name description args { name type { name } } } } } }"
}
```

## JavaScript/Node.js Examples

### Con node-fetch:
```javascript
const fetch = require('node-fetch');

async function testGraphQL() {
  // Crear usuario
  const createUserQuery = {
    query: `
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
    `,
    variables: {
      createUserInput: {
        name: "Test User",
        email: "test@example.com",
        password: "TestPass123",
        cellphone: "3000000000",
        address: "Test Address",
        role: "user"
      }
    }
  };

  try {
    const response = await fetch('http://localhost:3000/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(createUserQuery)
    });

    const result = await response.json();
    
    if (result.errors) {
      console.error('GraphQL Errors:', result.errors);
      return;
    }

    console.log('Usuario creado:', result.data.createUser);

    // Obtener todos los usuarios
    const getUsersQuery = {
      query: `
        query GetUsers {
          users {
            id
            name
            email
            role
          }
        }
      `
    };

    const usersResponse = await fetch('http://localhost:3000/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(getUsersQuery)
    });

    const usersResult = await usersResponse.json();
    console.log('Usuarios:', usersResult.data.users);

  } catch (error) {
    console.error('Error:', error);
  }
}

testGraphQL();
```

## Responses Examples

### Respuesta exitosa - Query:
```json
{
  "data": {
    "users": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440000",
        "name": "Juan Pérez",
        "email": "juan@example.com",
        "cellphone": "3001234567",
        "address": "Calle 123 #45-67",
        "role": "user"
      }
    ]
  }
}
```

### Respuesta exitosa - Mutation:
```json
{
  "data": {
    "createUser": {
      "id": "550e8400-e29b-41d4-a716-446655440001",
      "name": "María García",
      "email": "maria@example.com",
      "cellphone": "3009876543",
      "address": "Calle 456 #78-90",
      "role": "user"
    }
  }
}
```

### Respuesta con errores:
```json
{
  "errors": [
    {
      "message": "El usuario ya existe",
      "locations": [
        {
          "line": 2,
          "column": 3
        }
      ],
      "path": ["createUser"],
      "extensions": {
        "code": "BAD_USER_INPUT"
      }
    }
  ],
  "data": null
}
```

### Respuesta de validación:
```json
{
  "errors": [
    {
      "message": "Argument Validation Error",
      "extensions": {
        "code": "GRAPHQL_VALIDATION_FAILED",
        "exception": {
          "validationErrors": [
            {
              "target": {},
              "property": "email",
              "children": [],
              "constraints": {
                "isEmail": "Debe ser un email válido"
              }
            }
          ]
        }
      }
    }
  ]
}
```

## Testeo de Validaciones

### Email inválido:
```json
{
  "query": "mutation CreateUser($createUserInput: CreateUserInput!) { createUser(createUserInput: $createUserInput) { id name email } }",
  "variables": {
    "createUserInput": {
      "name": "Test",
      "email": "email-invalido",
      "password": "Test123",
      "cellphone": "3000000000",
      "address": "Test Address"
    }
  }
}
```

### Password débil:
```json
{
  "query": "mutation CreateUser($createUserInput: CreateUserInput!) { createUser(createUserInput: $createUserInput) { id name email } }",
  "variables": {
    "createUserInput": {
      "name": "Test",
      "email": "test@example.com",
      "password": "123",
      "cellphone": "3000000000",
      "address": "Test Address"
    }
  }
}
```

### Teléfono inválido:
```json
{
  "query": "mutation CreateUser($createUserInput: CreateUserInput!) { createUser(createUserInput: $createUserInput) { id name email } }",
  "variables": {
    "createUserInput": {
      "name": "Test",
      "email": "test@example.com",
      "password": "Test123",
      "cellphone": "123",
      "address": "Test Address"
    }
  }
}
```

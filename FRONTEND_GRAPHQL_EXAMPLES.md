# Ejemplos de Consultas GraphQL para Frontend

## Configuración del Cliente GraphQL

### Para JavaScript/TypeScript con Apollo Client:

```bash
npm install @apollo/client graphql
```

```typescript
import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';

const httpLink = createHttpLink({
  uri: 'http://localhost:3000/graphql',
});

const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});
```

### Para React con Apollo Client:

```typescript
import { ApolloProvider } from '@apollo/client';

function App() {
  return (
    <ApolloProvider client={client}>
      {/* Tu aplicación */}
    </ApolloProvider>
  );
}
```

## Consultas (Queries)

### 1. Obtener todos los usuarios

```typescript
import { gql, useQuery } from '@apollo/client';

const GET_USERS = gql`
  query GetUsers($pagination: PaginationInput) {
    users(pagination: $pagination) {
      id
      name
      email
      cellphone
      address
      role
    }
  }
`;

// En React
function UsersList() {
  const { loading, error, data } = useQuery(GET_USERS, {
    variables: {
      pagination: {
        limit: 10,
        offset: 0
      }
    }
  });

  if (loading) return <p>Cargando...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <ul>
      {data.users.map(user => (
        <li key={user.id}>
          {user.name} - {user.email}
        </li>
      ))}
    </ul>
  );
}
```

### 2. Obtener un usuario por ID

```typescript
const GET_USER_BY_ID = gql`
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
`;

// Uso
function UserProfile({ userId }) {
  const { loading, error, data } = useQuery(GET_USER_BY_ID, {
    variables: { id: userId }
  });

  if (loading) return <p>Cargando usuario...</p>;
  if (error) return <p>Error: {error.message}</p>;
  if (!data?.user) return <p>Usuario no encontrado</p>;

  const { user } = data;
  return (
    <div>
      <h2>{user.name}</h2>
      <p>Email: {user.email}</p>
      <p>Teléfono: {user.cellphone}</p>
      <p>Dirección: {user.address}</p>
      <p>Rol: {user.role}</p>
    </div>
  );
}
```

### 3. Obtener usuario por email

```typescript
const GET_USER_BY_EMAIL = gql`
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
`;

// Uso con lazy query
function SearchUser() {
  const [searchUser, { loading, error, data }] = useLazyQuery(GET_USER_BY_EMAIL);

  const handleSearch = (email: string) => {
    searchUser({ variables: { email } });
  };

  return (
    <div>
      <input 
        type="email" 
        placeholder="Buscar por email"
        onBlur={(e) => handleSearch(e.target.value)}
      />
      {loading && <p>Buscando...</p>}
      {error && <p>Error: {error.message}</p>}
      {data?.userByEmail && (
        <div>Usuario encontrado: {data.userByEmail.name}</div>
      )}
    </div>
  );
}
```

## Mutaciones (Mutations)

### 1. Crear usuario

```typescript
import { gql, useMutation } from '@apollo/client';

const CREATE_USER = gql`
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
`;

function CreateUserForm() {
  const [createUser, { loading, error }] = useMutation(CREATE_USER, {
    // Actualizar cache después de crear
    refetchQueries: [{ query: GET_USERS }],
  });

  const handleSubmit = async (formData) => {
    try {
      const { data } = await createUser({
        variables: {
          createUserInput: {
            name: formData.name,
            email: formData.email,
            password: formData.password,
            cellphone: formData.cellphone,
            address: formData.address,
            role: formData.role || 'user'
          }
        }
      });
      
      console.log('Usuario creado:', data.createUser);
      // Manejar éxito (ej: mostrar mensaje, limpiar formulario)
    } catch (err) {
      console.error('Error al crear usuario:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Campos del formulario */}
      <button type="submit" disabled={loading}>
        {loading ? 'Creando...' : 'Crear Usuario'}
      </button>
      {error && <p>Error: {error.message}</p>}
    </form>
  );
}
```

### 2. Actualizar usuario

```typescript
const UPDATE_USER = gql`
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
`;

function EditUserForm({ userId, initialData }) {
  const [updateUser, { loading, error }] = useMutation(UPDATE_USER);

  const handleUpdate = async (formData) => {
    try {
      const { data } = await updateUser({
        variables: {
          id: userId,
          updateUserInput: {
            name: formData.name,
            email: formData.email,
            cellphone: formData.cellphone,
            address: formData.address,
            role: formData.role
          }
        }
      });
      
      console.log('Usuario actualizado:', data.updateUser);
    } catch (err) {
      console.error('Error al actualizar usuario:', err);
    }
  };

  return (
    <form onSubmit={handleUpdate}>
      {/* Campos del formulario con valores iniciales */}
      <button type="submit" disabled={loading}>
        {loading ? 'Actualizando...' : 'Actualizar Usuario'}
      </button>
      {error && <p>Error: {error.message}</p>}
    </form>
  );
}
```

### 3. Eliminar usuario

```typescript
const DELETE_USER = gql`
  mutation RemoveUser($id: ID!) {
    removeUser(id: $id)
  }
`;

function DeleteUserButton({ userId }) {
  const [deleteUser, { loading }] = useMutation(DELETE_USER, {
    // Actualizar cache después de eliminar
    refetchQueries: [{ query: GET_USERS }],
  });

  const handleDelete = async () => {
    if (window.confirm('¿Estás seguro de eliminar este usuario?')) {
      try {
        await deleteUser({ variables: { id: userId } });
        console.log('Usuario eliminado');
      } catch (err) {
        console.error('Error al eliminar usuario:', err);
      }
    }
  };

  return (
    <button onClick={handleDelete} disabled={loading}>
      {loading ? 'Eliminando...' : 'Eliminar'}
    </button>
  );
}
```

## Ejemplos con Fetch API (Sin Apollo Client)

### Consulta con fetch

```typescript
async function fetchUsers() {
  const query = `
    query GetUsers($pagination: PaginationInput) {
      users(pagination: $pagination) {
        id
        name
        email
        cellphone
        address
        role
      }
    }
  `;

  const response = await fetch('http://localhost:3000/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query,
      variables: {
        pagination: {
          limit: 10,
          offset: 0
        }
      }
    }),
  });

  const result = await response.json();
  
  if (result.errors) {
    throw new Error(result.errors[0].message);
  }
  
  return result.data.users;
}
```

### Mutación con fetch

```typescript
async function createUser(userData) {
  const mutation = `
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
  `;

  const response = await fetch('http://localhost:3000/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: mutation,
      variables: {
        createUserInput: userData
      }
    }),
  });

  const result = await response.json();
  
  if (result.errors) {
    throw new Error(result.errors[0].message);
  }
  
  return result.data.createUser;
}

// Uso
try {
  const newUser = await createUser({
    name: 'Juan Pérez',
    email: 'juan@example.com',
    password: 'Segura123',
    cellphone: '3001234567',
    address: 'Calle 123',
    role: 'user'
  });
  console.log('Usuario creado:', newUser);
} catch (error) {
  console.error('Error:', error.message);
}
```

## Manejo de Errores

```typescript
// Con Apollo Client
const [createUser] = useMutation(CREATE_USER, {
  onError: (error) => {
    if (error.graphQLErrors.length > 0) {
      // Errores de validación del servidor
      error.graphQLErrors.forEach(({ message, extensions }) => {
        console.error('GraphQL Error:', message);
        if (extensions?.code === 'BAD_USER_INPUT') {
          // Manejar errores de validación
        }
      });
    }
    
    if (error.networkError) {
      // Errores de red
      console.error('Network Error:', error.networkError);
    }
  },
  onCompleted: (data) => {
    console.log('Operación completada:', data);
  }
});
```

## Tipos TypeScript (Opcional)

```typescript
// types/user.types.ts
export interface User {
  id: string;
  name: string;
  email: string;
  cellphone: string;
  address: string;
  role: string;
}

export interface CreateUserInput {
  name: string;
  email: string;
  password: string;
  cellphone: string;
  address: string;
  role?: string;
}

export interface UpdateUserInput {
  name?: string;
  email?: string;
  cellphone?: string;
  address?: string;
  role?: string;
}

export interface PaginationInput {
  limit?: number;
  offset?: number;
}
```

## Configuración con Autenticación (JWT)

```typescript
import { setContext } from '@apollo/client/link/context';

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('token');
  
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    }
  }
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});
```

## Testeo en Postman o Insomnia

```json
POST http://localhost:3000/graphql
Content-Type: application/json

{
  "query": "query GetUsers { users { id name email } }",
  "variables": {}
}
```

## Variables de Entorno

```javascript
// .env
REACT_APP_GRAPHQL_URI=http://localhost:3000/graphql

// En tu código
const client = new ApolloClient({
  uri: process.env.REACT_APP_GRAPHQL_URI,
  cache: new InMemoryCache(),
});
```

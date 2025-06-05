# GraphQL Frontend Testing Guide

## Configuración del Cliente GraphQL

### 1. Instalación de dependencias para React

```bash
npm install @apollo/client graphql
```

### 2. Configuración de Apollo Client

```javascript
// src/apollo/client.js
import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

const httpLink = createHttpLink({
  uri: 'http://localhost:3000/graphql',
});

// Para autenticación (opcional)
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
  cache: new InMemoryCache()
});

export default client;
```

### 3. Configuración del Provider en App.js

```javascript
// src/App.js
import React from 'react';
import { ApolloProvider } from '@apollo/client';
import client from './apollo/client';
import UserManager from './components/UserManager';

function App() {
  return (
    <ApolloProvider client={client}>
      <div className="App">
        <h1>GraphQL User Management</h1>
        <UserManager />
      </div>
    </ApolloProvider>
  );
}

export default App;
```

## Queries y Mutations GraphQL

### Definir las operaciones GraphQL

```javascript
// src/graphql/userOperations.js
import { gql } from '@apollo/client';

// Obtener todos los usuarios
export const GET_USERS = gql`
  query GetUsers($pagination: PaginationInput) {
    users(pagination: $pagination) {
      id
      name
      email
      cellphone
      address
      role
      createdAt
    }
  }
`;

// Obtener un usuario por ID
export const GET_USER = gql`
  query GetUser($id: ID!) {
    user(id: $id) {
      id
      name
      email
      cellphone
      address
      role
      createdAt
    }
  }
`;

// Obtener usuario por email
export const GET_USER_BY_EMAIL = gql`
  query GetUserByEmail($email: String!) {
    userByEmail(email: $email) {
      id
      name
      email
      cellphone
      address
      role
      createdAt
    }
  }
`;

// Crear usuario
export const CREATE_USER = gql`
  mutation CreateUser($createUserInput: CreateUserInput!) {
    createUser(createUserInput: $createUserInput) {
      id
      name
      email
      cellphone
      address
      role
      createdAt
    }
  }
`;

// Actualizar usuario
export const UPDATE_USER = gql`
  mutation UpdateUser($id: ID!, $updateUserInput: UpdateUserInput!) {
    updateUser(id: $id, updateUserInput: $updateUserInput) {
      id
      name
      email
      cellphone
      address
      role
      createdAt
    }
  }
`;

// Eliminar usuario
export const DELETE_USER = gql`
  mutation DeleteUser($id: ID!) {
    removeUser(id: $id)
  }
`;
```

## Componente React Completo para Gestión de Usuarios

```javascript
// src/components/UserManager.js
import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import {
  GET_USERS,
  GET_USER,
  GET_USER_BY_EMAIL,
  CREATE_USER,
  UPDATE_USER,
  DELETE_USER
} from '../graphql/userOperations';

const UserManager = () => {
  const [selectedUserId, setSelectedUserId] = useState('');
  const [searchEmail, setSearchEmail] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    cellphone: '',
    address: '',
    role: 'USER'
  });
  const [editingUser, setEditingUser] = useState(null);

  // Queries
  const { data: usersData, loading: usersLoading, refetch: refetchUsers } = useQuery(GET_USERS, {
    variables: { pagination: { limit: 20, offset: 0 } }
  });

  const { data: userByIdData, loading: userByIdLoading } = useQuery(GET_USER, {
    variables: { id: selectedUserId },
    skip: !selectedUserId
  });

  const { data: userByEmailData, loading: userByEmailLoading } = useQuery(GET_USER_BY_EMAIL, {
    variables: { email: searchEmail },
    skip: !searchEmail
  });

  // Mutations
  const [createUser, { loading: createLoading }] = useMutation(CREATE_USER, {
    onCompleted: () => {
      refetchUsers();
      resetForm();
      alert('Usuario creado exitosamente');
    },
    onError: (error) => {
      alert(`Error al crear usuario: ${error.message}`);
    }
  });

  const [updateUser, { loading: updateLoading }] = useMutation(UPDATE_USER, {
    onCompleted: () => {
      refetchUsers();
      setEditingUser(null);
      resetForm();
      alert('Usuario actualizado exitosamente');
    },
    onError: (error) => {
      alert(`Error al actualizar usuario: ${error.message}`);
    }
  });

  const [deleteUser, { loading: deleteLoading }] = useMutation(DELETE_USER, {
    onCompleted: () => {
      refetchUsers();
      alert('Usuario eliminado exitosamente');
    },
    onError: (error) => {
      alert(`Error al eliminar usuario: ${error.message}`);
    }
  });

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      password: '',
      cellphone: '',
      address: '',
      role: 'USER'
    });
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editingUser) {
      // Actualizar usuario
      const updateInput = {
        name: formData.name,
        email: formData.email,
        cellphone: formData.cellphone,
        address: formData.address,
        role: formData.role
      };

      updateUser({
        variables: {
          id: editingUser.id,
          updateUserInput: updateInput
        }
      });
    } else {
      // Crear usuario
      createUser({
        variables: {
          createUserInput: formData
        }
      });
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      password: '',
      cellphone: user.cellphone || '',
      address: user.address || '',
      role: user.role
    });
  };

  const handleDelete = (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
      deleteUser({ variables: { id } });
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Formulario de creación/edición */}
      <div style={{ marginBottom: '30px', padding: '20px', border: '1px solid #ddd', borderRadius: '5px' }}>
        <h3>{editingUser ? 'Editar Usuario' : 'Crear Nuevo Usuario'}</h3>
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
            <input
              type="text"
              name="name"
              placeholder="Nombre"
              value={formData.name}
              onChange={handleInputChange}
              required
              style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleInputChange}
              required
              style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
            />
            {!editingUser && (
              <input
                type="password"
                name="password"
                placeholder="Contraseña"
                value={formData.password}
                onChange={handleInputChange}
                required
                style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
              />
            )}
            <input
              type="text"
              name="cellphone"
              placeholder="Teléfono"
              value={formData.cellphone}
              onChange={handleInputChange}
              style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
            />
            <input
              type="text"
              name="address"
              placeholder="Dirección"
              value={formData.address}
              onChange={handleInputChange}
              style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
            />
            <select
              name="role"
              value={formData.role}
              onChange={handleInputChange}
              style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
            >
              <option value="USER">Usuario</option>
              <option value="ADMIN">Administrador</option>
            </select>
          </div>
          <div>
            <button
              type="submit"
              disabled={createLoading || updateLoading}
              style={{
                padding: '10px 20px',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                marginRight: '10px'
              }}
            >
              {createLoading || updateLoading ? 'Procesando...' : (editingUser ? 'Actualizar' : 'Crear')}
            </button>
            {editingUser && (
              <button
                type="button"
                onClick={() => {
                  setEditingUser(null);
                  resetForm();
                }}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#6c757d',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Cancelar
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Búsqueda */}
      <div style={{ marginBottom: '30px', padding: '20px', border: '1px solid #ddd', borderRadius: '5px' }}>
        <h3>Buscar Usuarios</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
          <div>
            <label>Buscar por ID:</label>
            <input
              type="text"
              value={selectedUserId}
              onChange={(e) => setSelectedUserId(e.target.value)}
              placeholder="ID del usuario"
              style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px', width: '100%' }}
            />
            {userByIdLoading && <p>Cargando usuario...</p>}
            {userByIdData?.user && (
              <div style={{ marginTop: '10px', padding: '10px', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
                <strong>{userByIdData.user.name}</strong> ({userByIdData.user.email})
                <br />
                Rol: {userByIdData.user.role}
              </div>
            )}
          </div>
          <div>
            <label>Buscar por Email:</label>
            <input
              type="email"
              value={searchEmail}
              onChange={(e) => setSearchEmail(e.target.value)}
              placeholder="Email del usuario"
              style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px', width: '100%' }}
            />
            {userByEmailLoading && <p>Cargando usuario...</p>}
            {userByEmailData?.userByEmail && (
              <div style={{ marginTop: '10px', padding: '10px', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
                <strong>{userByEmailData.userByEmail.name}</strong> ({userByEmailData.userByEmail.email})
                <br />
                Rol: {userByEmailData.userByEmail.role}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Lista de usuarios */}
      <div>
        <h3>Lista de Usuarios</h3>
        {usersLoading ? (
          <p>Cargando usuarios...</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #ddd' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8f9fa' }}>
                  <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>ID</th>
                  <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>Nombre</th>
                  <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>Email</th>
                  <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>Teléfono</th>
                  <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>Rol</th>
                  <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {usersData?.users?.map((user) => (
                  <tr key={user.id}>
                    <td style={{ padding: '12px', border: '1px solid #ddd' }}>{user.id}</td>
                    <td style={{ padding: '12px', border: '1px solid #ddd' }}>{user.name}</td>
                    <td style={{ padding: '12px', border: '1px solid #ddd' }}>{user.email}</td>
                    <td style={{ padding: '12px', border: '1px solid #ddd' }}>{user.cellphone || '-'}</td>
                    <td style={{ padding: '12px', border: '1px solid #ddd' }}>{user.role}</td>
                    <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                      <button
                        onClick={() => handleEdit(user)}
                        style={{
                          padding: '5px 10px',
                          backgroundColor: '#ffc107',
                          color: 'black',
                          border: 'none',
                          borderRadius: '3px',
                          cursor: 'pointer',
                          marginRight: '5px'
                        }}
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(user.id)}
                        disabled={deleteLoading}
                        style={{
                          padding: '5px 10px',
                          backgroundColor: '#dc3545',
                          color: 'white',
                          border: 'none',
                          borderRadius: '3px',
                          cursor: 'pointer'
                        }}
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserManager;
```

## Hooks Personalizados para GraphQL

```javascript
// src/hooks/useUsers.js
import { useQuery, useMutation } from '@apollo/client';
import {
  GET_USERS,
  CREATE_USER,
  UPDATE_USER,
  DELETE_USER
} from '../graphql/userOperations';

export const useUsers = (pagination = { limit: 10, offset: 0 }) => {
  const { data, loading, error, refetch } = useQuery(GET_USERS, {
    variables: { pagination }
  });

  return {
    users: data?.users || [],
    loading,
    error,
    refetch
  };
};

export const useCreateUser = () => {
  const [createUserMutation, { loading, error }] = useMutation(CREATE_USER);

  const createUser = async (userData) => {
    try {
      const result = await createUserMutation({
        variables: { createUserInput: userData }
      });
      return result.data.createUser;
    } catch (err) {
      throw err;
    }
  };

  return { createUser, loading, error };
};

export const useUpdateUser = () => {
  const [updateUserMutation, { loading, error }] = useMutation(UPDATE_USER);

  const updateUser = async (id, userData) => {
    try {
      const result = await updateUserMutation({
        variables: { id, updateUserInput: userData }
      });
      return result.data.updateUser;
    } catch (err) {
      throw err;
    }
  };

  return { updateUser, loading, error };
};

export const useDeleteUser = () => {
  const [deleteUserMutation, { loading, error }] = useMutation(DELETE_USER);

  const deleteUser = async (id) => {
    try {
      const result = await deleteUserMutation({
        variables: { id }
      });
      return result.data.removeUser;
    } catch (err) {
      throw err;
    }
  };

  return { deleteUser, loading, error };
};
```

## Pruebas con JavaScript Vanilla (sin frameworks)

```javascript
// test-graphql.js
class GraphQLTester {
  constructor(url = 'http://localhost:3000/graphql') {
    this.url = url;
  }

  async query(query, variables = {}) {
    try {
      const response = await fetch(this.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query,
          variables
        })
      });

      const result = await response.json();
      
      if (result.errors) {
        console.error('GraphQL Errors:', result.errors);
        throw new Error(result.errors[0].message);
      }

      return result.data;
    } catch (error) {
      console.error('Request failed:', error);
      throw error;
    }
  }

  // Obtener todos los usuarios
  async getUsers(pagination = { limit: 10, offset: 0 }) {
    const query = `
      query GetUsers($pagination: PaginationInput) {
        users(pagination: $pagination) {
          id
          name
          email
          cellphone
          address
          role
          createdAt
        }
      }
    `;
    
    return await this.query(query, { pagination });
  }

  // Crear usuario
  async createUser(userData) {
    const mutation = `
      mutation CreateUser($createUserInput: CreateUserInput!) {
        createUser(createUserInput: $createUserInput) {
          id
          name
          email
          cellphone
          address
          role
          createdAt
        }
      }
    `;

    return await this.query(mutation, { createUserInput: userData });
  }

  // Actualizar usuario
  async updateUser(id, userData) {
    const mutation = `
      mutation UpdateUser($id: ID!, $updateUserInput: UpdateUserInput!) {
        updateUser(id: $id, updateUserInput: $updateUserInput) {
          id
          name
          email
          cellphone
          address
          role
          createdAt
        }
      }
    `;

    return await this.query(mutation, { id, updateUserInput: userData });
  }

  // Eliminar usuario
  async deleteUser(id) {
    const mutation = `
      mutation DeleteUser($id: ID!) {
        removeUser(id: $id)
      }
    `;

    return await this.query(mutation, { id });
  }
}

// Ejemplo de uso
const tester = new GraphQLTester();

// Probar creación de usuario
tester.createUser({
  name: "Juan Pérez",
  email: "juan@example.com",
  password: "password123",
  cellphone: "1234567890",
  address: "Calle 123",
  role: "USER"
}).then(result => {
  console.log('Usuario creado:', result);
}).catch(error => {
  console.error('Error:', error);
});

// Probar obtener usuarios
tester.getUsers().then(result => {
  console.log('Usuarios:', result);
}).catch(error => {
  console.error('Error:', error);
});
```

## Comandos cURL para Pruebas

```bash
# Obtener todos los usuarios
curl -X POST http://localhost:3000/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "query { users { id name email role createdAt } }"
  }'

# Crear usuario
curl -X POST http://localhost:3000/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "mutation CreateUser($input: CreateUserInput!) { createUser(createUserInput: $input) { id name email role } }",
    "variables": {
      "input": {
        "name": "Test User",
        "email": "test@example.com",
        "password": "password123",
        "cellphone": "1234567890",
        "address": "Test Address",
        "role": "USER"
      }
    }
  }'

# Obtener usuario por ID (reemplaza "USER_ID" con un ID real)
curl -X POST http://localhost:3000/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "query GetUser($id: ID!) { user(id: $id) { id name email cellphone address role createdAt } }",
    "variables": {
      "id": "USER_ID"
    }
  }'

# Actualizar usuario (reemplaza "USER_ID" con un ID real)
curl -X POST http://localhost:3000/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "mutation UpdateUser($id: ID!, $input: UpdateUserInput!) { updateUser(id: $id, updateUserInput: $input) { id name email role } }",
    "variables": {
      "id": "USER_ID",
      "input": {
        "name": "Updated Name",
        "cellphone": "9876543210"
      }
    }
  }'

# Eliminar usuario (reemplaza "USER_ID" con un ID real)
curl -X POST http://localhost:3000/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "mutation DeleteUser($id: ID!) { removeUser(id: $id) }",
    "variables": {
      "id": "USER_ID"
    }
  }'
```

## Consejos para Debugging

1. **Usar GraphQL Playground**: Ve a `http://localhost:3000/graphql` para probar queries interactivamente
2. **Verificar Network Tab**: En las herramientas de desarrollador, revisa las peticiones HTTP
3. **Manejo de errores**: Siempre maneja los errores de GraphQL y de red
4. **Logging**: Usa console.log para verificar los datos que recibes

## Próximos Pasos

1. Implementar autenticación JWT en las queries/mutations
2. Agregar subscriptions para actualizaciones en tiempo real
3. Implementar paginación avanzada
4. Agregar validación del lado del cliente
5. Crear tests unitarios para los componentes

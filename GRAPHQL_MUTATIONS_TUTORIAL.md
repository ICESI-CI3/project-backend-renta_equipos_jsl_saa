# Ejemplos Prácticos de Mutations - Paso a Paso

## 🚀 Tutorial Práctico: Cómo Usar GraphQL Mutations

### Paso 1: Acceder a GraphQL Playground

1. Asegúrate de que tu servidor esté corriendo: `npm run start:dev`
2. Abre tu navegador y ve a: `http://localhost:3000/graphql`
3. Deberías ver la interfaz de GraphQL Playground

### Paso 2: Tu Primera Mutation - Crear Usuario

**Copia y pega este código en el panel izquierdo:**

```graphql
mutation {
  createUser(createUserInput: {
    name: "Test User"
    email: "test@example.com"
    password: "Password123"
    cellphone: "3001234567"
    address: "Calle de Prueba 123"
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

**Haz click en el botón ▶️ y deberías ver algo como:**

```json
{
  "data": {
    "createUser": {
      "id": "675a123b456c789d012e3456",
      "name": "Test User",
      "email": "test@example.com",
      "cellphone": "3001234567",
      "address": "Calle de Prueba 123",
      "role": "user",
      "createdAt": "2024-12-11T10:30:00.000Z"
    }
  }
}
```

### Paso 3: Mutation con Variables (Más Profesional)

**En el panel de Query:**
```graphql
mutation CreateUser($input: CreateUserInput!) {
  createUser(createUserInput: $input) {
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

**En el panel de Variables (abajo):**
```json
{
  "input": {
    "name": "Juan Pérez",
    "email": "juan.perez@gmail.com",
    "password": "MiPassword123",
    "cellphone": "3009876543",
    "address": "Carrera 15 #20-30, Bogotá",
    "role": "admin"
  }
}
```

### Paso 4: Actualizar Usuario

**Primero, obtén el ID de un usuario existente:**
```graphql
query {
  users {
    id
    name
    email
  }
}
```

**Luego actualiza usando el ID:**
```graphql
mutation {
  updateUser(
    id: "675a123b456c789d012e3456"
    updateUserInput: {
      name: "Juan Carlos Pérez"
      cellphone: "3001112233"
      address: "Nueva dirección 456"
    }
  ) {
    id
    name
    email
    cellphone
    address
    updatedAt
  }
}
```

### Paso 5: Eliminar Usuario

```graphql
mutation {
  removeUser(id: "675a123b456c789d012e3456")
}
```

**Respuesta esperada:**
```json
{
  "data": {
    "removeUser": true
  }
}
```

## 🎯 Ejemplos Específicos para tu Aplicación

### Caso 1: Registrar un Cliente

```graphql
mutation RegisterClient {
  createUser(createUserInput: {
    name: "María González"
    email: "maria.gonzalez@outlook.com"
    password: "ClientPass123"
    cellphone: "3201234567"
    address: "Calle 45 #12-34, Medellín"
    role: "client"
  }) {
    id
    name
    email
    role
    createdAt
  }
}
```

### Caso 2: Crear un Administrador

```graphql
mutation CreateAdmin {
  createUser(createUserInput: {
    name: "Carlos Rodríguez"
    email: "admin@rentaequipos.com"
    password: "AdminSecure123"
    cellphone: "3151234567"
    address: "Oficina Central, Cali"
    role: "admin"
  }) {
    id
    name
    email
    role
    createdAt
  }
}
```

### Caso 3: Actualizar Información de Cliente

```graphql
mutation UpdateClientInfo {
  updateUser(
    id: "675a123b456c789d012e3456"
    updateUserInput: {
      cellphone: "3209876543"
      address: "Nueva Calle 789 #01-23, Barranquilla"
    }
  ) {
    id
    name
    email
    cellphone
    address
    updatedAt
  }
}
```

## 🌐 Implementación en Frontend

### Ejemplo con React y Fetch

```jsx
import React, { useState } from 'react';

const CreateUserForm = () => {
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    password: '',
    cellphone: '',
    address: '',
    role: 'user'
  });

  const [loading, setLoading] = useState(false);

  const createUser = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
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
                createdAt
              }
            }
          `,
          variables: {
            input: userData
          }
        })
      });

      const result = await response.json();
      
      if (result.errors) {
        console.error('Errores:', result.errors);
        alert('Error: ' + result.errors[0].message);
      } else {
        console.log('Usuario creado:', result.data.createUser);
        alert('Usuario creado exitosamente!');
        // Limpiar formulario
        setUserData({
          name: '',
          email: '',
          password: '',
          cellphone: '',
          address: '',
          role: 'user'
        });
      }
    } catch (error) {
      console.error('Error de red:', error);
      alert('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={createUser}>
      <input
        type="text"
        placeholder="Nombre"
        value={userData.name}
        onChange={(e) => setUserData({...userData, name: e.target.value})}
        required
      />
      <input
        type="email"
        placeholder="Email"
        value={userData.email}
        onChange={(e) => setUserData({...userData, email: e.target.value})}
        required
      />
      <input
        type="password"
        placeholder="Contraseña"
        value={userData.password}
        onChange={(e) => setUserData({...userData, password: e.target.value})}
        required
      />
      <input
        type="tel"
        placeholder="Celular (10 dígitos)"
        value={userData.cellphone}
        onChange={(e) => setUserData({...userData, cellphone: e.target.value})}
        required
      />
      <input
        type="text"
        placeholder="Dirección"
        value={userData.address}
        onChange={(e) => setUserData({...userData, address: e.target.value})}
        required
      />
      <select
        value={userData.role}
        onChange={(e) => setUserData({...userData, role: e.target.value})}
      >
        <option value="user">Usuario</option>
        <option value="admin">Administrador</option>
        <option value="client">Cliente</option>
      </select>
      
      <button type="submit" disabled={loading}>
        {loading ? 'Creando...' : 'Crear Usuario'}
      </button>
    </form>
  );
};

export default CreateUserForm;
```

### Ejemplo con Apollo Client (Más Avanzado)

```jsx
import { useMutation, gql } from '@apollo/client';

const CREATE_USER = gql`
  mutation CreateUser($input: CreateUserInput!) {
    createUser(createUserInput: $input) {
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

const CreateUserComponent = () => {
  const [createUser, { data, loading, error }] = useMutation(CREATE_USER);

  const handleSubmit = async (formData) => {
    try {
      const result = await createUser({
        variables: {
          input: formData
        }
      });
      console.log('Usuario creado:', result.data.createUser);
    } catch (err) {
      console.error('Error:', err);
    }
  };

  if (loading) return <p>Creando usuario...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      {/* Tu formulario aquí */}
      {data && (
        <div>
          <h3>Usuario creado exitosamente:</h3>
          <p>ID: {data.createUser.id}</p>
          <p>Nombre: {data.createUser.name}</p>
          <p>Email: {data.createUser.email}</p>
        </div>
      )}
    </div>
  );
};
```

## 🔧 Manejo de Errores Comunes

### Error: Email duplicado
```graphql
mutation {
  createUser(createUserInput: {
    name: "Test"
    email: "test@example.com"  # Email que ya existe
    password: "Password123"
    cellphone: "3001234567"
    address: "Test Address"
  }) {
    id
    name
  }
}
```

**Respuesta de error:**
```json
{
  "errors": [
    {
      "message": "El email ya está registrado",
      "extensions": {
        "code": "BAD_USER_INPUT"
      }
    }
  ]
}
```

### Error: Contraseña débil
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

### Error: Celular inválido
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

## 📝 Checklist de Pruebas

- [ ] ✅ Crear usuario con datos válidos
- [ ] ✅ Crear usuario con email duplicado (debe fallar)
- [ ] ✅ Crear usuario con contraseña débil (debe fallar)
- [ ] ✅ Crear usuario con celular inválido (debe fallar)
- [ ] ✅ Actualizar usuario existente
- [ ] ✅ Actualizar usuario con ID inexistente (debe fallar)
- [ ] ✅ Eliminar usuario existente
- [ ] ✅ Eliminar usuario con ID inexistente (debe fallar)

## 🎉 ¡Felicitaciones!

Ahora tienes todas las herramientas para trabajar con GraphQL mutations. Puedes:

1. **Crear usuarios** con validación completa
2. **Actualizar información** de usuarios existentes
3. **Eliminar usuarios** cuando sea necesario
4. **Manejar errores** apropiadamente
5. **Integrar con tu frontend** usando fetch o Apollo Client

¡Prueba los ejemplos y experimenta con diferentes combinaciones!

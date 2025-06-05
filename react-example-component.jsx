import React, { useState } from 'react';
import { useQuery, useMutation, useLazyQuery } from '@apollo/client';
import { gql } from '@apollo/client';

// GraphQL Queries y Mutations
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

const DELETE_USER = gql`
  mutation RemoveUser($id: ID!) {
    removeUser(id: $id)
  }
`;

// Componente principal
function UsersManagement() {
  const [selectedUserId, setSelectedUserId] = useState('');
  const [searchEmail, setSearchEmail] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  // Queries
  const { loading: usersLoading, error: usersError, data: usersData, refetch: refetchUsers } = useQuery(GET_USERS, {
    variables: {
      pagination: {
        limit: 10,
        offset: 0
      }
    }
  });

  const [searchUserByEmail, { loading: searchLoading, data: searchData, error: searchError }] = useLazyQuery(GET_USER_BY_EMAIL);

  // Mutations
  const [createUser, { loading: createLoading }] = useMutation(CREATE_USER, {
    onCompleted: () => {
      setShowCreateForm(false);
      refetchUsers();
      alert('Usuario creado exitosamente');
    },
    onError: (error) => {
      alert(`Error al crear usuario: ${error.message}`);
    }
  });

  const [updateUser, { loading: updateLoading }] = useMutation(UPDATE_USER, {
    onCompleted: () => {
      setEditingUser(null);
      refetchUsers();
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

  // Handlers
  const handleSearch = () => {
    if (searchEmail) {
      searchUserByEmail({ variables: { email: searchEmail } });
    }
  };

  const handleCreateUser = async (formData) => {
    await createUser({
      variables: {
        createUserInput: formData
      }
    });
  };

  const handleUpdateUser = async (formData) => {
    await updateUser({
      variables: {
        id: editingUser.id,
        updateUserInput: formData
      }
    });
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('¿Estás seguro de eliminar este usuario?')) {
      await deleteUser({
        variables: { id: userId }
      });
    }
  };

  if (usersLoading) return <div>Cargando usuarios...</div>;
  if (usersError) return <div>Error: {usersError.message}</div>;

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>Gestión de Usuarios - GraphQL</h1>

      {/* Búsqueda por email */}
      <div style={{ marginBottom: '20px', padding: '15px', border: '1px solid #ddd', borderRadius: '5px' }}>
        <h3>Buscar usuario por email</h3>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <input
            type="email"
            value={searchEmail}
            onChange={(e) => setSearchEmail(e.target.value)}
            placeholder="Ingresa el email"
            style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc', minWidth: '250px' }}
          />
          <button 
            onClick={handleSearch} 
            disabled={searchLoading || !searchEmail}
            style={{ padding: '8px 16px', borderRadius: '4px', border: 'none', backgroundColor: '#007bff', color: 'white', cursor: 'pointer' }}
          >
            {searchLoading ? 'Buscando...' : 'Buscar'}
          </button>
        </div>
        
        {searchError && <div style={{ color: 'red', marginTop: '10px' }}>Error: {searchError.message}</div>}
        {searchData?.userByEmail && (
          <div style={{ marginTop: '10px', padding: '10px', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
            <strong>Usuario encontrado:</strong> {searchData.userByEmail.name} ({searchData.userByEmail.email})
          </div>
        )}
      </div>

      {/* Botón crear usuario */}
      <div style={{ marginBottom: '20px' }}>
        <button
          onClick={() => setShowCreateForm(true)}
          style={{ padding: '10px 20px', borderRadius: '4px', border: 'none', backgroundColor: '#28a745', color: 'white', cursor: 'pointer' }}
        >
          Crear Nuevo Usuario
        </button>
      </div>

      {/* Lista de usuarios */}
      <div>
        <h3>Lista de Usuarios</h3>
        {usersData?.users?.length === 0 ? (
          <p>No hay usuarios registrados</p>
        ) : (
          <div style={{ display: 'grid', gap: '15px' }}>
            {usersData?.users?.map((user) => (
              <div key={user.id} style={{ border: '1px solid #ddd', borderRadius: '5px', padding: '15px', backgroundColor: '#f8f9fa' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <h4 style={{ margin: '0 0 10px 0' }}>{user.name}</h4>
                    <p style={{ margin: '5px 0' }}><strong>Email:</strong> {user.email}</p>
                    <p style={{ margin: '5px 0' }}><strong>Teléfono:</strong> {user.cellphone}</p>
                    <p style={{ margin: '5px 0' }}><strong>Dirección:</strong> {user.address}</p>
                    <p style={{ margin: '5px 0' }}><strong>Rol:</strong> {user.role}</p>
                  </div>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                      onClick={() => setEditingUser(user)}
                      style={{ padding: '5px 10px', borderRadius: '4px', border: 'none', backgroundColor: '#17a2b8', color: 'white', cursor: 'pointer' }}
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDeleteUser(user.id)}
                      disabled={deleteLoading}
                      style={{ padding: '5px 10px', borderRadius: '4px', border: 'none', backgroundColor: '#dc3545', color: 'white', cursor: 'pointer' }}
                    >
                      {deleteLoading ? 'Eliminando...' : 'Eliminar'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal para crear usuario */}
      {showCreateForm && (
        <UserFormModal
          title="Crear Usuario"
          onSubmit={handleCreateUser}
          onCancel={() => setShowCreateForm(false)}
          loading={createLoading}
        />
      )}

      {/* Modal para editar usuario */}
      {editingUser && (
        <UserFormModal
          title="Editar Usuario"
          initialData={editingUser}
          onSubmit={handleUpdateUser}
          onCancel={() => setEditingUser(null)}
          loading={updateLoading}
          isEdit={true}
        />
      )}
    </div>
  );
}

// Componente del formulario modal
function UserFormModal({ title, initialData = {}, onSubmit, onCancel, loading, isEdit = false }) {
  const [formData, setFormData] = useState({
    name: initialData.name || '',
    email: initialData.email || '',
    password: '',
    cellphone: initialData.cellphone || '',
    address: initialData.address || '',
    role: initialData.role || 'user'
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validaciones básicas
    if (!formData.name || !formData.email || !formData.cellphone || !formData.address) {
      alert('Por favor completa todos los campos obligatorios');
      return;
    }

    if (!isEdit && !formData.password) {
      alert('La contraseña es obligatoria para crear un usuario');
      return;
    }

    // Preparar datos para enviar
    const dataToSend = { ...formData };
    if (isEdit && !dataToSend.password) {
      delete dataToSend.password; // No enviar password vacío en updates
    }

    onSubmit(dataToSend);
  };

  return (
    <div style={{ 
      position: 'fixed', 
      top: 0, 
      left: 0, 
      width: '100%', 
      height: '100%', 
      backgroundColor: 'rgba(0,0,0,0.5)', 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center',
      zIndex: 1000
    }}>
      <div style={{ 
        backgroundColor: 'white', 
        padding: '30px', 
        borderRadius: '8px', 
        width: '90%', 
        maxWidth: '500px',
        maxHeight: '90%',
        overflow: 'auto'
      }}>
        <h3>{title}</h3>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Nombre *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Email *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Contraseña {!isEdit && '*'}
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required={!isEdit}
              placeholder={isEdit ? 'Dejar vacío para mantener la actual' : ''}
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Teléfono *
            </label>
            <input
              type="tel"
              name="cellphone"
              value={formData.cellphone}
              onChange={handleChange}
              required
              pattern="[0-9]{10}"
              title="Debe tener 10 dígitos"
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Dirección *
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Rol
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
            >
              <option value="user">Usuario</option>
              <option value="admin">Administrador</option>
              <option value="superuser">Super Usuario</option>
            </select>
          </div>

          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
            <button
              type="button"
              onClick={onCancel}
              style={{ padding: '10px 20px', borderRadius: '4px', border: '1px solid #ccc', backgroundColor: '#f8f9fa', cursor: 'pointer' }}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{ padding: '10px 20px', borderRadius: '4px', border: 'none', backgroundColor: '#007bff', color: 'white', cursor: 'pointer' }}
            >
              {loading ? 'Guardando...' : (isEdit ? 'Actualizar' : 'Crear')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UsersManagement;

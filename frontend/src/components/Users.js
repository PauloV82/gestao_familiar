import React, { useEffect, useState } from 'react';
import api from '../api/axios'; 

function Users() {
  const [users, setUsers] = useState([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  // Lidar com envio de formulário
  const handleSubmit = (e) => {
    e.preventDefault();
    const userData = { name, email, password };

    api.post('/users', userData)
      .then(response => {
        setUsers([...users, response.data]);
        setName('');
        setEmail('');
        setPassword('');
      })
  };

  return (
    <div>
      <h1>Usuários</h1>
      <ul>
        {users.map(user => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>

      <h2>Cadastrar Novo Usuário</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nome:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Senha:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit">Cadastrar</button>
      </form>
    </div>
  );
}

export default Users;

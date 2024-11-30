import React, { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [users, setUsers] = useState([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  // Função para obter a lista de usuários
  useEffect(() => {
    axios.get('http://localhost:8000/api/users')
      .then(response => {
        setUsers(response.data);
      })
      .catch(error => {
        console.error('Erro ao buscar usuários:', error);
      });
  }, []);

  // Função para lidar com o envio do formulário
  const handleSubmit = (e) => {
    e.preventDefault();
    const userData = {
      name,
      email,
      password
    };

    axios.post('http://localhost:8000/api/users', userData)
      .then(response => {
        // Atualiza a lista de usuários após o cadastro
        setUsers([...users, response.data]);
        // Limpa os campos do formulário
        setName('');
        setEmail('');
        setPassword('');
      })
      .catch(error => {
        setError('Erro ao cadastrar usuário.');
        console.error('Erro ao cadastrar usuário:', error);
      });
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

export default App;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import '../App.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); // Inicializa o hook para navegação



  const handleSubmit = async (e) => {
    e.preventDefault(); 

    try {
      const response = await fetch('http://localhost:8000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        
      });

      if (response.ok) {
        const data = await response.json();
        // Salva o token em localStorage
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('userId', data.user.id);

        // Redireciona para o dashboard
        navigate('/dashboard');
      } else {
        const errorData = await response.json();
        alert(`Erro: ${errorData.message}`);
      }
    } catch (error) {
      alert('Ocorreu um erro. Tente novamente mais tarde.');
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          className="form-control mb-3"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          className="form-control mb-3"
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" className="btn btn-primary">Entrar</button>
      </form>
    </div>
  );
};

export default Login;

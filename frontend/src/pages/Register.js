import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';

const Register = () => {
  const [formsRegister, setFormsRegister] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormsRegister({ ...formsRegister, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formsRegister.password.length < 6) {
      alert('A senha deve ter no mínimo 6 caracteres.');
      return;
    }

    if (formsRegister.password !== formsRegister.confirmPassword) {
      alert('As senhas não coincidem!');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:8000/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formsRegister.name,
          email: formsRegister.email,
          password: formsRegister.password,
        }),
      });

      setIsLoading(false);

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('authToken', data.token); // Salva o token
        alert('Registro bem-sucedido!');
        navigate('/');
        alert('Boa, agora faça seu login');
      } else if (response.status === 409) {
        // Caso o e-mail já esteja registrado
        alert('Erro: O e-mail já está registrado. Por favor, use outro e-mail.');
      } else {
        const errorData = await response.json();
        alert(`Erro: ${errorData.message}`);
      }
    } catch (error) {
      setIsLoading(false);
      alert('Ocorreu um erro. Tente novamente mais tarde.');
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Nome"
          value={formsRegister.name}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formsRegister.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Senha (mín. 6 caracteres)"
          value={formsRegister.password}
          onChange={handleChange}
          required
          minLength={6}
        />
        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirmação de Senha"
          value={formsRegister.confirmPassword}
          onChange={handleChange}
          required
        />
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Registrando...' : 'Registrar'}
        </button>
      </form>
    </div>
  );
};

export default Register;

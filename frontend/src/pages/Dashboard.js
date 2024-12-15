import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ModalDashboard from '../components/ModalDashboard';
import '../StyleDashboard.css';
import Home from '../components/Home';
import Relatorio from '../components/Relatorio';
import Tags from '../components/Tags';
import axios from 'axios';

function Dashboard() {
  const [activeModal, setActiveModal] = useState('home');
  const [userData, setUserData] = useState(null);
  const [receita, setReceita] = useState(null);
  const [nome, setNome] = useState(null);
  const [loading, setLoading] = useState(true);
  const userId = localStorage.getItem('userId');
  const [novoLimite, setNovoLimite] = useState('');
  const [openModalR, setOpenModalR] = useState(false);

  const navigate = useNavigate(); 


  const openModal = (modalId) => setActiveModal(activeModal === modalId ? null : modalId);
  
  const fetchUserData = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/user', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
      });
      setUserData(response.data); // Armazena os dados do usuário no estado
      setLoading(false);
    } catch (error) {
      alert('Erro ao carregar dados do usuário. Verifique sua conexão.');
    }
  };
  
  

  useEffect(() => {
    if (activeModal === 'perfil') {
      fetchUserData();
    }
  }, [activeModal]);

  const handleLogout = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:8000/api/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('authToken')}`, // Incluindo token no header
        },
      });

      if (response.ok) {
        localStorage.removeItem('authToken'); 
        navigate('/'); 
      } else {
        const errorData = await response.json();
        alert(`Erro no logout: ${errorData.message}`);
      }
    } catch (error) {
      alert('Ocorreu um erro ao fazer logout. Tente novamente mais tarde.');
    }
  };
  useEffect(() => {
    async function fetchChartData() {
      try {
        //Só da certo para o primeiro usuario
        const response = await fetch(`http://localhost:8000/api/receitas/${userId}`);
        const data = await response.json();

        // Atualiza os estados com os dados obtidos
        const somaReceita = data.saldo;
        setReceita(somaReceita);
      } catch (error) {
        console.error('Erro ao buscar dados do gráfico:', error);
      }
    }

    fetchChartData();
  }, [userId]);
  async function handleAddLimite(event) {
    event.preventDefault();

    try {
      const response = await fetch(`http://localhost:8000/api/despesas/${userId}/store`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          descricao: 'Limite',
          gasto: 0,
          receita: 0,
          limite: parseFloat(novoLimite),
          data: new Date().toISOString().split('T')[0],
        }),
      });

      if (!response.ok) {
        throw new Error('Erro ao adicionar receita.');
      }

      await response.json();
      alert('Receita adicionada com sucesso!');
      window.location.reload();
      setOpenModalR(false);
      setNovoLimite('');
    } catch (error) {
      alert('Erro: ' + error.message);
    }
  }

  useEffect(() => {
    async function buscarNome() {
      try {
        const response = await fetch(`http://localhost:8000/api/nome/${userId}`);
        if (!response.ok) {
          throw new Error('Erro ao buscar o nome');
        }

        const data = await response.json();

        // Atualiza o estado com o nome do usuário
        setNome(data.data.name);
      } catch (error) {
        console.error('Erro ao buscar o nome do usuário:', error);
      }
    }

    buscarNome();
  }, [userId]); 

  return (
    <div>
      <nav className="SaidBar">
        <div className="Itens">
          <ul>
            <li>
              <div className="Home">
                <Link to="/">
                  <img src="icon.png" alt="Home Icon" />
                </Link>
              </div>
            </li>
            <li>
              <div>
                <i className="fa-solid fa-house" onClick={() => openModal('home')}></i>
              </div>
              <ModalDashboard title=""isOpen={activeModal === 'home'}setModalOpen={() => openModal('home')}>
                <Home userId={userId} receita={receita} nome={nome}/>
                
              </ModalDashboard>
            </li>
            <li>
              <div>
                <i className="fa-solid fa-chart-line" onClick={() => openModal('meta')}></i>
              </div>
              <ModalDashboard title="" isOpen={activeModal === 'meta'} setModalOpen={() => openModal('meta')} >
                <div className="Body">
                  <div className="Account">
                    <h1>Meta de gastos</h1>
                    <div className="ContentMeta">
                      <form onSubmit={handleAddLimite}>
                        <input className="form-control mb-3" type="text" placeholder="Valor" value={novoLimite}
                          onChange={(e) => setNovoLimite(e.target.value)} required />
                        <button type="submit" className="btn">
                          Adicionar
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              </ModalDashboard>
            </li>
            <li>
              <div>
                <i className="fa-solid fa-tags" onClick={() => openModal('categorias')}></i>
              </div>
              <ModalDashboard title="" isOpen={activeModal === 'categorias'} setModalOpen={() => openModal('categorias')} >
                <Tags userId={userId} />
              </ModalDashboard>
            </li>
            <li>
              <div>
                <i className="fa-solid fa-file" onClick={() => openModal('relatorios')}></i>
              </div>
              <ModalDashboard title="" isOpen={activeModal === 'relatorios'} setModalOpen={() => openModal('relatorios')} >
                <Relatorio userId={userId} />
              </ModalDashboard>
            </li>
            <li>
              <div>
                <i className="fa-regular fa-circle-question" onClick={() => openModal('ajuda')}></i>
              </div>
              <ModalDashboard title="" isOpen={activeModal === 'ajuda'} setModalOpen={() => openModal('ajuda')}>
                <footer>
                  <h1>CONTATOS</h1>
                  <h4 className="mt-5">ENTRE EM CONTATO COM O NOSSO SUPORTE</h4>
                  <div className="Barr progress mx-5 px-5">
                    <div className="barr mx-5"></div>
                  </div>
                  <div className="Infos">
                    <div> <i className="fa-brands fa-instagram"></i> @control_coins </div>
                    <div> <i className="fa-regular fa-envelope"></i> controlcoins@contact.com </div>
                    <div> <i className="fa-solid fa-phone"></i> 8024-8425 </div>
                  </div>
                </footer>
              </ModalDashboard>
            </li>
            <li>
              <div id='LogoutBnt'>
                <i onClick={handleLogout} class="fa-solid fa-right-from-bracket"></i>
              </div>
            </li>
          </ul>
        </div>
      </nav>
      <script
        src="https://kit.fontawesome.com/ca5dba5f80.js"
        crossOrigin="anonymous"
      ></script>
    </div>
  );
}

export default Dashboard;
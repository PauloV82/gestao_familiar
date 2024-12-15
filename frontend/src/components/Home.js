import React, { useState, useEffect } from 'react';
import Chart1 from './Chart1';
import Chart2 from './Chart2';
import Chart3 from './Chart3';
import ModalHome from './ModalHome';

export default function Home({ userId, receita, nome }) {
  const id = userId;

  // Estados
  const [novaDespesa, setNovaDespesa] = useState('');
  const [novaReceita, setNovaReceita] = useState('');
  const [descricao, setDescricao] = useState('');
  const [descricaoReceita, setDescricaoReceita] = useState('');
  const [categoria, setCategoria] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [openModalR, setOpenModalR] = useState(false);
  const [despesas, setDespesas] = useState([]);
  const [categorias, setCategorias] = useState([]); // Novo estado para categorias

  // Carregar despesas agrupadas por categoria
  useEffect(() => {
    async function fetchCategorias() {
      try {
        const response = await fetch(`http://localhost:8000/api/despesas/${id}/showCategorias`);
        const data = await response.json();
        const categorias = data.map((item) => item.categoria); // Pega a categoria de cada item
        setCategorias(categorias); // Atualiza o estado com as categorias
      } catch (error) {
        console.error('Erro ao carregar categorias:', error);
      }
    }

    fetchCategorias();
  }, [id]);

  // Carregar categorias predefinidas ou do backend
  useEffect(() => {
    async function fetchCategorias() {
      try {
        const response = await fetch(`http://localhost:8000/api/despesas/${id}/showCategorias`);
        const data = await response.json();
        setCategorias(data.map(categoria => categoria.categoria)); // Atualiza as categorias
      } catch (error) {
        console.error('Erro ao carregar categorias:', error);
      }
    }
    fetchCategorias();
  }, [id]);

  // Função para adicionar despesa
  async function handleAddDespesa(event) {
    event.preventDefault();
    try {
      const response = await fetch(`http://localhost:8000/api/despesas/${id}/store`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          descricao,
          gasto: parseFloat(novaDespesa),
          receita: 0,
          data: new Date().toISOString().split('T')[0],
          categoria,
        }),
      });

      if (!response.ok) throw new Error('Erro ao adicionar despesa.');

      alert('Despesa adicionada com sucesso!');
      const data = await response.json(); // Obter a nova despesa após adição
      setDespesas([...despesas, data]); // Adicionar a nova despesa ao estado
      window.location.reload();
    } catch (error) {
      alert('Erro: ' + error.message);
    } finally {
      setOpenModal(false);
      setNovaDespesa('');
      setDescricao('');
      setCategoria('');
    }
    
  }

  // Função para adicionar receita
  async function handleAddReceita(event) {
    event.preventDefault();
    try {
      const response = await fetch(`http://localhost:8000/api/despesas/${id}/store`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          descricao: descricaoReceita,
          gasto: 0,
          receita: parseFloat(novaReceita),
          data: new Date().toISOString().split('T')[0],
        }),
      });

      if (!response.ok) throw new Error('Erro ao adicionar receita.');

      alert('Receita adicionada com sucesso!');
      const data = await response.json(); // Obter a nova receita após adição
      setDespesas([...despesas, data]); // Adicionar a nova receita ao estado
      window.location.reload();
    } catch (error) {
      alert('Erro: ' + error.message);
    } finally {
      setOpenModalR(false);
      setNovaReceita('');
      setDescricaoReceita('');
    }
  }

  return (
    <div className="Body">
      <div className="BodyCenter container">
        <h1 id="userName">Olá, {nome}</h1>
        <div className="TopSection row">
          <div className="LeftSide col-4">
            <div className="Account">
              <h1>Conta</h1>
              <div className="ContentAcc">
                <h2>Saldo:</h2>
                <h1 id="Income">R$ {receita} </h1>
              </div>
            </div>
            <div className="Register">
              <div className="int">
                <h4>DESPESA</h4>
                <button id="negb" onClick={() => setOpenModal(true)}>
                  <i id="neg" className="fa-solid fa-circle-plus"></i>
                </button>
              </div>
              <div className="line">.</div>
              <div className="int">
                <h4>RECEITA</h4>
                <button id="posb" onClick={() => setOpenModalR(true)}>
                  <i id="pos" className="fa-solid fa-circle-plus"></i>
                </button>
              </div>
            </div>
          </div>
          <div className="RightSide col-8">
            <div className="expense">
              <h1>Despesas</h1>
              <div className="Content">
                <Chart1 id={id} />
              </div>
            </div>
          </div>
        </div>
        <div className="BottomSection row">
          <div className="TagChart col-6">
            <h1>Despesas por categoria</h1>
            <div className="Content">
              <Chart2 id={id} />
            </div>
          </div>
          <div className="VsChart col-6">
            <h1>Comparativo</h1>
            <div className="Content">
              <Chart3 id={id} />
            </div>
          </div>
        </div>
      </div>

      {/* Modal para adicionar despesa */}
      {openModal && (
        <ModalHome title="Nova Despesa" isOpen={openModal} setModalOpen={() => setOpenModal(false)}>
          <form onSubmit={handleAddDespesa}>
            <input
              className="form-control mb-3"
              type="number"
              placeholder="Valor"
              value={novaDespesa}
              onChange={(e) => setNovaDespesa(e.target.value)}
              required
            />
            <input
              className="form-control mb-3"
              type="text"
              placeholder="Descrição"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              required
            />
           <select
              id="categoria"
              name="categoria"
              className="form-control mb-3"
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
            >
              <option value="" disabled>
                Categoria
              </option> 
              <option value="Alimentação">Alimentação</option>
              <option value="Transporte">Transporte</option>
              <option value="Saúde">Saúde</option>
              <option value="Lazer">Lazer</option>
              <option value="Educação">Educação</option>
              {categorias.map((cat, index) => (
                <option key={index} value={cat}>
                  {cat}
                </option>
              ))}
             
            </select>
            <button type="submit" className="btn btn-primary">
              Adicionar
            </button>
          </form>
        </ModalHome>
      )}

      {/* Modal para adicionar receita */}
      {openModalR && (
        <ModalHome title="Nova Receita" isOpen={openModalR} setModalOpen={() => setOpenModalR(false)}>
          <form onSubmit={handleAddReceita}>
            <input
              className="form-control mb-3"
              type="number"
              placeholder="Valor"
              value={novaReceita}
              onChange={(e) => setNovaReceita(e.target.value)}
              required
            />
            <input
              className="form-control mb-3"
              type="text"
              placeholder="Descrição"
              value={descricaoReceita}
              onChange={(e) => setDescricaoReceita(e.target.value)}
              required
            />
            <button type="submit" className="btn btn-primary">
              Adicionar
            </button>
          </form>
        </ModalHome>
      )}
    </div>
  );
}

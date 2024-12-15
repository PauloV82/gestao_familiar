import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Tags({ userId }) {
  const [despesas, setDespesas] = useState([]); // Inicializando com array vazio
  const [categoria, setCategoria] = useState('');
  const [openModalR, setOpenModalR] = useState(false); // Estado para controlar a abertura do modal
  const [dados, setDados] = useState([]); // Estado para armazenar os dados das despesas
  const [loading, setLoading] = useState(true); // Estado para exibição de carregamento
  const [erro, setErro] = useState(null); // Estado para exibição de erros

  useEffect(() => {
    // Função para buscar dados da API
    const buscarDados = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/categorias/${userId}`);
        setDados(response.data); // Atualiza o estado com as categorias obtidas da API
        setLoading(false);
      } catch (error) {
        setErro('Erro ao carregar os dados.');
        setLoading(false);
      }
    };

    buscarDados();
  }, [userId]);

  async function handleAddCategoria(event) {
    event.preventDefault();
    try {
      const response = await fetch(`http://localhost:8000/api/despesas/${userId}/store`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          descricao: 'Categoria', // Descrição fixa para a categoria
          gasto: 0, // Gasto inicial 0
          limite: 0, // Limite inicial 0
          receita: 0, // Receita inicial 0
          categoria: categoria, // Categoria informada pelo usuário
          data: new Date().toISOString().split('T')[0], // Data atual
        }),
      });

      if (!response.ok) throw new Error('Erro ao adicionar categoria.');

      const data = await response.json(); // Obter a nova categoria após adição
      setDespesas([...despesas, data]); // Adicionar a nova categoria ao estado de despesas
      setDados([...dados, { categoria: categoria }]); // Atualizar a lista de categorias com a nova categoria

      alert('Categoria adicionada com sucesso!');
      window.location.reload();
    } catch (error) {
      alert('Erro: ' + error.message);
    } finally {
      setCategoria(''); // Limpar o campo de input após adicionar a categoria
    }
  }

  const totalGasto = dados.reduce((acc, item) => acc + item.total_gasto, 0);

  if (loading) {
    return <p>Carregando dados...</p>;
  }

  if (erro) {
    return <p>{erro}</p>;
  }

  return (
    <div className="Body">
      <div className="BodyCenter container">
        <div className="TopSection row">
          <div className="LeftSide col-5">
            <div className="Account">
              <h1>Categorias</h1>
              <div id="ContentList" className="table-container">
                <ul className="TagList">
                  {dados.map((item, index) => {
                    const percentual = ((item.total_gasto / totalGasto) * 100).toFixed(2);
                    return (
                      <li key={index} className="list-group-item d-flex justify-content-between">
                        <span>{item.categoria}</span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </div>
          <div className="RigthSide col-2"></div>
          <div className="RigthSide col-5">
            <div className="expense">
              <h1>Nova Categoria</h1>
              <div className="ContentMeta">
                <form onSubmit={handleAddCategoria}>
                  <input
                    className="form-control mb-3"
                    type="text"
                    placeholder="Categoria"
                    value={categoria}
                    onChange={(e) => setCategoria(e.target.value)} // Atualiza o estado com o valor do input
                    required
                  />
                  <button type="submit" className="btn">
                    Adicionar
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

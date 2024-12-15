import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Relatorio({ userId }) {
  const [dados, setDados] = useState([]); // Estado para armazenar os dados das despesas
  const [loading, setLoading] = useState(true); // Estado para exibição de carregamento
  const [erro, setErro] = useState(null); // Estado para exibição de erros

  useEffect(() => {
    // Função para buscar dados da API
    const buscarDados = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/categorias/${userId}`);
        setDados(response.data);
        setLoading(false);
      } catch (error) {
        setErro('Erro ao carregar os dados.');
        setLoading(false);
      }
    };

    buscarDados();
  }, [userId]);

  const gerarPDF = () => {
    const url = `http://localhost:8000/api/gerar-pdf/${userId}`;  // Incluindo o userId na URL
  
    fetch(url, {
      method: 'GET',  // Usando o método GET

      headers: {
        'Content-Type': 'application/json',  // Envia o conteúdo como JSON
      }
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Erro ao gerar o PDF');
      }
      return response.blob();  // Retorna o PDF como blob
    })
    .then(blob => {
      // Cria um link para fazer o download
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);  // Cria um link com a URL do blob
      link.download = `relatorio_despesas-${userId}.pdf`;  // Define o nome do arquivo gerado
      link.click();  // Clica no link para iniciar o download
    })
    .catch(error => {
      console.error('Erro:', error);
    });
  };
  
  // Calcula o total de gastos
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
        <div className="Cct">
          <h1>Relatórios</h1>
          <div className="ContentRlt">
            <div className="table-container">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th scope="col">Categoria</th>
                    <th scope="col">Valor percentual</th>
                    <th scope="col">Valor real</th>
                  </tr>
                </thead>
                <tbody>
                  {dados.map((item, index) => {
                    const percentual = ((item.total_gasto / totalGasto) * 100).toFixed(2);
                    return (
                      <tr key={index}>
                        <td>{item.categoria}</td>
                        <td>{percentual}%</td>
                        <td>{item.total_gasto.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                      </tr>
                    );
                  })}
                  <tr id="footer">
                    <td colSpan="2">Total</td>
                    <td>{totalGasto.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="Buttons">
              <button onClick={gerarPDF}>Baixar PDF</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

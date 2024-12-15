import React, { useState, useEffect, useMemo } from 'react';
import ReactApexChart from 'react-apexcharts';
import axios from 'axios';

export default function Chart1({ id }) {
  const [chartData, setChartData] = useState(null); // Estado inicial para os dados
  const [loading, setLoading] = useState(true); // Estado de carregamento

  // Busca os dados do backend
  useEffect(() => {
    setLoading(true);
    axios
      .get(`http://localhost:8000/api/chart1/${id}`)
      .then((response) => {
        const despesas = Array(12).fill(0);
        const receitas = Array(12).fill(0);

        response.data.forEach((item) => {
          const mes = item.mes - 1; // Ajusta o índice do mês
          despesas[mes] = Math.round(item.total_gasto || 0); // Garante números inteiros
          receitas[mes] = Math.round(item.total_receita || 0); // Garante números inteiros
        });

        setChartData({ despesas, receitas });
        setLoading(false); // Marca o carregamento como concluído
      })
      .catch((error) => {
        console.error('Erro ao buscar os dados:', error);
        setLoading(false); // Mesmo em caso de erro, conclui o carregamento
      });
  }, [id]);
  
  // Memoriza as opções do gráfico para evitar re-renderizações desnecessárias
  const options = useMemo(
    () => ({
      chart: {
        height: 350,
        type: 'line',
        zoom: {
          enabled: false,
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        width: [5, 7],
        curve: 'smooth',
      },
      legend: {
        labels: {
          colors: '#f3f3f3',
        },
        formatter: function (val, opts) {
          return (
            val +
            " - R$" +
            opts.w.globals.series[opts.seriesIndex].reduce((a, b) => a + b, 0)
          );
        },
      },
      markers: {
        size: 0,
        hover: {
          sizeOffset: 6,
        },
      },
      xaxis: {
        categories: [
          'Jan',
          'Fev',
          'Mar',
          'Abr',
          'Mai',
          'Jun',
          'Jul',
          'Ago',
          'Set',
          'Out',
          'Nov',
          'Dez',
        ],
        labels: {
          style: {
            colors: '#f3f3f3',
          },
        },
      },
      yaxis: {
        labels: {
          style: {
            colors: '#f3f3f3',
          },
        },
      },
      tooltip: {
        y: [
          {
            title: {
              formatter: function (val) {
                return 'R$ ' + val;
              },
            },
          },
          {
            title: {
              formatter: function (val) {
                return 'R$ ' + val;
              },
            },
          },
        ],
      },
      grid: {
        borderColor: '#f1f1f1',
      },
    }),
    [] // Esse array vazio garante que as opções não sejam recriadas desnecessariamente
  );

  // Memoriza as séries de dados
  const series = useMemo(() => {
    return chartData
      ? [
          {
            name: 'Despesa',
            data: chartData.despesas,
            color: '#923E3E',
          },
          {
            name: 'Receita',
            data: chartData.receitas,
            color: '#20B068',
          },
        ]
      : [];
  }, [chartData]); // Atualiza apenas quando chartData muda

  return (
    <div>
      {loading ? (
        <p>Carregando dados...</p>
      ) : chartData ? (
        <ReactApexChart
          options={options}
          series={series}
          type="line"
          height={250}
          width={780}
        />
      ) : (
        <p>Nenhum dado disponível</p>
      )}
    </div>
  );
}

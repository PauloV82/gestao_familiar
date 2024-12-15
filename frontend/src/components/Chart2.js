import React, { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';

export default function Chart2({ id }) {
  const [series, setSeries] = useState([]); // Armazena os valores dinâmicos
  const [categories, setCategories] = useState([]); // Armazena os nomes das categorias
  const [loading, setLoading] = useState(true); // Estado para indicar carregamento
  const [hasData, setHasData] = useState(true); // Estado para verificar se há dados

  useEffect(() => {
    async function fetchChartData() {
      try {
        const response = await fetch(`http://localhost:8000/api/categorias/${id}`);
        const data = await response.json();

        if (data.length === 0) {
          setHasData(false); // Não há dados
        } else {
          setHasData(true); // Existem dados
          const gasto = data.map(item => item.total_gasto);
          const labels = data.map(item => item.categoria);

          setSeries(gasto);
          setCategories(labels);
        }
      } catch (error) {
        console.error('Erro ao buscar dados do gráfico:', error);
      } finally {
        setLoading(false); // Carregamento concluído
      }
    }

    fetchChartData();
  }, [id]);

  const options = {
    series: series,
    chart: {
      width: 380,
      type: 'donut',
    },
    plotOptions: {
      pie: {
        startAngle: -90,
        endAngle: 270,
      },
    },
    dataLabels: {
      enabled: false,
    },
    fill: {
      type: 'gradient',
    },
    legend: {
      labels: {
        colors: '#f3f3f3',
      },
      formatter: function (val, opts) {
        return `${categories[opts.seriesIndex]} - ${opts.w.globals.series[opts.seriesIndex]}R$ `;
      },
    },
    tooltip: {
      enabled: true,
      y: {
        formatter: function (val) {
          return `R$ ${val.toFixed(2)}`; // Exibe o valor em Reais
        },
      },
      custom: function ({ series, seriesIndex, dataPointIndex, w }) {
        const total = series.reduce((acc, val) => acc + val, 0); // Soma todos os valores
        const percentage = ((series[seriesIndex] / total) * 100).toFixed(2); // Calcula a porcentagem
        return `<div style="padding: 10px; background: #fff; border-radius: 5px; color: #333;">
                  <strong>${categories[seriesIndex]}</strong><br/>
                  <span>${percentage}%</span><br/>
                  <span>R$ ${series[seriesIndex].toFixed(2)}</span>
                </div>`;
      },
    },
    title: {
      style: {
        color: '#f3f3f3',
      },
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 200,
          },
          legend: {
            position: 'bottom',
          },
        },
      },
    ],
  };

  if (loading) {
    return <p>Carregando dados...</p>;
  }

  if (!hasData) {
    return (
      <div>
        <h3>Bem-vindo! 🌟</h3>
        <p>Comece cadastrando suas despesas e receitas.</p>
      </div>
    );
  }

  return (
    <div>
      <ReactApexChart options={options} series={series} type="donut" height={230} width={480} />
    </div>
  );
}

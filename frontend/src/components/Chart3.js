import React, { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';

export default function Chart3({ id }) {
  const [despesaTotal, setDespesaTotal] = useState(0);
  const [limiteTotal, setLimiteTotal] = useState(0);

  useEffect(() => {
    // Buscar o total das despesas e o limite
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/limite/${id}`);
        const data = await response.json();

        if (data.total_gastos && data.total_limites) {
          // Atualiza os estados com os dados recebidos, convertendo para inteiros
          setDespesaTotal(Math.round(data.total_gastos)); // Arredondando para inteiro
          setLimiteTotal(Math.round(data.total_limites)); // Arredondando para inteiro
        }
      } catch (error) {
        console.error('Erro ao buscar dados do gráfico:', error);
      }
    };

    fetchData();
  }, [id]);

  const options = {
    series: [
      {
        name: 'Gasto total', // Nome da série
        data: [
          {
            x: 'DESPESAS', // Categoria
            y: despesaTotal, // Gasto total das despesas (convertido para inteiro)
            goals: [
              {
                name: 'Meta de gastos', // Meta ou valor esperado para Despesas
                value: limiteTotal, // Valor esperado de Despesas (convertido para inteiro)
                strokeHeight: 5,
                strokeColor: '#BF7D3B',
              },
            ],
          },
        ],
      },
    ],
    chart: {
      height: 350,
      type: 'bar',
    },
    plotOptions: {
      bar: {
        columnWidth: '60%',
      },
    },
    colors: ['#D7BF92'],
    dataLabels: {
      enabled: false,
    },
    legend: {
      show: true,
      showForSingleSeries: true,
      customLegendItems: ['Gasto total', 'Meta de gastos'],
      markers: {
        fillColors: ['#D7BF92', '#BF7D3B'],
      },
      labels: {
        colors: '#f3f3f3',
      },
    },
    xaxis: {
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
  };

  return (
    <div>
      <ReactApexChart options={options} series={options.series} type="bar" height={220} width={570} />
    </div>
  );
}

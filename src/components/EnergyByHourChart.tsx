import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import './EnergyByHourChart.css'; // Dodajemo CSS

interface EnergyByHourData {
  hour: number;
  energyKWh: number;
}

interface EnergyByHourChartProps {
  data: EnergyByHourData[];
}

const EnergyByHourChart: React.FC<EnergyByHourChartProps> = ({ data }) => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    if (chartRef.current) {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      const ctx = chartRef.current.getContext('2d');
      if (ctx) {
        const sortedData = [...data].sort((a, b) => a.hour - b.hour);
        const labels = sortedData.map(d => `${d.hour}:00`);
        const energyValues = sortedData.map(d => d.energyKWh);

        chartInstance.current = new Chart(ctx, {
          type: 'line',
          data: {
            labels: labels,
            datasets: [{
              label: 'Energy Consumption (kWh)',
              data: energyValues,
              borderColor: '#3b82f6',
              backgroundColor: 'rgba(59, 130, 246, 0.1)',
              tension: 0.3,
              fill: true,
              borderWidth: 2,
              pointRadius: 4,
              pointBackgroundColor: '#3b82f6',
              pointBorderColor: 'white',
              pointBorderWidth: 1,
              pointHoverRadius: 6,
            }],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: true,
                position: 'top',
                labels: {
                  font: {
                    size: 14,
                    family: 'Roboto, sans-serif',
                  },
                  color: '#374151',
                }
              },
              title: {
                display: true,
                text: 'Hourly Energy Consumption',
                font: {
                  size: 18,
                  weight: 'bold',
                  family: 'Roboto, sans-serif',
                },
                color: '#0f172a',
              },
              tooltip: {
                callbacks: {
                  label: function (context) {
                    let label = context.dataset.label || '';
                    if (label) label += ': ';
                    if (context.parsed.y !== null) {
                      label += `${context.parsed.y.toFixed(2)} kWh`;
                    }
                    return label;
                  }
                },
                backgroundColor: 'rgba(0, 0, 0, 0.75)',
                titleFont: { size: 14, family: 'Roboto, sans-serif' },
                bodyFont: { size: 12, family: 'Roboto, sans-serif' },
                padding: 10,
                displayColors: true,
              }
            },
            scales: {
              x: {
                title: {
                  display: true,
                  text: 'Hour of the Day',
                  font: {
                    size: 14,
                    weight: 'bold',
                    family: 'Roboto, sans-serif',
                  },
                  color: '#555',
                },
                grid: {
                  display: false,
                },
                ticks: {
                  font: {
                    family: 'Roboto, sans-serif',
                  },
                  color: '#666',
                }
              },
              y: {
                title: {
                  display: true,
                  text: 'Energy Consumption (kWh)',
                  font: {
                    size: 14,
                    weight: 'bold',
                    family: 'Roboto, sans-serif',
                  },
                  color: '#555',
                },
                beginAtZero: true,
                grid: {
                  color: '#e5e7eb',
                },
                ticks: {
                  font: {
                    family: 'Roboto, sans-serif',
                  },
                  color: '#666',
                }
              },
            },
          },
        });
      }
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [data]);

  return (
    <div className="chart-wrapper">
      <canvas ref={chartRef}></canvas>
    </div>
  );
};

export default EnergyByHourChart;

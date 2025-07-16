import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { getHourlyEnergyConsumption, getChargerDetails } from '../services/api';
import EnergyByHourChart from '../components/EnergyByHourChart';
import './ChargerStatisticsPage.css';

interface EnergyConsumptionByHourDto {
  hour: number;
  energyKWh: number;
}

interface ElectricCharger {
  deviceId: string;
  voltageV: number;
  currentA: number;
  type: string;
  connectorTypes: string[];  // dodano polje
}


const ChargerStatisticsPage: React.FC = () => {
  const { deviceId } = useParams<{ deviceId: string }>();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [hourlyData, setHourlyData] = useState<EnergyConsumptionByHourDto[]>([]);
  const [chargerDetails, setChargerDetails] = useState<ElectricCharger | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [totalDailyEnergy, setTotalDailyEnergy] = useState<number | null>(null);

  useEffect(() => {
    if (!deviceId) return;

    const fetchAllData = async () => {
      setLoading(true);
      setError(null);
      try {
        const details = await getChargerDetails(deviceId);
        setChargerDetails(details);

        const year = selectedDate.getFullYear();
        const month = (selectedDate.getMonth() + 1).toString().padStart(2, '0');
        const day = selectedDate.getDate().toString().padStart(2, '0');
        const formattedDate = `${year}-${month}-${day}`;

        const dataFromBackend = await getHourlyEnergyConsumption(deviceId, formattedDate);

        const processedData = dataFromBackend.map(item => {
          const utcDate = new Date(Date.UTC(
            selectedDate.getFullYear(),
            selectedDate.getMonth(),
            selectedDate.getDate(),
            item.hour,
            0, 0
          ));
          const localHour = utcDate.getHours();
          return {
            hour: localHour,
            energyKWh: item.energyKWh
          };
        });

        setHourlyData(processedData);
        const totalEnergy = processedData.reduce((sum, item) => sum + item.energyKWh, 0);
        setTotalDailyEnergy(totalEnergy);

      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Unable to fetch data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [deviceId, selectedDate]);

  if (loading) {
    return (
      <div className="page-container">
        <div className="loading-overlay">
          <div className="loading-spinner">
            <div className="spinner-ring"></div>
            <div className="spinner-ring"></div>
            <div className="spinner-ring"></div>
          </div>
          <p className="loading-text">Loading data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container">
        <div className="error-container">
          <div className="error-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
          </div>
          <h2>Error</h2>
          <p>{error}</p>
          <button className="retry-button" onClick={() => window.location.reload()}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="content-wrapper">
        <header className="header">
          <div className="header-content">
            <div className="header-main">
              <h1>Charger Statistics - {deviceId}</h1>
            </div>
            <div className="header-actions">
              <div className="date-picker-wrapper">
                <label className="date-label">Select date:</label>
                <DatePicker
                  selected={selectedDate}
                  onChange={(date: Date | null) => {
                    if (date) setSelectedDate(date);
                  }}
                  dateFormat="dd.MM.yyyy"
                  className="date-picker"
                />
              </div>
            </div>
          </div>
        </header>

        <div className="dashboard">
          <div className="stats-grid">
            <div className="stat-card energy-card">
              <div className="stat-header">
                <div className="stat-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
                  </svg>
                </div>
                <h3>Total Consumption</h3>
              </div>
              <div className="stat-value">
                {totalDailyEnergy?.toFixed(2) || '0.00'}
                <span className="stat-unit">kWh</span>
              </div>
              <div className="stat-date">
                {selectedDate.toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </div>
            </div>

            {chargerDetails && (
              <div className="stat-card charger-card">
                <div className="stat-header">
                  <div className="stat-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="7" y="7" width="10" height="10" rx="1"/>
                      <circle cx="12" cy="12" r="3"/>
                      <path d="M12 1v6m0 10v6m11-7h-6m-10 0H1"/>
                    </svg>
                  </div>
                  <h3>Charger Details</h3>
                </div>
                <div className="charger-specs">
                  <div className="spec-item">
                    <span className="spec-label">Type</span>
                    <span className="spec-value">{chargerDetails.type}</span>
                  </div>
                  <div className="spec-item">
                    <span className="spec-label">Voltage</span>
                    <span className="spec-value">{chargerDetails.voltageV}V</span>
                  </div>
                  <div className="spec-item">
                    <span className="spec-label">Current</span>
                    <span className="spec-value">{chargerDetails.currentA}A</span>
                  </div>
                  <div className="spec-item">
                    <span className="spec-label">Connectors</span>
                    <span className="spec-value">
                      {chargerDetails.connectorTypes?.join(', ')}
                    </span>
                  </div>
     
                </div>
              </div>
            )}
          </div>

          <div className="chart-container">
            <div className="chart-header">
              <h3>Detailed energy consumption throughout the day</h3>
            </div>
            <div className="chart-content">
              {hourlyData.length > 0 ? (
                <EnergyByHourChart data={hourlyData} />
              ) : (
                <div className="no-data">
                  <div className="no-data-icon">
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                      <path d="M3 3v18h18"/>
                      <path d="M18.7 8a4 4 0 0 0-7.4 0"/>
                    </svg>
                  </div>
                  <h4>No data available</h4>
                  <p>No energy consumption data recorded for the selected date</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChargerStatisticsPage;

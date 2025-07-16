import { ElectricCharger } from "../types/ElectricCharger";
import { useNavigate } from "react-router-dom";
import "./ChargerInfoCard.css";

type Props = {
  charger: ElectricCharger;
  premium?: boolean;
};

const ChargerInfoCard = ({ charger, premium = false }: Props) => {
  const navigate = useNavigate();

  const handleViewStatistics = () => {
    navigate(`/charger-statistics/${charger.deviceId}`);
  };

  // Mapiranje statusa na boje (isto kao live kartice)
  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'charging':
        return 'charging';
      case 'available':
      case 'idle':
        return 'idle';
      case 'error':
      case 'offline':
        return 'error';
      case 'completed':
        return 'completed';
      default:
        return 'idle';
    }
  };

  // Ikone za različite tipove charger-a
  const getChargerIcon = (type: string) => {
    switch (type?.toLowerCase()) {
      case 'ac':
        return '🔌';
      case 'dc':
        return '⚡';
      case 'fast':
        return '🚀';
      default:
        return '🔋';
    }
  };

  // Premium badge logika
  const getPremiumBadge = () => {
    if (premium) return "PREMIUM";
    if (charger.maxPowerKw > 150) return "ULTRA FAST";
    if (charger.connectorTypes.length > 2) return "MULTI-PORT";
    return null;
  };

  const statusColor = getStatusColor(charger.status);
  const chargerIcon = getChargerIcon(charger.type);
  const premiumBadge = getPremiumBadge();

  return (
    <div className={`status-card-block charger-card`} data-status={statusColor}>
      {/* Premium badge */}
      {premiumBadge && (
        <div className="premium-badge">
          {premiumBadge}
        </div>
      )}
      
      {/* Header u live kartica stilu */}
      <div className="status-header-card">
        <div className="status-icon">
          {chargerIcon}
        </div>
        <div className="status-info">
          <h3 className="status-title">{charger.deviceId}</h3>
          <p className="status-count">{charger.type} Charger</p>
        </div>
      </div>

      {/* Detalji charger-a */}
      <div className="charger-details">
        <div className="detail-item">
          <span className="detail-label">
            <span className="detail-icon">⚡</span>
            Max Power
          </span>
          <span className="detail-value">{charger.maxPowerKw} kW</span>
        </div>
        
        <div className="detail-item">
          <span className="detail-label">
            <span className="detail-icon">🔋</span>
            Current
          </span>
          <span className="detail-value">{charger.currentA} A</span>
        </div>
        
        <div className="detail-item">
          <span className="detail-label">
            <span className="detail-icon">⚡</span>
            Voltage
          </span>
          <span className="detail-value">{charger.voltageV} V</span>
        </div>
        
        <div className="detail-item">
          <span className="detail-label">
            <span className="detail-icon">🔗</span>
            Connectors
          </span>
          <span className="detail-value">{charger.connectorTypes.join(", ")}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="charger-actions">
        <button onClick={handleViewStatistics} className="statistics-button">
          <span className="button-text">View Statistics</span>
          <span className="button-icon">📊</span>
        </button>
      </div>
    </div>
  );
};

export default ChargerInfoCard;
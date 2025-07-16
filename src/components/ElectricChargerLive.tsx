import { ElectricCharger } from "../types/ElectricCharger";
import "./ElectricChargerLive.css"; // Uveri se da sadrži iste klase kao ChargerInfoCard.css

type Props = {
  charger: ElectricCharger;
  isLoading?: boolean;
  showPremiumBadge?: boolean;
};

const ElectricChargerLive = ({ charger, isLoading = false, showPremiumBadge = false }: Props) => {
  const getStatusClass = (status: string) => {
    switch (status.toLowerCase()) {
      case "charging":
        return "charging";
      case "idle":
      case "available":
        return "idle";
      case "error":
      case "offline":
        return "error";
      case "completed":
        return "completed";
      default:
        return "idle";
    }
  };

  const getStatusDisplayText = (status: string) => {
    switch (status.toLowerCase()) {
      case "charging":
        return "🔋 Charging";
      case "idle":
        return "⏸️ Idle";
      case "error":
        return "❌ Error";
      case "completed":
        return "✅ Completed";
      case "offline":
        return "🔴 Offline";
      default:
        return status;
    }
  };

  const formatDateTime = (dateString: string | null) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "-";
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  };

  const statusClass = getStatusClass(charger.status);
  const isCharging = statusClass === "charging";
  const hasStartTime = charger.startChargingTime;
  const hasEndTime = charger.endChargingTime;

  return (
    <div className={`status-card-block charger-card ${isLoading ? 'loading' : ''}`} data-status={statusClass}>
      {/* Premium badge */}
      {showPremiumBadge && <div className="premium-badge">LIVE</div>}

      {/* Header sa status ikonom i badge-om */}
      <div className="status-header-card">
        <div className="status-icon">⚡</div>
        <div className="status-info">
          <h3 className="status-title">{charger.deviceId}</h3>
          <p className="status-count">{charger.type}</p>
        </div>
        <div className="status-badge">{getStatusDisplayText(charger.status)}</div>
      </div>

      {/* Specifikacije */}
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
      </div>

      {/* Vremenske informacije */}
      <div className="charger-actions">
        <div className="detail-item">
          <span className="detail-label">
            <span>🟢</span> Start Time
          </span>
          <span className={`detail-value ${hasStartTime ? (isCharging ? 'active' : '') : 'empty'}`}>
            {formatDateTime(charger.startChargingTime)}
          </span>
        </div>

        <div className="detail-item">
          <span className="detail-label">
            <span>🔴</span> End Time
          </span>
          <span className={`detail-value ${hasEndTime ? '' : 'empty'}`}>
            {formatDateTime(charger.endChargingTime)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ElectricChargerLive;

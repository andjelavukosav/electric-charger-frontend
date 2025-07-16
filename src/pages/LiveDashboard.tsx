import { useEffect, useState } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

import { getAllChargers } from "../services/api";
import { ElectricCharger } from "../types/ElectricCharger";
import ElectricChargerLive from "../components/ElectricChargerLive";
import "./LiveDashboard.css";

function LiveDashboard() {
  const [chargers, setChargers] = useState<{ [deviceId: string]: ElectricCharger }>({});
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  useEffect(() => {
    setIsLoading(true);
    getAllChargers()
      .then(data => {
        const map: { [deviceId: string]: ElectricCharger } = {};
        data.forEach(c => {
          map[c.deviceId] = c;
        });
        setChargers(map);
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Error loading chargers:', error);
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    const socket = new SockJS('http://localhost:8080/ws');
    const client = new Client({
      webSocketFactory: () => socket,
      onConnect: () => {
        console.log('Connected to WebSocket');
        setIsConnected(true);
        client.subscribe('/topic/charging-data', (message) => {
          const data = JSON.parse(message.body);
          setLastUpdate(new Date());

          if (Array.isArray(data)) {
            setChargers(prev => {
              const updated = { ...prev };
              data.forEach(charger => {
                updated[charger.deviceId] = charger;
              });
              return updated;
            });
          } else {
            const charger = data;
            setChargers(prev => ({
              ...prev,
              [charger.deviceId]: charger,
            }));
          }
        });
      },
      onDisconnect: () => {
        console.log('Disconnected from WebSocket');
        setIsConnected(false);
      },
      onStompError: (frame) => {
        console.error('Broker reported error: ' + frame.headers['message']);
        console.error('Additional details: ' + frame.body);
        setIsConnected(false);
      },
      debug: (str) => {
        console.log(str);
      },
    });

    client.activate();

    return () => {
      client.deactivate();
    };
  }, []);

  const chargerList = Object.values(chargers);

  const grouped = {
    charging: chargerList.filter(c => c.status.toLowerCase() === "charging"),
    completed: chargerList.filter(c => c.status.toLowerCase() === "completed"),
    idle: chargerList.filter(c => c.status.toLowerCase() === "idle"),
    error: chargerList.filter(c => c.status.toLowerCase() === "error"),
  };

  const getStatusDisplayName = (status: string) => {
    switch (status) {
      case "charging":
        return "Charging";
      case "completed":
        return "Completed";
      case "idle":
        return "Idle";
      case "error":
        return "Error";
      default:
        return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "charging":
        return "⚡";
      case "completed":
        return "✅";
      case "idle":
        return "⏸";
      case "error":
        return "⚠️";
      default:
        return "📱";
    }
  };

  return (
    <div className={`dashboard ${isLoading ? 'loading' : ''}`}>
      <div className="page-container">
        <div className="content-wrapper">
          {/* Header */}
          <div className="header">
            <div className="header-content">
              <div className="header-main">
                Live Charging Station Dashboard
              </div>
              <p style={{
                color: '#64748b',
                fontSize: '1.1rem',
                margin: 0,
                position: 'relative',
                zIndex: 2
              }}>
                <div className="live-indicator">
                  LIVE
                </div>
              </p>
            </div>
          </div>

          {/* Status Groups in Order */}
          <div className="status-cards-container">
            {["charging", "completed", "idle", "error"].map((status) => {
              const chargersInGroup = grouped[status as keyof typeof grouped];
              return (
                <div key={status} className="status-card-block" data-status={status}>
                  {/* Status Header Card */}
                  <div className="status-header-card">
                    <div className="status-icon">
                      {getStatusIcon(status)}
                    </div>
                    <div className="status-info">
                      <h3 className="status-title">
                        {getStatusDisplayName(status)}
                      </h3>
                      <div className="status-count">
                        {chargersInGroup.length} {chargersInGroup.length === 1 ? 'charger' : 'chargers'}
                      </div>
                    </div>
                    <div className="status-badge">
                      {chargersInGroup.length}
                    </div>
                  </div>

                  {/* Charger Cards */}
                  <div className="charger-cards-grid">
                    {chargersInGroup.length > 0 ? (
                      chargersInGroup.map(c => (
                        <div key={c.deviceId} className="charger-card-wrapper">
                          <ElectricChargerLive charger={c} />
                        </div>
                      ))
                    ) : (
                      <div className="no-data-card">
                        <div className="no-data-icon">🔌</div>
                        <div className="no-data-text">
                          No chargers in this state
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default LiveDashboard;

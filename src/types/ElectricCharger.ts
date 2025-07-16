export interface ElectricCharger {
  id: number;
  deviceId: string;
  status: string;
  type: string;
  maxPowerKw: number;
  currentA: number;
  voltageV: number;
  startChargingTime: string;
  endChargingTime: string;
  connectorTypes: string[];
}

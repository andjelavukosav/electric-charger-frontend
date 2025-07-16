import { ElectricCharger } from "../types/ElectricCharger";
import axios from 'axios';

export const getAllChargers = async () : Promise<ElectricCharger[]> => {
    const response = await fetch("http://localhost:8080/api/chargers");
    if(!response.ok){
        throw new Error("Failed to fetch chargers");
    }
    return response.json();
    
}

export const getHourlyEnergyConsumption = async (
  deviceId: string,
  date: string // Format YYYY-MM-DD
): Promise<{ hour: number; energyKWh: number }[]> => {
  const response = await fetch(`http://localhost:8080/api/chargers/hourly-energy/${deviceId}?date=${date}`);
  if (!response.ok) {
    throw new Error('Failed to fetch hourly energy data');
  }
  return response.json();
};


export const getChargerDetails = async (deviceId: string): Promise<ElectricCharger> => {
  const response = await axios.get(`http://localhost:8080/api/chargers/${deviceId}`);
  return response.data;
};
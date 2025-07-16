// src/hooks/useWebSocket.ts
import { useEffect } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { ElectricCharger } from "../types/ElectricCharger";

type OnMessage = (updatedCharger: ElectricCharger) => void;

export function useWebSocket(onMessage: OnMessage) {
  useEffect(() => {
    const socket = new SockJS("http://localhost:8080/ws");
    const stompClient = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      onConnect: () => {
        stompClient.subscribe("/topic/chargers", (message) => {
          const body = JSON.parse(message.body);
          onMessage(body);
        });
      },
    });

    stompClient.activate();

    return () => {
      stompClient.deactivate();
    };
  }, [onMessage]);
}

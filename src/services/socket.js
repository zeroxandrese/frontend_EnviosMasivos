import openSocket from "socket.io-client";
import { isObject } from "lodash";

export function socketConnection(params) {
  // Validar params
  if (!params || (!params.userId && !params.companyId)) {
    console.warn("socketConnection: missing params");
    // Retorna un objeto "dummy" seguro que ignora .on y .emit
    return {
      on: () => {},
      off: () => {},
      emit: () => {},
      disconnect: () => {},
    };
  }

  // Construye query solo con los valores definidos
  const query: Record<string, string> = {};
  if (params.userId) query.userId = params.userId;
  if (params.companyId) query.companyId = params.companyId;

  // Crear socket real
  const socket = openSocket(process.env.REACT_APP_BACKEND_URL, {
    transports: ["websocket", "polling"],
    pingTimeout: 18000,
    pingInterval: 18000,
    query,
  });

  return socket;
}
import { io } from 'socket.io-client';

const socket = io('http://localhost:3001', {
  autoConnect: true, // par défaut true, mais explicite ici
  reconnection: true,
  reconnectionAttempts: 10, // tente de se reconnecter 10 fois
  reconnectionDelay: 1000,  // attend 1s entre chaque tentative
  timeout: 20000,           // timeout de connexion (20s)
});

export default socket;
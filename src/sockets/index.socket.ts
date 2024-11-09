// sockets/index.socket.ts
import userCache from '../cache/serCache';
import { Socket } from 'socket.io';

export const handleSocketConnection = (socket: Socket) => {
  console.log('New socket connection established:', socket.id);

  // Écoute les mises à jour des utilisateurs
  socket.on("userUpdated", () => {
    // Supprimez les utilisateurs en cache pour forcer la récupération des données mises à jour
    userCache.del("allUsers");
    console.log("Cache des utilisateurs réinitialisé suite à une mise à jour");
  });
};

import UserService from '../services/user.service';
import userCache from '../cache/serCache';
import { Socket } from 'socket.io';


export const handleSocketConnection = (socket: Socket) => {
  console.log('New socket connection established:', socket.id);

  // Écoute des mises à jour des utilisateurs
  socket.on('userUpdated', async (userId: string) => {
    try {
      // Met à jour les données de l'utilisateur dans la base de données
      const user = await UserService.findUserById(userId);
      if (!user) {
        socket.emit('error', { message: 'User not found' });
        return;
      }

      // Actualiser les informations en cache pour l'utilisateur
      userCache.del(userId); // Supprimer le cache existant

      // Émettre un événement à tous les clients pour leur notifier que l'utilisateur a été mis à jour
      socket.broadcast.emit('userUpdated', { userId, updatedUser: user });

      console.log('Cache réinitialisé et mise à jour envoyée aux clients');
    } catch (error) {
      console.error('Error while handling userUpdated:', error);
      socket.emit('error', { message: 'Failed to update user' });
    }
  });
};
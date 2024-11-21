const { io } = require('socket.io-client');

// Connexion au serveur Socket.io
const socket = io('http://localhost:8080');

// Écoute de la connexion
socket.on('connect', () => {
  console.log('Connected to server with socket ID:', socket.id);

  // Exemple d'émission d'une mise à jour utilisateur (remplacer avec l'ID réel)
  socket.emit('userUpdated', 'bnbbnbnbn');
});

// Écoute de la mise à jour de l'utilisateur
socket.on('userUpdated', (data) => {
  console.log('Utilisateur mis à jour:', data);

  // Ici, tu peux mettre à jour l'état de ton application avec les nouvelles données utilisateur
  // Par exemple, si tu utilises React :
  // setUser(data.updatedUser);
  // Afficher un message ou mettre à jour l'interface utilisateur selon la logique que tu as définie

  console.log('L\'utilisateur a été mis à jour!');
});

// Écoute de la déconnexion
socket.on('disconnect', (reason) => {
  console.log('Disconnected from server:', reason);
});

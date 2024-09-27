const express = require('express');
const cors = require('cors');
const socketIo = require('socket.io');
const http = require('http'); // Import http to create server
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();

const app = express(); // Initialize app here
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

const server = http.createServer(app); // Use 'server' to handle both HTTP and WebSocket requests
const io = socketIo(server, {
  cors: {
    origin: '*', // Allow all origins for development. Adjust for production.
    methods: ['GET', 'POST'],
  },
});

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

// Importing all routes
const userRoutes = require('./routes/route-user.js');
const chatRoutes = require('./routes/route-chats.js');
const messageRoutes = require('./routes/route-messages.js');

client.connect()
  .then(() => {
    console.log('Connected to MongoDB');

    // Use routes
    app.use('/users', userRoutes(client));
    app.use('/chats', chatRoutes(client));
    app.use('/messages', messageRoutes(client));

    // WebSocket connection
    io.on('connection', (socket) => {
      console.log('A user connected:', socket.id);

      // Listen for new messages and broadcast them
      socket.on('newMessage', (data) => {
        console.log('New message received:', data);
        io.to(data.chatId).emit('messageReceived', data);
      });

      // Join specific chat room
      socket.on('joinRoom', (chatId) => {
        socket.join(chatId);
        console.log(`User joined chat room: ${chatId}`);
      });

      // Handle user leaving and remove their messages
      socket.on('clearUserMessages', (data) => {
        const { chatId, userId } = data;
        console.log(`Removing messages from user: ${userId} in chat room: ${chatId}`);
        io.to(chatId).emit('removeUserMessages', { userId });
      });

      // Handle disconnection
      socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
      });
    });

    // Start the server
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Error connecting to MongoDB:', err);
    process.exit(1);
  });

const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

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

    // Using routes
    app.use('/users', userRoutes(client));
    app.use('/chats', chatRoutes(client));
    app.use('/messages', messageRoutes(client));

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Error connecting to MongoDB:', err);
    process.exit(1);
  });
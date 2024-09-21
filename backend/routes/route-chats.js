const express = require('express');
const ChatModel = require('../models/model-chat.js');
const { ObjectId } = require('mongodb');

module.exports = (client) => {
  const router = express.Router();
  const chatModel = new ChatModel(client);

  // Middleware to verify if chat exists
  const chatExists = async (req, res, next) => {
    const chatId = req.params.chatId;
    if (!ObjectId.isValid(chatId)) {
      return res.status(400).json({ message: "Invalid chat ID" });
    }
    const chat = await chatModel.getChatById(chatId);
    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }
    req.chat = chat;
    next();
  };

  // (1) Create new chat
  router.post('/create', async (req, res) => {
    try {
      const { name, description, participants } = req.body;
      if (!name || !participants) {
        return res.status(400).json({ message: "Missing required fields" });
      }
      const result = await chatModel.createChat({ name, description, participants });
      res.status(201).json({ message: "Chat created successfully", chatId: result.insertedId });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  // (2) Get all chats
  router.get('/', async (req, res) => {
    try {
      const chats = await chatModel.getAllChats();
      res.json(chats);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  // (3) Get chat by ID
  router.get('/:chatId', chatExists, (req, res) => {
    res.json(req.chat);
  });

  // (4) Update chat
  router.put('/:chatId', chatExists, async (req, res) => {
    try {
      const result = await chatModel.updateChat(req.params.chatId);
      if (result.modifiedCount === 0) {
        return res.status(400).json({ message: "No changes made" });
      }
      res.json({ message: "Chat updated successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  // (5) Delete chat
  router.delete('/:chatId', chatExists, async (req, res) => {
    try {
      await chatModel.deleteChat(req.params.chatId);
      res.json({ message: "Chat deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  // (6) Get user's chats
  router.get('/user/:userId', async (req, res) => {
    try {
      const chats = await chatModel.getUserChats(req.params.userId);
      res.json(chats);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  // (7) Add participant to chat
  router.post('/:chatId/participants', chatExists, async (req, res) => {
    try {
      const chatId = req.params.chatId;
      const { userId } = req.body;
      if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
      }
      const updated_participants = await chatModel.addParticipant(chatId, userId);
      res.json({ message: "Participant added successfully", participants: updated_participants });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  // (8) Remove participant from chat
  router.delete('/:chatId/participants/:userId', chatExists, async (req, res) => {
    try {
      await chatModel.removeParticipant(req.params.chatId, req.params.userId);
      res.json({ message: "Participant removed successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  // (9) Search chats
  router.get('/search', async (req, res) => {
    try {
      const { query } = req.query;
      if (!query) {
        return res.status(400).json({ message: "Search query is required" });
      }
      const chats = await chatModel.searchChats(query);
      res.json(chats);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  // (10) Check if user is in chat
  router.get('/:chatId/participants/:userId', chatExists, async (req, res) => {
    try {
      const isInChat = await chatModel.isUserInChat(req.params.chatId, req.params.userId);
      res.json({ isInChat });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  return router;
};
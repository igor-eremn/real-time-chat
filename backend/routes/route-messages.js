const express = require('express');
const MessageModel = require('../models/model-message.js');
const { ObjectId } = require('mongodb');

module.exports = (client) => {
  const router = express.Router();
  const messageModel = new MessageModel(client);

  // (1) Create new message
  router.post('/create', async (req, res) => {
    try {
      const { messageContent, sender, chatId } = req.body;
      if (!messageContent || !sender || !chatId) {
        return res.status(400).json({ message: "Missing required fields" });
      }
      const result = await messageModel.createMessage({ messageContent, sender, chatId });
      console.log("🚀 ~ router.post ~ result:", result)
      return res.status(201).json({
        message: "Message created successfully",
        newMessage: {
          _id: result.insertedId,
          messageContent,
          sender,
          chatId,
          timeSent: new Date()
        }
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  // Middleware to verify if message exists
  const messageExists = async (req, res, next) => {
    const messageId = req.params.messageId;
    if (!ObjectId.isValid(messageId)) {
      return res.status(400).json({ message: "Invalid message ID" });
    }
    const message = await messageModel.getMessageById(messageId);
    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }
    req.message = message;
    next();
  };

  // (2) Get message by ID
  router.get('/:messageId', messageExists, (req, res) => {
    res.json(req.message);
  });

  // (3) Get all messages for a chat
  router.get('/chat/:chatId', async (req, res) => {
    try {
      const messages = await messageModel.getAllChatMessages(req.params.chatId);
      res.json(messages);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  // (4) Delete all user messages
  router.delete('/user/:userId', async (req, res) => {
    try {
      const result = await messageModel.deleteAllUserMessages(req.params.userId);
      console.log("🚀 ~ router.delete ~ result:", result)
      
      res.json({ success: true, message: "All messages deleted successfully" });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

  // delete all messages from specific chat
  router.delete('/chat/:chatId', async (req, res) => {
    let userId = req.body.userId;
    try {
      const result = await messageModel.deleteAllChatMessages(req.params.chatId, userId);
      res.json({ success: true, message: "All messages deleted successfully" });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

  // (4) Update message
  router.put('/:messageId', messageExists, async (req, res) => {
    try {
      const { messageContent } = req.body;
      if (!messageContent) {
        return res.status(400).json({ message: "Message content is required" });
      }
      const result = await messageModel.updateMessage(req.params.messageId, { messageContent });
      if (result.modifiedCount === 0) {
        return res.status(400).json({ message: "No changes made" });
      }
      res.json({ message: "Message updated successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  // (5) Delete message
  router.delete('/:messageId', messageExists, async (req, res) => {
    try {
      await messageModel.deleteMessage(req.params.messageId);
      res.json({ message: "Message deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  // (6) Search messages in a chat
  router.get('/search/:chatId', async (req, res) => {
    try {
      const { query } = req.query;
      if (!query) {
        return res.status(400).json({ message: "Search query is required" });
      }
      const messages = await messageModel.searchMessages(req.params.chatId, query);
      res.json(messages);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  // (7) Get message count for a chat
  router.get('/count/:chatId', async (req, res) => {
    try {
      const count = await messageModel.getMessageCount(req.params.chatId);
      res.json({ count });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  return router;
};
const express = require('express');
const UserModel = require('../models/user-model.js');
const { ObjectId } = require('mongodb');

module.exports = (client) => {
  const router = express.Router();
  const userModel = new UserModel(client);

  // Middleware to verify if user exists
  const userExists = async (req, res, next) => {
    const userId = req.params.userId;
    if (!ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    const user = await userModel.findUserById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    req.user = user;
    next();
  };

  // (1) Create new user (sign up)
  router.post('/sign-up', async (req, res) => {
    try {
      const { username, name, password } = req.body;
      if (!username || !name || !password) {
        return res.status(400).json({ message: "Missing required fields" });
      }
      const existingUser = await userModel.findUserByUsername(username);
      if (existingUser) {
        return res.status(409).json({ message: "Username already exists" });
      }
      const result = await userModel.createUser({ username, name, password });
      console.log("🚀 ~ router.sign-up.post ~ result:", result)
      res.status(201).json({ message: "User created successfully", userId: result.insertedId });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  // (2) Get user by ID
  router.get('/:userId', userExists, (req, res) => {
    const { password, ...userWithoutPassword } = req.user;
    res.json(userWithoutPassword);
  });

  // (3) Update user
  router.put('/:userId', userExists, async (req, res) => {
    try {
      const { username, name } = req.body;
      const updateData = {};
      if (username) updateData.username = username;
      if (name) updateData.name = name;
      
      const result = await userModel.updateUser(req.params.userId, updateData);
      if (result.modifiedCount === 0) {
        return res.status(400).json({ message: "No changes made" });
      }
      res.json({ message: "User updated successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  // (4) Delete user
  router.delete('/:userId', userExists, async (req, res) => {
    try {
      await userModel.deleteUser(req.params.userId);
      res.json({ message: "User deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  // (5) Change password
  router.put('/:userId/change-password', userExists, async (req, res) => {
    try {
      const { currentPassword, newPassword } = req.body;
      if (!currentPassword || !newPassword) {
        return res.status(400).json({ message: "Missing required fields" });
      }
      
      const isValid = await userModel.verifyPassword(req.params.userId, currentPassword);
      if (!isValid) {
        return res.status(401).json({ message: "Current password is incorrect" });
      }
      
      await userModel.updatePassword(req.params.userId, newPassword);
      res.json({ message: "Password updated successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  // (6) Search users
  router.get('/search', async (req, res) => {
    try {
      const { query } = req.query;
      if (!query) {
        return res.status(400).json({ message: "Search query is required" });
      }
      const users = await userModel.searchUsers(query);
      res.json(users.map(({ password, ...user }) => user));
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  // (7) Get all users
  router.get('/', async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      
      const users = await userModel.findAllUsers();
      const total = await userModel.getUserCount();
      
      res.json({
        users: users.map(({ password, ...user }) => user),
        totalUsers: total
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  return router;
};
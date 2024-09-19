const { ObjectId } = require('mongodb');
const bcrypt = require('bcrypt');

class UserModel {
  constructor(client) {
    this.userCollection = client.db('DB1').collection('chat-users');
  }

  async createUser({ username, name, password }) {
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("🚀 ~ UserModel ~ createUser ~ hashedPassword:", hashedPassword)
    const userData = {
      username,
      name,
      password: hashedPassword,
      created: new Date()
    };
    
    return await this.userCollection.insertOne(userData);
  }

  async deleteUser(userId) {
    return await this.userCollection.deleteOne({ _id: new ObjectId(userId) });
  }

  async findUserByEmail(email) {
    return await this.userCollection.findOne({ email });
  }

  async findUserById(id) {
    return await this.userCollection.findOne({ _id: new ObjectId(id) });
  }

  async findUserByUsername(username) {
    try {
        return await this.userCollection.findOne({ username });
    } catch (error) {
        console.error('Error finding user by username:', error);
        throw error;
    }
  }

  async updateUser(userId, updateData) {
    return await this.userCollection.updateOne(
      { _id: new ObjectId(userId) },
      { $set: updateData }
    );
  }

  async updatePassword(userId, newPassword) {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    return await this.userCollection.updateOne(
      { _id: new ObjectId(userId) },
      { $set: { password: hashedPassword } }
    );
  }

  async verifyPassword(userId, password) {
    const user = await this.findUserById(userId);
    if (!user) return false;
    return await bcrypt.compare(password, user.password);
  }

  async findAllUsers() {
    return await this.userCollection.find({}).toArray();
  }

  async searchUsers(query) {
    return await this.userCollection.find({
      $or: [
        { username: { $regex: query, $options: 'i' } },
        { name: { $regex: query, $options: 'i' } }
      ]
    }).toArray();
  }

  async getUserCount() {
    return await this.userCollection.countDocuments();
  }
}

module.exports = UserModel;
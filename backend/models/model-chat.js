const { ObjectId } = require('mongodb');

class ChatModel {
  constructor(client) {
    this.chatCollection = client.db('DB1').collection('chat-chats');
  }

  async createChat({ name, description, participants}) {
    const chatData = {
      name,
      description,
      participants: participants.map(id => new ObjectId(id)),
      createdAt: new Date(),
      updatedAt: new Date(),
      //can add: lastMessage, numberOfMessages, numberofParticipants
    };
    return await this.chatCollection.insertOne(chatData);
  }

  async getAllChats() {
    return await this.chatCollection.find().toArray();
  }

  async getChatById(chatId) {
    return await this.chatCollection.findOne({ _id: new ObjectId(chatId) });
  }

  async updateChat(chatId) {
    const update = {
      $set: {
        updatedAt: new Date()
      }
    };
    return await this.chatCollection.updateOne({ _id: new ObjectId(chatId) }, update);
  }

  async deleteChat(chatId) {
    return await this.chatCollection.deleteOne({ _id: new ObjectId(chatId) });
  }

  async getUserChats(userId) {
    return await this.chatCollection.find({ participants: new ObjectId(userId) }).toArray();
  }

  async addParticipant(chatId, userId) {
    return await this.chatCollection.updateOne(
      { _id: new ObjectId(chatId) },
      { 
        $addToSet: { participants: new ObjectId(userId) },
        $set: { updatedAt: new Date() }
      }
    );
  }

  async removeParticipant(chatId, userId) {
    return await this.chatCollection.updateOne(
      { _id: new ObjectId(chatId) },
      { 
        $pull: { participants: new ObjectId(userId) },
        $set: { updatedAt: new Date() }
      }
    );
  }
  async searchChats(query) {
    return await this.chatCollection.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } }
      ]
    }).toArray();
  }

  async isUserInChat(chatId, userId) {
    const chat = await this.chatCollection.findOne({
      _id: new ObjectId(chatId),
      participants: new ObjectId(userId)
    });
    return !!chat;
  }
}

module.exports = ChatModel;
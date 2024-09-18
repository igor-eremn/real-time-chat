const { ObjectId } = require('mongodb');

class MessageModel {
  constructor(client) {
    this.messageCollection = client.db('DB1').collection('chat-messages');
  }

  async createMessage({ messageContent, sender, chatId }) {
    const messageData = {
      messageContent,
      sender: new ObjectId(sender),
      chatId: new ObjectId(chatId),
      timeSent: new Date(),
      reactions: [] // Optional: for storing reactions to messages
    };
    return await this.messageCollection.insertOne(messageData);
  }

  async getMessageById(messageId) {
    return await this.messageCollection.findOne({ _id: new ObjectId(messageId) });
  }

  async getAllChatMessages(chatId) {
    return await this.messageCollection.find(
      { chatId: new ObjectId(chatId)}
    )
    .toArray();
  }

  async updateMessage(messageId, updateData) {
    const update = {
      $set: {
        ...updateData,
        updatedAt: new Date()
      }
    };
    return await this.messageCollection.updateOne({ _id: new ObjectId(messageId) }, update);
  }

  //TODO: check if user sent it and only then delete
  async deleteMessage(messageId) {
    return await this.messageCollection.deleteOne(
      { _id: new ObjectId(messageId) }
    );
  }

  async searchMessages(chatId, query) {
    return await this.messageCollection.find({
      chatId: new ObjectId(chatId),
      messageContent: { $regex: query, $options: 'i' },
    }).toArray();
  }

  async getMessageCount(chatId) {
    return await this.messageCollection.countDocuments({ chatId: new ObjectId(chatId), isDeleted: false });
  }
}

module.exports = MessageModel;
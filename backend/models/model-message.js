//TODO: delete all messages from user when deleting user
const { ObjectId } = require('mongodb');

class MessageModel {
  constructor(client) {
    this.messageCollection = client.db('DB1').collection('chat-messages');
    this.MESSAGE_LIMIT = 50;
  }

  async createMessage({ messageContent, sender, chatId }) {
    const messageData = {
      messageContent,
      sender: new ObjectId(sender),
      chatId: new ObjectId(chatId),
      timeSent: new Date(),
    };

    let result = await this.messageCollection.insertOne(messageData);
    console.log("🚀 ~ MessageModel ~ awaitsession.withTransaction ~ result:", result)
    return result;
  }

  async getAllChatMessages(chatId) {
    return await this.messageCollection.find(
      { chatId: new ObjectId(chatId) }
    )
    .sort({ timeSent: 1 }) // Sort by newest first
    .limit(this.MESSAGE_LIMIT)
    .toArray();
  }

  async getMessageById(messageId) {
    return await this.messageCollection.findOne({ _id: new ObjectId(messageId) });
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
    return await this.messageCollection.countDocuments({ chatId: new ObjectId(chatId) });
  }

  async deleteOldestMessage(chatId, session) {
    const oldestMessage = await this.messageCollection.findOne(
      { chatId: new ObjectId(chatId) },
      { sort: { timeSent: 1 }, session }
    );

    if (oldestMessage) {
      await this.messageCollection.deleteOne({ _id: oldestMessage._id }, { session });
    }
  }
}

module.exports = MessageModel;
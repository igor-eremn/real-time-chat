const { ObjectId } = require('mongodb');

//TODO: delete all messages from user when deleting user

class MessageModel {
  constructor(client) {
    this.messageCollection = client.db('DB1').collection('chat-messages');
    this.MESSAGE_LIMIT = 50;
  }

  async createMessage({ messageContent, sender, chatId }) {
    const session = this.messageCollection.client.startSession();

    try {
      await session.withTransaction(async () => {
        const messageData = {
          messageContent,
          sender: new ObjectId(sender),
          chatId: new ObjectId(chatId),
          timeSent: new Date(),
          reactions: []
        };

        // Insert the new message
        await this.messageCollection.insertOne(messageData, { session });

        // Check the message count for this chat
        const count = await this.getMessageCount(chatId);

        // If we've exceeded the limit, delete the oldest message
        if (count > this.MESSAGE_LIMIT) {
          await this.deleteOldestMessage(chatId, session);
        }
      });

      return { success: true };
    } finally {
      await session.endSession();
    }
  }

  async getMessageById(messageId) {
    return await this.messageCollection.findOne({ _id: new ObjectId(messageId) });
  }

  async getAllChatMessages(chatId) {
    return await this.messageCollection.find(
      { chatId: new ObjectId(chatId) }
    )
    .sort({ timeSent: -1 }) // Sort by newest first
    .limit(this.MESSAGE_LIMIT)
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
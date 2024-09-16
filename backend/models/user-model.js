const { ObjectId } = require('mongodb');

class UserModel {
  constructor(client) {
    this.userInfoCollection = client.db('DB1').collection('chat-users');
  }
  async createUser(userData) {
    return await this.userInfoCollection.insertOne(userData);
  }

  async deleteUser(email) {
    return await this.userInfoCollection.deleteOne({ email: email});
  }

  async findUserByEmail(email) {
    return await this.userInfoCollection.findOne({ email: email });
  }

  async findUserById(id) {
    return await this.userInfoCollection.findOne({ _id: new ObjectId(id) });
  }

  async findUserByUsername(username) {
    return await this.userInfoCollection.findOne({ username: username });
  }

  async findUserByName(name) {
    return await this.userInfoCollection.findOne({ name: name });
  }

}

module.exports = UserModel;

const mongoose = require("mongoose");
require("dotenv").config();

const connect = async function () {
  // Connect to MongoDB
  mongoose.connect(process.env.MONGO_CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
};

const usersSchema = mongoose.Schema(
  {
    _id: String,
    team: { id: String, name: String },
    enterprise: { id: String, name: String },
    user: { token: String, scopes: [String], id: String },
    tokenType: String,
    isEnterpriseInstall: Boolean,
    appId: String,
    authVersion: String,
    bot: {
      scopes: [String],
      token: String,
      userId: String,
      id: String,
    },
    incomingWebhook: {
      url: String,
      channel: String,
      channelId: String,
      configurationUrl: String,
    },
  },
  { _id: false }
);

const User = mongoose.model("User", usersSchema);

const findUser = async function (id) {
  try {
    const user = await User.find({ _id: id });
    // return first user we find
    if (user[0] != undefined) {
      return user[0];
    }
  } catch (error) {
    console.error(error);
  }
};

const findAllUsers = async () => {
  try {
    const users = await User.find({});
    return users;
  } catch (error) {
    console.error(error);
  }
};

module.exports = {
  User,
  connect,
  findUser,
  findAllUsers,
};

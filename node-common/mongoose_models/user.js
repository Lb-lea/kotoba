const mongoose = require('mongoose');

const DiscordAccountSchema = new mongoose.Schema({
  username: { type: String, required: true },
  discriminator: { type: String, required: true },
  avatar: { type: String, default: '' },
  id: { type: String, required: true, index: true },
  email: { type: String, required: false },
});

const UserSchema = new mongoose.Schema({
  discordUser: { type: DiscordAccountSchema, required: true },
  admin: { type: Boolean, required: true },
});

function create(connection) {
  return connection.model('User', UserSchema);
}

module.exports = create;
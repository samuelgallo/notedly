const models = require('../models');

module.exports = {
  notes: async () => {
    return await models.Note.find();
  },
  note: async (parent, args) => {
    return await models.Note.findById(args.id);
  },
  user: async (parent, { username }, { models, user }) => {
    // if (!user) {
    //   throw new Error('User not found');
    // }
    // find a user given their username
    return await models.User.findOne({ username });
  },
  users: async (parent, args, { models }) => {
    // find all users
    return await models.User.find({});
  },
  me: async (parent, args, { models, user }) => {
    // find information's about the current user
    return await models.User.findById(user.id);
  }
};

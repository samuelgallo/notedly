const models = require('../models');

module.exports = {
  newNote: async (parent, args) => {
    return await models.Note.create({
      content: args.content,
      author: args.author
    });
  },
  deleteNote: async (parent, { id }, { models }) => {
    try {
      await models.Note.findOneAndRemove({ _id: id });
      return true;
    } catch (err) {
      return false;
    }
  },
  updateNote: async (parent, { content, author, id }, { models }) => {
    return await models.Note.findOneAndUpdate(
      {
        _id: id
      },
      {
        $set: {
          content,
          author
        }
      },
      {
        new: true
      }
    );
  }
};

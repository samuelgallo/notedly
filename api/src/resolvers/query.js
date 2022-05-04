const models = require('../models');

module.exports = {
  notes: async () => {
    return await models.Note.find().limit(100);
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
  },
  noteFeed: async (parent, { cursor }, { models }) => {
    // limit of 10 items
    const limit = 5;

    // set the default hasNextPage value to false
    let hasNextPage = false;

    // if no cursor is provided query will be empty, this will pull the newest notes from db
    let cursorQuery = {};

    // if the is a cursor our query will look for notes with an ObjectId
    if (cursor) {
      cursorQuery = { _id: { $lt: cursor } };
    }

    // find the limit + 1 of notes in our db, sorted newest to oldest
    let notes = await models.Note.find(cursorQuery)
      .sort({ _id: -1 })
      .limit(limit + 1);

    // if the number of notes we find exceeds our limit set hasNextPage to true an trim the notes to the limit
    if (notes.length > limit) {
      hasNextPage = true;
      notes = notes.slice(0, -1);
    }

    // the new cursor will be the mongodb ObjectId of the last item in the fee array
    const newCursor = notes[notes.length - 1]._id;

    return {
      notes,
      cursor: newCursor,
      hasNextPage
    };
  }
};

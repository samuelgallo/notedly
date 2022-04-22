require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {
  AuthenticationError,
  ForbiddenError
} = require('apollo-server-express');
const mongoose = require('mongoose');

const gravatar = require('../util/gravatar');

const models = require('../models');

module.exports = {
  newNote: async (parent, args, { models, user }) => {
    // if there is no user on the context, throw an authentication error.
    if (!user) {
      throw new AuthenticationError('You must be signed in to create a note');
    }

    return await models.Note.create({
      content: args.content,
      author: mongoose.Types.ObjectId(user.id)
    });
  },
  deleteNote: async (parent, { id }, { models, user }) => {
    if (!user) {
      throw new AuthenticationError('You must be signed in to delete a note');
    }

    //find a note
    const note = await models.Note.findById(id);

    // if the note owner and current user dont match, throw a forbidden error.
    if (note && String(note.author) !== user.id) {
      throw new ForbiddenError(
        "You don't  have permissions to delete the note."
      );
    }

    try {
      await note.remove();
      return true;
    } catch (err) {
      return false;
    }
  },
  updateNote: async (parent, { content, author, id }, { models, user }) => {
    // if not a user, thorw an Authentication error.
    if (!user) {
      throw new AuthenticationError('You must be signed in to update a note');
    }

    // find the note
    const note = await models.Note.findById(id);

    // if the note owner and current user dont match, throw a forbidden error.
    if (note && String(note.author) !== user.id) {
      throw new ForbiddenError("You don't have permission to update the note.");
    }

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
  },
  signUp: async (parent, { username, email, password }, { models }) => {
    // normalize the email address
    email = email.trim().toLowerCase();

    // crypt the password
    const hashed = await bcrypt.hash(password, 10);

    const avatar = await gravatar(email);

    try {
      // validation by email and username only one is allowed
      const user = await models.User.create({
        username,
        email,
        avatar,
        password: hashed
      });

      return jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    } catch (err) {
      console.log(err);

      throw new Error('Error creating account');
    }
  },
  signIn: async (parent, { username, email, password }, { models }) => {
    if (email) {
      email = email.trim().toLowerCase();
    }

    // find by email or username
    const user = await models.User.findOne({
      $or: [{ email }, { username }]
    });

    // if no user is found throw an authentication error
    if (!user) {
      throw new AuthenticationError('Error signing in');
    }

    // if the password dont match throw an authentication error
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      throw new AuthenticationError('Error signing in (password)');
    }

    // create and return the json web token
    return jwt.sign({ id: user._id }, process.env.JWT_SECRET);
  },
  toggleFavorite: async (parent, { id }, { module, user }) => {
    // if no user context is passed, throw auth error
    if (!user) {
      throw new AuthenticationError('You need to be authenticated first.');
    }

    // check to see if the user has already favorited the note
    let noteCheck = await models.Note.findById(id);
    const hasUser = noteCheck.favoritedBy.indexOf(user.id);
    console.log(hasUser);
    // if the user exists in the list
    // pull the from the list and reduce the favoriteCount by 1
    if (hasUser >= 0) {
      return await models.Note.findByIdAndUpdate(
        id,
        {
          $pull: {
            favoritedBy: mongoose.Types.ObjectId(user.id)
          },
          $inc: {
            favoriteCount: -1
          }
        },
        {
          // set new to true to return the update doc
          new: true
        }
      );
    } else {
      // if the user doesnt exist in the list add them to the list and increment the favoriteCount by 1
      return await models.Note.findByIdAndUpdate(
        id,
        {
          $push: {
            favoritedBy: mongoose.Types.ObjectId(user.id)
          },
          $inc: {
            favoriteCount: 1
          }
        },
        {
          new: true
        }
      );
    }
  }
};

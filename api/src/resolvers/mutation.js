require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {
  AuthenticationError,
  ForbiddenError
} = require('apollo-server-express');
const gravatar = require('../util/gravatar');

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

    // fint by email or username
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
  }
};

// Require mongoose library
const mongoose = require('mongoose');

module.exports = {
  connect: DB_HOST => {
    // Use the mongo driver update url string parser
    mongoose.set('useNewUrlParser', true);

    // Use findOneAndUpdate() in place of findAndModify()
    mongoose.set('useFindAndModify', false);

    // Use createIndex()  in place of ensureIndex()
    mongoose.set('useCreateIndex', true);

    // Use the new server discovery and monitoring engine
    mongoose.set('useUnifiedTopology', true);

    // Connect to the DB
    mongoose.connect(DB_HOST);

    // Log an error if we fail to connect
    mongoose.connection.on('error', err => {
      console.log(err);
      console.log(
        'MongoDB connection error. Please make sure MongoDB is running'
      );
      process.exit();
    });

    mongoose.connection.on('success', success => {
      console.log('DB connected');
    });
  },
  close: () => {
    mongoose.connection.close();
  }
};

const MongoClient = require("mongodb").MongoClient;

let _connection = undefined;
let _db = undefined;

module.exports = async () => {
   if (!_connection) {
      _connection = await MongoClient.connect(`mongodb+srv://jason:${process.env.MONGO_ATLAS_API_KEY}@cluster0-jsdmw.mongodb.net/test?retryWrites=true&w=majority`, { useUnifiedTopology: true });
      _db = await _connection.db(`test`);
   }

   return _db;
};

module.exports.close = async () => {
   _connection.close();
};
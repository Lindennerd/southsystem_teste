const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')

const adapter = new FileSync('db.json')
const db = low(adapter)

const defaultUser = {
    "id": "vQAsYuKH",
    "userName": "default",
    "userPassword": "202cb962ac59075b964b07152d234b70",
    "userEmail": "default@default.com",
    "favoriteBooks": []
};

db.defaults({users: [], books: []}).write();

const users = db.get('users').value();

if(users.length === 0) {
    db.get('users')
      .push(defaultUser)
      .write();
}

module.exports = db;
const pool = require("./pool");

async function insertUser(firstName, lastName, username, password) {
  await pool.query("INSERT INTO users (first_name, last_name, username, password) VALUES ($1, $2, $3, $4)", [firstName, lastName, username, password]);

}

async function searchForUser(username) {
  const {rows} = await pool.query(`SELECT * FROM users WHERE username = $1`, [username]);
  return rows;
}

async function updateMembership(id, status) {
  await pool.query("UPDATE users SET membership_status = $1 WHERE id = $2", [status, id]);
}

async function searchForUserWithId(id) {
  const {rows} = await pool.query(`SELECT * FROM users WHERE id = $1`, [id]);
  return rows;
}

async function insertMessage(title, timestamp, message) {
  const {rows} = await pool.query("INSERT INTO messages (title, time_stamp, message_text) VALUES ($1, $2, $3) RETURNING id", [title, timestamp, message]);
  return rows;
};

async function connectMessageToAuthor(userid, messageid) {
  await pool.query("INSERT INTO message_author (user_id, message_id) VALUES ($1, $2)", [userid, messageid]);
};

async function updateAdminship(id, status) {
  await pool.query("UPDATE users SET admin = $1 WHERE id = $2", [status, id]);
}

async function getAllMessages() {
  const {rows} = await pool.query(`
    SELECT messages.id as id, 
    messages.title as title, 
    messages.time_stamp as time_stamp, 
    messages.message_text as message_text,
    users.first_name as first_name,
    users.last_name as last_name,
    users.username as username
    FROM messages
    JOIN message_author AS connection ON connection.message_id = messages.id
    JOIN users ON users.id = connection.user_id
    GROUP BY messages.id, messages.title, messages.time_stamp, messages.message_text,users.first_name,users.last_name,users.username;
  `);

  return rows;
}

async function deleteMessage(id) {
  await pool.query("DELETE FROM messages WHERE id = $1", [id]);
}


module.exports = {
  insertUser,
  searchForUser,
  updateMembership,
  searchForUserWithId,
  insertMessage,
  connectMessageToAuthor,
  getAllMessages,
  updateAdminship,
  deleteMessage
  };
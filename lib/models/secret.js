// secret.js
const environment = process.env.NODE_ENV || 'development';
const configuration = require('../../knexfile')[environment];
const database = require('knex')(configuration);

const create = (message) => {
  return database.raw(
    'INSERT INTO secrets (message, created_at) VALUES (?, ?) RETURNING id, message',
    [message, new Date]
  )
}

const show = (id) => {
  return database.raw("SELECT * FROM secrets WHERE id=?", [id])
}

const destroyAll = () => {
  return database.raw('TRUNCATE secrets RESTART IDENTITY')
}

module.exports = {
  create,
  destroyAll,
  show,
}

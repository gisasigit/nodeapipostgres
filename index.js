const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const db = require('./node_db_pg_api1')
const port = 3000

app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)

app.get('/', (request, response) => {
  response.json({ info: 'RestFull API Using Node.js, Express, and Postgres Database !' })
})
//TEST COMMIT

app.get('/users', db.getUsers)
app.get('/users/:id', db.getUserById)
app.post('/users', db.createUser)
app.put('/users/:id', db.updateUser)
app.delete('/users/:id', db.deleteUser)
app.get('/auth/:id',db.showUserPass)
app.get('/films/', db.getDataFilm)
app.get('/usercsv/:id', db.csvUserById)

app.listen(port, () => {
  console.log(`App running on port ${port}.`)
})
// test commit
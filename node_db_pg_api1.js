const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const Pool = require('pg').Pool
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: 'postgres',
  port: 5432,
})

const getUsers = (request, response) => {
  pool.query('SELECT * FROM users ORDER BY id ASC', (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const getUserById = (request, response) => {
  const id = parseInt(request.params.id)

  pool.query('SELECT id, name, email FROM users WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const createUser = (request, response) => {
  const { name, email } = request.body

  pool.query('INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *', [name, email], (error, results) => {
    if (error) {
      throw error
    } else if (!Array.isArray(results.rows) || results.rows.length < 1) {
    	throw error
    }
    response.status(201).send(`User added with ID: ${results.rows[0].id}`)
  })
}

const updateUser = (request, response) => {
  const id = parseInt(request.params.id)
  const { name, email } = request.body

  pool.query(
    'UPDATE users SET name = $1, email = $2 WHERE id = $3 RETURNING *',
    [name, email, id],
    (error, results) => {
      if (error) {
        throw error
      } 
      if (typeof results.rows == 'undefined') {
      	response.status(404).send(`Resource not found`);
      } else if (Array.isArray(results.rows) && results.rows.length < 1) {
      	response.status(404).send(`User not found`);
      } else {
  	 	  response.status(200).send(`User modified with ID: ${results.rows[0].id}`)         	
      }
      
    }
  )
}

const deleteUser = (request, response) => {
  const id = parseInt(request.params.id)

  pool.query('DELETE FROM users WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).send(`User deleted with ID: ${id}`)
  })
}

const showUserPass = (request, response) => {
  const id = request.params.id.toString();

  pool.query('SELECT id, username, password FROM users WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows)
   // response.status(200).send(`User Authentication CI: ${id}`);
  });
}

//tambahan
const getDataFilm = (request, response) => {
  pool.query('SELECT * FROM "basic_gsheet" ORDER BY nconst ASC', (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}
// ///////////////////////////
const path = require('path');

const csvUserById = (request, response) => {
  const id = parseInt(request.params.id);
  pool.query('SELECT id, name, email FROM users WHERE id = $1', [id],(error, results) => {
    if (error) {
      throw error;
    }

    const csvWriter = createCsvWriter({
      path: 'user.csv',
      header: [
        { id: 'id', title: 'ID' },
        { id: 'name', title: 'Name' },
        { id: 'email', title: 'Email' }
      ]
    });

    const data = results.rows;

    csvWriter.writeRecords(data)
      .then(() => {
        const filePath = path.resolve('user.csv');
        response.setHeader('Content-Type', 'text/csv');
        const fileName = `user_${id}.csv`;
        response.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
        response.sendFile(filePath);
      })
      .catch((error) => {
        console.error(error);
        response.status(500).json({ error: 'Internal Server Error' });
      });
  });
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  showUserPass,
  getDataFilm,
  csvUserById
}
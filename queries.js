const Pool = require('pg').Pool
const pool = new Pool({
    user: 'postgres',
    host: '127.0.0.1',
    database: 'api_db',
    password: 'abc123',
    port: 5432,
})

const getUsers = (request, response) => {
    pool.query('SELECT * FROM users ORDER BY id ASC', (error, results) => {
        if(error){
            throw error
        }
        response.status(200).json(results.rows)
    })
}

const getUserById = (request, response) => {
    const id = parseInt(request.params.id)
    pool.query('SELECT * FROM users WHERE id = $1',[id],(error, results) => {
        if(error){
            throw error
        }
        response.status(200).json(results.rows)
    })
}

const createuser = (request, response) => {
    const {name, email} = request.body
    pool.query('INSERT INTO users (name, email) VALUES ($1,$2)', [name,email],(error, results) => {
        if(error){
            throw error
        }
        response.status(201).json({message:"User đã được thêm thành công !"})
    })
}

const deleteuser = (request, response) => {
    const id = parseInt(request.params.id)
    pool.query('DELETE FROM users WHERE id = $1',[id],(error, results) => {
        if(error){
            throw error
        }
        response.status(201).json({message:"Đã xóa user ra khỏi dữ liệu"})
    })
}

module.exports = {
    getUsers,
    getUserById,
    createuser,
    deleteuser
}


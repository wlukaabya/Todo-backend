const pool = require('./db');
const express = require('express')
const cors = require('cors');

const app = express();

//middleware
app.use(express.json())
app.use(cors());


//database queries
//readtodos
async function readTodos(){
    try {
        const results =await pool.query('select * from todo')
        return results.rows
    } catch (error) {
        console.error(err)
    }
}
//createtodos
async function createTodo(todotext){
    try {
        await pool.query('insert into todo (description) values($1)',[todotext])
    } catch (err) {
        console.error(err)
    }
}
//deletetodos
async function deleteTodo(id){
console.log(id)
    try {
        await pool.query('delete from todo where todo_id = $1 RETURNING *',[id])
       // DELETE FROM links WHERE id IN (6,5)RETURNING *;
    } catch (err) {
        console.error(err)
    }
}

//connecting to web
app.get('/todos',async(req,res)=>{
    try {
        const rows = await readTodos();
        res.setHeader('content-type','application/json')
        res.send(JSON.stringify(rows))    
    } catch (err) {
        console.error(err)
    }
    
})

app.post('/todos',async (req,res)=>{
    try {
        const reqJson = req.body;
        await createTodo(reqJson.description)
        
    } catch (err) {
        console.error(err)
    }
})

app.delete('/todos',async(req,res)=>{
    try {
        const reqJson = req.body;
        await deleteTodo(reqJson.todo_id)
    } catch (err) {
        console.error(err)
    }
})


app.listen(3000,()=>{
    console.log('Web server listening on port 3000....')
})
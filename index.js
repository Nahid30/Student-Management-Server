const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;


app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jefy3.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


 async function run (){

        try{
            await client.connect();
            const studentCollection = client.db('student_management').collection('students');


            // GET 
            app.get('/student', async (req, res)=>{
                const query = {};
                const cursor = studentCollection.find(query);
                const students = await cursor.toArray();
                res.send(students);
            });


            // GET by particular id 
            app.get('/student/:id', async (req, res)=>{
                const id = req.params.id;
                const query = {_id: ObjectId(id)};
                const student = await studentCollection.findOne(query);
                res.send(student);
            });


            // POST 
            app.post('/student', async (req, res) => {
                const addNewStudent = req.body;
                const result = await studentCollection.insertOne(addNewStudent);
                res.send(result);
            }) 


            // PUT or UPDATE
            app.put('/student/:id', async (req, res)=>{
                const id = req.params.id;
                const updatedStudent = req.body;
                const filter = { _id: ObjectId(id)};
                const options = { upsert: true };
                const updatedDoc = {
                    $set : {...updatedStudent}
                };
                const result = await studentCollection.updateOne(filter, updatedDoc, options);
                res.send(result);
            })



            // DELETE 
            app.delete('/student/:id', async (req, res) => {
                const id = req.params.id;
                const query = { _id: ObjectId(id) };
                const resultDelete = await studentCollection.deleteOne(query);
                res.send(resultDelete);
    
            })

            // Heroku 


        }
        finally{
            // client.close();
        }



}
run().catch(console.dir);





app.get('/', (req, res) => {
  res.send('Hello Student Management')
})

app.listen(port, () => {
  console.log(`Student Management listening on port ${port}`)
});



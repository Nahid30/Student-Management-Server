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

            app.get('/student', async (req, res)=>{
                const query = {};
                const cursor = studentCollection.find(query);
                const students = await cursor.toArray();
                res.send(students);
            })


            // POST 
            app.post('/student', async (req, res) => {
                const addNewStudent = req.body;
                const result = await studentCollection.insertOne(addNewStudent);
                res.send(result);
            }) 

            // DELETE 
            app.delete('/student/:id', async (req, res) => {
                const id = req.params.id;
                const query = { _id: ObjectId(id) };
                const resultDelete = await studentCollection.deleteOne(query);
                res.send(resultDelete);
    
            })

            


        }
        finally{
            // client.close();
        }


}
run().catch(console.dir);


// client.connect(err => {
//   const collection = client.db("test").collection("devices");
//   // perform actions on the collection object
//   client.close();
// });





app.get('/', (req, res) => {
  res.send('Hello Student Management')
})

app.listen(port, () => {
  console.log(`Student Management listening on port ${port}`)
});



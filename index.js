const express = require('express')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors')
require('dotenv').config()
const app = express()
const port = process.env.PORT || 5000
app.use(cors());
app.use(express.json())
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.sdbmurj.mongodb.net/?retryWrites=true&w=majority`;
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        // await client.connect();
        const postJobCollection = client.db('Assignment11DB').collection('postJobData')
        const appJobCollection = client.db('Assignment11DB').collection('applyJobBd')
        // All Job Data
        app.get('/postobdata', async (req, res) => {
            const result = await postJobCollection.find().toArray()
            res.send(result)
        })
        app.get('/postobdata/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) }
            const result = await postJobCollection.findOne(query)
            res.send(result)
        })
        // job Update
        app.put('/postjob/:id', async (req, res) => {
            const id = req.params.id
            const updateJob = req.body
            const filter = { _id: new ObjectId(id) }
            const options = { upsert: true };
            const update = {
                $set: {
                    jobTitle: updateJob.jobTitle,
                    featuredImage: updateJob.featuredImage,
                    jobDescription: updateJob.jobDescription,
                    category: updateJob.category,
                    jobType: updateJob.jobType,
                    email: updateJob.email,
                    salaryType: updateJob.salaryType,
                    minSalary: updateJob.minSalary,
                    maxSalary: updateJob.maxSalary,
                    deadlineDate: updateJob.deadlineDate,
                    experience: updateJob.experience,
                }
            }
            const result = await postJobCollection.updateOne(filter, update, options)
            res.send(result)
        })
        // ApplyJOb status Update
        app.put('/updateStatus/:id', async (req, res) => {
            const id = req.params.id
            const updateStatus = req.body
            const filter = { _id: new ObjectId(id) }
            const options = { upsert: true };
            const update = {
                $set: {  
                    status: updateStatus.status,
                }
            }
            const result = await appJobCollection.updateOne(filter, update, options)
            res.send(result)
        })
        app.post('/postjob', async (req, res) => {
            const postJob = req.body;
            const result = postJobCollection.insertOne(postJob)
            res.send(result)
        })
        // My job delete api
        app.delete('/mypostdelete/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) }
            const result = await postJobCollection.deleteOne(query)
            res.send(result)
        })
        // my bid jobs
        app.get('/mybidsjob', async (req, res) => {
            var query = {}
            if (req.query?.email) {
                query = { email: req.query?.email }
            }
            const result = await appJobCollection.find(query).toArray()
            res.send(result)
        })
        app.delete('/mybidjobdelete/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) }
            const result = await appJobCollection.deleteOne(query)
            res.send(result)
        })
        // My post job get
        app.get('/mypostedjob', async (req, res) => {
            var query = {}
            if (req.query?.email) {
                query = { email: req.query?.email }
            }
            const result = await postJobCollection.find(query).toArray()
            res.send(result)
        })
        // Apply job 
        app.post('/applyjob', async (req, res) => {
            const applyJob = req.body;
            const result = await appJobCollection.insertOne(applyJob)
            res.send(result)
        })
        // All appliy job api
        app.get('/allapplyjob', async (req, res) => {
            const result = await appJobCollection.find().toArray()
            res.send(result)
        })
        // Send a ping to confirm a successful connection
        // await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir); 0
app.get('/', (req, res) => {
    res.send('Assignment11, Server is Runing')
})
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;
//middle wire
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.da9dr.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        console.log('Connected to database');
        const database = client.db('travelGo');
        const servicesCollection = database.collection('toursBookingServices');
        const ordersCollection = database.collection('toursBookingOrders');
        //get api

        app.get('/services', async (req, res) => {
            const cursor = servicesCollection.find({});
            const services = await cursor.toArray();
            res.send(services);
        });

        //post api for add service
        //post api
        app.post('/services', async (req, res) => {
            const service = req.body;
            console.log('Post hitted');
            const result = await servicesCollection.insertOne(service);
            console.log(result);
            res.send(result);
        });
        //booking post api dynamic
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const service = await servicesCollection.findOne(query);
            res.json(service);
        })
        //post api for add orders
        app.post('/orders', async (req, res) => {
            const orders = req.body;
            console.log(orders);
            const result = await ordersCollection.insertOne(orders);
            console.log(result);
            res.send(result);
        });
        //get api for orders
        app.get('/orders', async (req, res) => {
            const cursor = ordersCollection.find({});
            const orders = await cursor.toArray();
            res.send(orders);
        });
        //delete api

        //delete api
        app.delete('/orders/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await ordersCollection.deleteOne(query);
            res.json(result);
        });
        //update api
        app.put('/orders/:id', async (req, res) => {
            const id = req.params.id;
            const updateUser = "approved";
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    status: updateUser
                },
            };
            const result = await ordersCollection.updateOne(filter, updateDoc, options);

            res.send(result);
        })


    }
    finally {
        //await client.close();


    }
}
run().catch(console.dir);
app.get('/', (req, res) => {

    res.send('Running travel Server')

});

app.listen(port, () => {
    console.log('Running travel server on: ', port);
})
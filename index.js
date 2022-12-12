const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const port = process.env.PORT || 5000 ;
require('dotenv').config()

const app = express()

//middleware
app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.cpiv5.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
  try {
    await client.connect();
    console.log('db connect')

    const productCollection = client.db('vivoPhone').collection('Product');
    const productCollection2 = client.db('vivoPhone').collection('Product2');
    const productCollection3 = client.db('vivoPhone').collection('review');
    

    app.get('/product', async (req, res)=>{
   const query = {};
    const cursor = productCollection.find(query);
    const Product = await cursor.toArray();
    res.send(Product)

    })
    app.get('/product2', async (req, res)=>{
   const query = {};
    const cursor = productCollection2.find(query);
    const Product = await cursor.toArray();
    res.send(Product)

    })
    app.get('/review', async (req, res)=>{
   const query = {};
    const cursor = productCollection3.find(query);
    const Product = await cursor.toArray();
    res.send(Product)

    })
    //Update
    app.get('/product/:id', async (req, res) => {
      const id = req.params.id;
      console.log(id)
      const query = { _id: ObjectId(id) };
      const product = await productCollection.findOne(query);
      res.send(product);
  });
  
// Add
  app.put('/product/:id', async(req, res) =>{
    const id = req.params.id;
    const qty = req.body.restock
    console.log(qty)
    const filter = {_id:ObjectId(id)};
    const  product = await productCollection.findOne(filter)
    const quantity = qty ?  parseInt(product.quantity  ) + parseInt(qty) : product.quantity - 1
    const result = await productCollection.updateOne({ _id: ObjectId(id) }, { $set: { quantity: quantity } });
    res.send(result)
})

app.put('/deliver/:id', async (req, res) => {
  const id = req.params.id
  const newQuantity = req.body
  console.log(newQuantity);
  const deliver = newQuantity.quantity - 1
  const query = { _id: ObjectId(id) }
  const options = { upsert: true };
  const updateDoc = {
      $set: {
          quantity: deliver
      }
  }

  const result = await productCollection.updateOne(query, updateDoc, options)
  res.send(result);
})

  
// addItems
    app.post("/product/",async (req, res)=>{
      const newProduct = req.body;
      const result = await productCollection.insertOne(newProduct);
      res.send(result)
    })

    //Delete
    app.delete('/product/:id', async(req, res)=>{
      const id = req.params.id;
      console.log(id)
      const result = await productCollection.deleteOne({ _id: ObjectId(id) });
      res.send(result);
    })

  } finally {
    
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log('Listening to port', port);
})
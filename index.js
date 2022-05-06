const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion } = require('mongodb');
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
    app.post('/addItems', async (req, res)=>{
      const product = req.body;

      if(!product.name || !product.price){
        return res.send({success: false, error: "please provide all information"});
      }
      const result = await productCollection.insertOne(product); 
      res.send({success: true, messgea: 'Successfully insertednp'})     
    })


    //Delete
    app.delete('/product/:id', async(req, res)=>{
      const id = req.params.id;
      const query = {_id: Objectid(_id)};
      const result = await productCollection.deleteOne(query);
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
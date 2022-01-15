const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const fileUpload = require("express-fileupload");

const app = express();
const port = process.env.PORT || 4040;

app.use(cors());
app.use(express.json());
app.use(fileUpload());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.r9gms.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db("listingPro");
        const listingCollection = database.collection("listing");
        const categoryCollection = database.collection("category");

        // post category
        app.post('/addCategory', async (req, res) => {
            const result = await categoryCollection.insertOne(req.body);
            res.json(result);
        });

        // get category
        app.get('/category', async (req, res) => {
            const result = await categoryCollection.find({}).toArray();
            res.send(result);
        });

        // get listing
        app.get('/listing', async (req, res) => {
            const listing = await listingCollection.find({}).toArray();
            res.send(listing);
        });

        //  post addListing 
        app.post('/addListing', async (req, res) => {

            // console.log(req.body);
            // console.log(req.files);

            const title = req.body.title;
            const investment = req.body.investment;
            const minCash = req.body.minCash;
            const totalCash = req.body.totalCash;
            const description = req.body.description;
            const category = req.body.category;
            const location = req.body.location;
            const ListingImage = req.files.image;
            const banner1 = req.files.banner1;
            const banner2 = req.files.banner2;
            const banner3 = req.files.banner3;

            const picImg = ListingImage.data;
            const picData1 = banner1.data;
            const picData2 = banner2.data;
            const picData3 = banner3.data;
            const mainImg = picImg.toString("base64");
            const encodedPic1 = picData1.toString("base64");
            const encodedPic2 = picData2.toString("base64");
            const encodedPic3 = picData3.toString("base64");
            const image = Buffer.from(mainImg, "base64");
            const bannerImg1 = Buffer.from(encodedPic1, "base64");
            const bannerImg2 = Buffer.from(encodedPic2, "base64");
            const bannerImg3 = Buffer.from(encodedPic3, "base64");

            const listing = {
                title,
                investment,
                totalCash,
                minCash,
                description,
                category,
                location,
                image,
                bannerImg1,
                bannerImg2,
                bannerImg3,
            };
            console.log(listing);

            const result = await listingCollection.insertOne(listing);
            res.send(result);
        });



    }
    finally {

    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})
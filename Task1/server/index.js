const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
// const fetch = require("node-fetch"); // Ensure node-fetch is installed
const app = express();

app.use(express.json());
app.use(cors());

mongoose.connect("mongodb://127.0.0.1:27017/task1", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const quoteSchema = new mongoose.Schema({
    q: String,
    a: String,
    c: String,
    h: String
});

const Quote = mongoose.model('Quote', quoteSchema);

app.post('/quote', async (req, res) => {
    try {
        const response = await fetch('https://zenquotes.io/api/quotes');
        const quotes = await response.json();
        // console.log(quotes);
        const result = await Quote.insertMany(quotes);
        res.send(result);
    } catch (err) {
        console.error(err);
        res.status(500).send(err);
    }
});

app.post('/author',async (req,res)=>{
    const {author}=req.body;
    try {
       
        const quotes = await Quote.find({ a: author });

        if (quotes.length > 0) {
            
            res.json(quotes);
        } else {
             res.status(404).json({ message: 'No quotes found for the given author' });
        }
    } catch (err) {
        res.status(500).send(err);
    }
})

app.post("/random",async (req,res)=>{
    try {
        const randomQuote = await Quote.aggregate([{ $sample: { size: 1 } }]);
        if (randomQuote.length > 0) {
          res.json(randomQuote[0]);
        } else {
          res.status(404).json({ message: 'No quotes found' });
        }
      } catch (err) {
        console.error(err);
        res.status(500).send(err);
      }
})

app.listen(3001, () => {
    console.log("Server running successfully on port 3001!");
});

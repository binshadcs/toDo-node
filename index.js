import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = 3000;
let list = [];


app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: true }));

app.post("/add", (req, res) => {
    
    list.push(req.body['text']);
    let data = { list : list }
    res.render("index.ejs", data);
})

app.get('/', (req, res)=> {
    res.render("index.ejs");
})

app.listen(port, ()=> {
    console.log(`Running server at port ${port}`);
});
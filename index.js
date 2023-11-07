import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

const db = new pg.Client({
  user:"postgres",
  host:"localhost",
  database:"permalist",
  password:"",
  port:5432
})

db.connect(); // Important one , i missed twice 

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let items = [];
async function getItem(){
  try{
    const result = await db.query("SELECT * FROM item;");
    items = result.rows
    return items
  }catch(err){
    console.log(err);
  }
}
app.get("/", async(req, res) => {
  await getItem()
  res.render("index.ejs", {
    listTitle: "Today",
    listItems: items,
  });
});

app.post("/add", async(req, res) => {
  const item = req.body.newItem;
  if(item==""){
    await getItem()
    res.render("index.ejs",{
      listTitle: "Today",
      listItems: items,
      error : "Please enter Item"
    });
  }else{
    try{
      await db.query("INSERT INTO item(title) VALUES($1)", [item])
      res.redirect("/");
    }catch(err){
      console.log(err);
    }
  }

});

app.post("/edit", async(req, res) => {
  const id = req.body.updatedItemId;
  const title = req.body.updatedItemTitle;
  try{
    await db.query("UPDATE item SET title=$1 WHERE id=$2",[title, id]);
    res.redirect("/");
  }catch(err){
    console.log(err);
  }
});

app.post("/delete", async(req, res) => {
  const id = req.body.deleteItemId;
  try{
    await db.query("DELETE FROM item WHERE id = $1;",[id]);
    res.redirect("/");
  }catch(err){
    console.log(err);
    res.redirect("/");
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

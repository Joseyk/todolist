/* This is a Node.js application that uses the Express framework and Mongoose library to create a to-do
list web application. It connects to a MongoDB database and defines a schema for items and lists. It
has routes for displaying and adding items to the list, deleting items, and creating new lists. It
also has a route for an about page. The application listens on port 5000 for incoming requests. */
require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const mongoose=require ('mongoose')
const _=require('lodash')
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
mongoose.connect(`mongodb+srv://yosephk:${process.env.PASSWORD}@cluster0.xoj5fzx.mongodb.net/todolistDB`);
const itemSchema=new mongoose.Schema({
  name:String
})
const Item=mongoose.model('item',itemSchema);
const item_1=new Item({
  name:'food'
});
const item_2=new Item({
  name:'movie'
})
const item_3=new Item({
  name:'work'
})
const itemArray=[item_1,item_2,item_3];
const listSchema={
  name:String,
  items:[itemSchema]
}
const List=mongoose.model('list',listSchema)
app.get("/", function (req, res) {
  
  async function find(){
    let result=await Item.find()
    var newResult=result;
   if(newResult.length ===0){
    Item.insertMany(itemArray)
    res.redirect('/')
  }else{
    res.render("list", { title: 'Today', items: newResult});
  }}
  find()
});

app.post("/", function (req, res) {
  const itemName = req.body.newItem;
  const listName=req.body.list; 
  const item=new Item({
    name:itemName
  })
  if(listName==='Today'){
    item.save();
    res.redirect('/')
  }else{
    async function find1(){
      let findResult=await List.findOne({name:listName})
      findResult.items.push(item)
      findResult.save()
      res.redirect('/'+listName)
    }
  find1()
  }

 
});
app.post('/delete',function(req,res){
  const checkedItemId=req.body.checkbox;
  const listName=req.body.listName;
   async function idRemove(){
    let itemId=await Item.findByIdAndRemove(checkedItemId)
   }
    if(listName==='Today'){
    idRemove()
  res.redirect('/')
  }else{
      async function idremove(){
        let itemid=await List.findOneAndUpdate({name:listName},{$pull:{items:{_id:checkedItemId}}})
      }
      idremove()
      res.redirect('/'+listName)
  }
})
app.get('/:new',function(req,res){
 const newRout=_.capitalize(req.params.new);
 const list=new List({
  name:newRout,
  items:itemArray
 })
 async function checkList(){
  let checkedList=await List.findOne({name:newRout})
    if(!checkedList){  
  list.save()
  res.redirect('/'+newRout)
    }else{
    res.render('list',{title: checkedList.name, items: checkedList.items})
 }}
checkList()
})


app.get("/about", function (req, res) {
  res.render("about");
});
const PORT=process.env.PORT||5000;
app.listen(PORT, function () {
  console.log("server is running on port 5000");
});

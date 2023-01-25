const { default: mongoose } = require('mongoose');
// const moongose = require('mongoose');
const mongoURI = "mongodb://localhost:27017/inotes";

mongoose.set("strictQuery", true);
const connectToMongo = ()=> {
    mongoose.connect(mongoURI, ()=>{
        console.log("Connection to Mongo is successed");
    })
}

module.exports = connectToMongo
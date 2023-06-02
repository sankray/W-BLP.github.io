const {mongoose, ObjectId} = require('mongoose');
const MONGO_CONNECTION_STRING = process.env.MONGO_CONNECTION_STRING

mongoose.set('strictQuery', false);

module.exports = () =>{
    const connection = mongoose.connect(MONGO_CONNECTION_STRING,{
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
    mongoose.connection.once('open',()=>{
        console.log('connected to database');
    }).on('error',((error)=>console.log(error)));
}

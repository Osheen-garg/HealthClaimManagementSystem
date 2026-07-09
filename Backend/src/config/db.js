const mongoose=require('mongoose');


async function ConnectDb(){
    try{
        await mongoose.connect(process.env.MONGO_URI);

        console.log("Connected to Database Successfully");
    }
    catch(err){
         console.log("Could not able to connect the Db "+err);
    }
}

module.exports=ConnectDb

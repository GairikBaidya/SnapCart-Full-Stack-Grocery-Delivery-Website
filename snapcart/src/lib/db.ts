//express
//step-1 connectDb function
//step2  mongoose.connect('mongodburl')

import { connect } from "mongoose"

const mongodbUrl=process.env.MONGODB_URL!
if(!mongodbUrl){
console.log("mongo db not found")
}

let cached=global.mongoose

if(!cached){
    cached=global.mongoose={conn:null,promise:null}
}

const connectDb=async ()=>{
if(cached.conn){
    return cached.conn
}

if(!cached.promise){
    cached.promise = connect(mongodbUrl).then((c)=>c.connection)
}

try {
    cached.conn=await cached.promise
} catch (error) {
    throw error
}

return cached.conn
}

export default connectDb
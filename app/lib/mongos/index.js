import { MongoClient } from "mongodb";

const URI = process.env.MONGODB_URI
const options = {}

if(!URI) throw new Error('Please add your URI to .env.local file')

let client = new MongoClient(URI, options)
let clientPromise

if(process.env.NODE_ENV !== 'production'){
    if(!global._mongoClientPromice){
        global._mongoClientPromice = client.connect()
    }

    clientPromise = global._mongoClientPromice
} else {
    clientPromise = client.connect()
}

export default clientPromise
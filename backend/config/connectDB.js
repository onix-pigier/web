import mongoose from 'mongoose'
import dotenv from 'dotenv'
dotenv.config()

if (!process.env.MONGO_URL){
    throw new Error (
        "svp fournissez MONGO_URL dans le fichier .env"
    )
}
async function connectDB (){
    try {
        await mongoose.connect(process.env.MONGO_URL)
        console.log("DB conectéé")
    } catch (error) {
        console.log("Erreur de connexion à Mongo", error)
        process.exit(1)
    }
}

export default connectDB;
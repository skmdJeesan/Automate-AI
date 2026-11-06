import mongoose from "mongoose"

const connect_db = async () => {
  try {
    const mongo_uri = process.env.MONGO_URI
    if(!mongo_uri) {
      console.log(`could not find mongo uri`)
      return
    }
    await mongoose.connect(mongo_uri)
    console.log(`mongo db connected`)
  } catch (error) {
    console.log(`error occured while conecting to db!`)
  }
}

export default connect_db
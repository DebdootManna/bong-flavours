import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/bong-flavours'

interface CachedMongoose {
  conn: typeof mongoose | null
  promise: Promise<typeof mongoose> | null
}

declare global {
  var mongoose: CachedMongoose | undefined
}

let cached = globalThis.mongoose

if (!cached) {
  cached = globalThis.mongoose = { conn: null, promise: null }
}

async function dbConnect() {
  if (cached?.conn) {
    return cached.conn
  }
  if (!cached?.promise) {
    const opts = {
      bufferCommands: false,
    }
    if (cached) {
      cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
        return mongoose
      })
    }
  }
  
  try {
    if (cached?.promise) {
      cached.conn = await cached.promise
    }
  } catch (e) {
    if (cached) {
      cached.promise = null
    }
    throw e
  }

  return cached?.conn || null
}

export default dbConnect

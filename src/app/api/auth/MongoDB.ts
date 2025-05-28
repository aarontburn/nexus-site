import mongoose from "mongoose";

const { MONGODB_URI } = process.env 

if (!MONGODB_URI) {
    throw new Error("Please define the MONGODB_URI environment variable");
}

let cached = (global as any).mongoose || { conn: null, promise: null };

export async function connectDB() {
    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        cached.promise = mongoose.connect(MONGODB_URI as string, {
            bufferCommands: false,
        }).then((mongoose) => {
            return mongoose;
        });
    }

    cached.conn = await cached.promise;
    (global as any).mongoose = cached;

    return cached.conn;
}

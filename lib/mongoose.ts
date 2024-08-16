import mongoose from "mongoose";

let isConnected: boolean = false;

export const connectToDatabase = async () => {
    mongoose.set("strictQuery", true);

    if (!process.env.MONGODB_URL)
        return console.log("Missing MongoDB URL.. please check");

    if (isConnected) return console.log("already connected to MongoDB");

    try {
        await mongoose.connect(process.env.MONGODB_URL, {
            dbName: "CodeOverflow",
        });

        isConnected = true;

        console.log("successfully connected to MongoDB");
    } catch (error) {
        console.log("connection to MongoDB failed", error);
    }
};

import mongoose from "mongoose";
mongoose.set("strictQuery", true);

const connectDb = async () => {
    try {
        const connect = await mongoose.connect(
            "mongodb://localhost:27017/passport_basic"
        );
        console.log(`connected to server at ${connect.connection.host}`);
    } catch (error) {
        console.log(error);
    }
};

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String
    },
    name : {
        type: String
    }
})

export const User =  mongoose.model("User", UserSchema)
export {connectDb};

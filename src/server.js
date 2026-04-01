import app from "./app.js";
import connectToMongoDB from "./common/config/db.js";
import dotenv from "dotenv";
dotenv.config();

await connectToMongoDB();

app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
})


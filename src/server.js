require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const session = require("express-session");
const LoadModels = require("./models/LoadModels");

(async () => {

    const app = express();
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(cors({
        origin: "http://localhost",
        credentials: true
    }));
    app.use(session({
        // store: redis
        name: "sid",
        secret: process.env.SESSION_SECRET || "MYSESSIONSECRET123ABC",
        resave: false,
        saveUninitialized: false,
        cookie: {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 1000 * 60 * 60 * 24 * 7 * 365 // 7 years
        }
    }));

    /**
     * Connect to MongoDB
     */
    try{
        await mongoose.connect(process.env.MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        console.log("Connected to MongoDB");
    } catch (e) {
        console.error(e);
        process.exit();
    }

    /**
     * Load the models in
     */
    await LoadModels();

    /**
     * Declare all the routes heres
     */
    app.use("/auth", require("./routes/auth"));
    app.use("/category", require("./routes/category"));

    /**
     * Begin listening
     */
    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () => console.log(`Server started on http://localhost:${PORT}`));

})();
import express from 'express';
import dotenv from 'dotenv';
import { initDB } from './config/db.js';
import rateLimiter from './middleware/rateLimiter.js'
import transactionsRoutes from "./routes/transactionsRoute.js"

// dotenv pkg configuration
dotenv.config();

// app instance created 
const app = express();

// middleware -> use to parse incoming json payloads from http req like POST,PUT,PATCH
app.use(rateLimiter)
app.use(express.json())

// our custom simple middlewares
// app.use((req, res, next) => {
//     console.log("This will run first! ")
//     next();
// })

const PORT = process.env.PORT || 5001;





app.use("/api/transactions", transactionsRoutes)

initDB().then(() => {
    // listening to port only if db is initialized
    app.listen(PORT, () => {
        console.log(`Server is up and running on port:http://localhost:${PORT}`)
    })
})
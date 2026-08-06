import dns from 'dns';
dns.setServers(['8.8.8.8', '8.8.4.4']);

import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import connectDB from './config/mongodb.js';
import router from './routes/userRoutes.js';

const app = express()
const PORT = process.env.PORT || 4000

connectDB()

app.use(cors(), express.json());

app.use('/api/user', router)

app.get('/', (req, res) => {
    res.send('API working.')
})

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
const connectDB = require("./src/config/db");


// Load environment variables
require('dotenv').config();

// Connect to MongoDB
connectDB();

const app = require('./src/app');
const PORT = process.env.PORT || 3000;

if(!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET belum didefinisikan pada file .env');
}

app.listen(PORT, () => {
    console.log(`Server berjalan pada http://localhost:${PORT}`);
});
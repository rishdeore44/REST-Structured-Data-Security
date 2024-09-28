const mongoose = require('mongoose');
//brew services stop mongodb/brew/mongodb-community@5.0 
//bre services list
const connectDB = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/keyValueStore', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            // useCreateIndex: true
        });
        console.log('MongoDB connected');
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
};

module.exports = connectDB;

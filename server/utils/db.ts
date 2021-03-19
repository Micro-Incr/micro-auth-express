import mongoose from 'mongoose';
import {DATABASE_URI} from '../config/baseConfig';

export default mongoose.connect(DATABASE_URI!, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true,
    }).then(() => {
        console.log('Connected to the database');
});

import moongose from 'mongoose';

export const connectDB = async () => {
    try {
        await moongose.connect('mongodb+srv://auth:auth@cluster0.zpabqui.mongodb.net/auth?retryWrites=true&w=majority')
        console.log('>>> DB IS CONNECTED');
    } catch (error) {
        console.log(error);
    }
}
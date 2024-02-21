import mongoose from "mongoose";

const cartsCollection = 'carts';

const cartsSchema = new mongoose.Schema({
    products: [
        {
            quantity: { type: Number, default: 1}
        }
    ],
    userId: {
        type: Number
    }
});

export const cartsModel = mongoose.model(cartsCollection, cartsSchema)
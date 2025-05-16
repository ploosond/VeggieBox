import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            unique: true,
            required: true,
        },
        description: {
            type: Array,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        offerPrice: {
            type: Number,
            required: true,
        },
        image: {
            type: Array,
            required: true,
        },
        category: {
            type: String,
            required: true,
        },
        inStock: {
            type: Boolean,
            default: true,
        },
    },
    {timestamps: true}
);

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);
// Product.syncIndexes();

export default Product;
import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: {type: String, required: true},
    description: {type: Array, required: true},
    price: {type: Number, required: true},
    offerPrice: {type: Number, required: true},
    image: {type: Array, required: true},
    category: {type: String, required: true},
    inStock: {type: Boolean, default: true},
}, {timestamps: true})

//Khởi tạo model có tên là Product từ schema productSchema
// Nếu model đã tồn tại thì sử dụng model đó, nếu không thì tạo mới
const Product = mongoose.models.product|| mongoose.model('product', productSchema)

export default Product;

import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    cartItems: {type: Object, default: {}},
}, {minimize: false})

//Khởi tạo model có tên là User từ schema userSchema
// Nếu model đã tồn tại thì sử dụng model đó, nếu không thì tạo mới
const User = mongoose.models.user|| mongoose.model('user', userSchema)

export default User;

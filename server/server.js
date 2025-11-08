
import cookieParser from 'cookie-parser'; // Đọc cookie từ request của client
import express from 'express';
import cors from 'cors';//Cho phép các frontend ở domain khác (port khác) được gọi đến API này
import connectDB from './configs/db.js';
import 'dotenv/config';
import userRouter from './routes/userRoute.js';
import sellerRouter from './routes/sellerRoute.js';
import connectCloudinary from './configs/cloudinary.js';
import productRouter from './routes/productRoute.js';
import cartRouter from './routes/cartRoute.js';
import addressRouter from './routes/addressRoute.js';
import orderRouter from './routes/orderRoute.js';
import { stripeWebhooks } from './controllers/orderController.js';

// Khởi tạo app Express -> Kết nối vs MongoDB -> Cấu hình/ Cài middleware -> Cho phép CORS-> Tạo các route test-> Lắng nghe cổng (bật server)
// Tạo app và xác định cổng chạy server
const app = express();
const port = process.env.PORT || 4000;

await connectDB()
await connectCloudinary()

//Allow multiple origins
const allowedOrigins = ['http://localhost:5173', 'https://greencart-rho-two.vercel.app/']; //cho phép frontend gọi API

app.post('/stripe', express.raw({type:'application/json'}), stripeWebhooks)

// Middleware configuration
app.use(express.json()); //Tự động phân tích (Parse body JSON) dữ liệu JSON từ request body mà client gửi lên
app.use(cookieParser()); //Đoc cookie từ client
//Cấu hình CORS đúng cách
app.use(cors({
    origin: allowedOrigins, 
    credentials:true}));//cho phép frontend gọi API và gửi cookie từ client

//Test API
app.get('/', (req, res) => res.send("API is Working"));
app.use('/api/user', userRouter)
app.use('/api/seller', sellerRouter)
app.use('/api/product', productRouter)
app.use('/api/cart', cartRouter)
app.use('/api/address', addressRouter)
app.use('/api/order', orderRouter)

// Lắng nghe cổng => Khởi động server
app.listen(port, ()=>{
    console.log(`Server is running on http://localhost:${port}`)
})


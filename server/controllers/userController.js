import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Register User : /api/user/register
// Nhận thông tin từ client (name, email, password)
// 1. Kiểm tra xem người dùng đã tồn tại chưa
// 2. Mã hóa mật khẩu
// 3. Tạo người dùng trong MongoDB
// 4. Tạo JWT token → gửi về client qua cookie
// 5. Trả về kết quả thành công    

//Định nghĩa hàm đăng ký người dùng
// Hàm này sẽ được gọi khi người dùng gửi yêu cầu đăng ký
export const register = async (req, res) => {
    try {
        const {name, email, password} = req.body;

        if(!name || !email || !password){
            return res.json({success: false, message: 'Missing Details'})
        }
        // Kiểm tra xem người dùng đã tồn tại chưa
        // Sử dụng phương thức findOne của mô hình User để tìm người dùng theo email
        const existingUser = await User.findOne({email})
        if(existingUser) // Nếu người dùng đã tồn tại
            // Trả về thông báo lỗi cho client
             return res.json({success: false, message: 'User already exists'})

        // Mã hóa mật khẩu
       const hashedPassword = await bcrypt.hash(password, 10)

        // Tạo người dùng trong MongoDB
        // Sử dụng phương thức create của mô hình User để tạo người dùng mới
        const user = await User.create({name, email, password: hashedPassword})

        // Tạo JWT token
        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: '7d'});

        // Gửi token về client qua cookie
        // Sử dụng res.cookie để thiết lập cookie với token
        res.cookie('token', token, {
            httpOnly: true, // Prevents JavaScript access to the cookie
            secure: false,
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000 // Cookie expiration time
        })

        // Trả về kết quả thành công cho client
        return res.json({success: true, token, user: {email: user.email, name: user.name}})
    } catch (error) {
        // Trả về thông báo với nội dung lỗi nếu có lỗi xảy ra
        console.log(error.message)
        res.json({success: false, message: error.message})
    }
}

//Login User: /api/user/login

export const login = async (req, res) => {
    try {
        const {email, password} = req.body;
        // Kiểm tra xem email và mật khẩu có được cung cấp không
        if(!email || !password)
            return res.json({success: false, message: 'Email and password are required'})
        // Tìm người dùng trong MongoDB theo email
        const user = await User.findOne({email});
        // Nếu không tìm thấy người dùng, trả về thông báo lỗi
        if(!user){
            return res.json({success: false, message: 'Invalid email or password'})
        }
        // So sánh mật khẩu đã mã hóa với mật khẩu người dùng cung cấp
        // Sử dụng bcrypt để so sánh mật khẩu
        const isMatch = await bcrypt.compare(password, user.password);
        // Nếu mật khẩu không khớp, trả về thông báo lỗi
        if(!isMatch){
            return res.json({success: false, message: 'Invalid email or password'})
        }
       
         // Tạo JWT token
        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: '7d'});

        // Gửi token về client qua cookie
        // Sử dụng res.cookie để thiết lập cookie với token
        res.cookie('token', token, {
            httpOnly: true, // Prevents JavaScript access to the cookie
            secure: false, // Use secure cookies in production
            sameSite:'lax', // CSRF protection
            maxAge: 7 * 24 * 60 * 60 * 1000, // Cookie expiration time
        })

        // Trả về kết quả thành công cho client
        return res.json({success: true, token, user: {email: user.email, name: user.name}})
    
    } catch (error) {
         // Trả về thông báo với nội dung lỗi nếu có lỗi xảy ra
        console.log(error.message)
        res.json({success: false, message: error.message})
    }
}

// Check Auth: /api/user/is-auth
export const isAuth = async (req, res) => {
    try {
        // Lấy userId từ req.body
        // Đây là ID người dùng đã được xác thực thông qua middleware authUser
        const userId = req.user._id;
        // Tìm người dùng trong MongoDB theo userId
        // Sử dụng phương thức findById của mô hình User để tìm người dùng
        const user = await User.findById(userId).select("-password")
        // Nếu không tìm thấy người dùng, trả về thông báo lỗi
        if(!user){
            return res.json({success: false, message: 'User not found'})
        }
        // Trả về kết quả thành công cho client
        // Trả về thông tin người dùng mà không bao gồm mật khẩu
        return res.json({success: true, user})

    } catch (error) {
        console.log(error.message)
        res.json({success: false, message: error.message})
    }
}

// Logout User: /api/user/logout
export const logout = async (req, res) => {
    try {
        // Xóa cookie 'token' để đăng xuất người dùng
        res.clearCookie('token', {
            // Thiết lập các tùy chọn cho cookie
            httpOnly: true,
            // Chỉ sử dụng cookie an toàn trong môi trường sản xuất
            secure: false,
            // Thiết lập SameSite để bảo vệ chống CSRF
            sameSite: 'lax'
        });
        // Trả về kết quả thành công cho client
        return res.json({success: true, message: 'Logout Out'})
    } catch (error) {
        console.log(error.message)
        res.json({success: false, message: error.message})
    }
}

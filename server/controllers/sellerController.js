import jwt from "jsonwebtoken";

//Login Seller: /api/seller/login
export const sellerLogin = async (req, res) => {
   try {
     const {email, password} = req.body;

    if(password == process.env.SELLER_PASSWORD && email === process.env.SELLER_EMAIL){
        const token = jwt.sign({email}, process.env.JWT_SECRET, {expiresIn: '7d'});

        // Gửi token về client qua cookie
        res.cookie('sellerToken', token, {
            httpOnly: true, // Prevents JavaScript access to the cookie
            secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
            sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'strict', // CSRF protection
            maxAge: 7 * 24 * 60 * 60 * 1000, // Cookie expiration time
        });

        return res.json({success: true, message: "Logged In"});
    } else {
        return res.json({success: false, message: "Invalid Credentials"});
    }
   } catch (error) {
       console.log(error.message);
       return res.json({success: false, message: error.message});
   }
}

// Seller isAuth: /api/seller/is-auth
export const isSellerAuth = async (req, res) => {
    try {
        return res.json({success: true})
    } catch (error) {
        console.log(error.message)
        res.json({success: false, message: error.message})
    }
}

// Logout Seller: /api/seller/logout
export const sellerLogout = async (req, res) => {
    try {
        // Xóa cookie 'sellerToken' để đăng xuất người dùng
        res.clearCookie('sellerToken', {
            // Thiết lập các tùy chọn cho cookie
            httpOnly: true,
            // Chỉ sử dụng cookie an toàn trong môi trường sản xuất
            secure: false,
            // Thiết lập SameSite để bảo vệ chống CSRF
            sameSite: 'lax',
        });
        // Trả về kết quả thành công cho client
        return res.json({success: true, message: 'Logout Out'})
    } catch (error) {
        console.log(error.message)
        res.json({success: false, message: error.message})
    }
}

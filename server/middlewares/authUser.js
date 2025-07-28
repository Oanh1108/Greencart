import jwt from "jsonwebtoken";
import User from "../models/User.js"; // cần import model

const authUser = async (req, res, next) => {
    let token = req.cookies.token;

    // Nếu không có token trong cookie, thử lấy từ header
    if (!token) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return res.status(401).json({ success: false, message: 'Not Authorized - No token' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(401).json({ success: false, message: 'User not found' });
        }
        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({ success: false, message: 'Invalid token' });
    }
};

export default authUser;

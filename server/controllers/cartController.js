import User from "../models/User.js";

//Update User CartData: /api/cart/update
export const updateCart = async (req, res) => {
    try {
        const userId = req.user._id; // đã có user từ middleware

        const { cartItems } = req.body;

        await User.findByIdAndUpdate(userId, { cartItems });

        res.json({ success: true, message: "Cart Updated" });
    } catch (error) {
        console.log("Update cart error:", error.message);
        res.json({ success: false, message: error.message });
    }
};

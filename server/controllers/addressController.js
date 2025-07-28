import Address from "../models/Address.js";
import User from "../models/User.js";

// Add Address: /api/address/add
export const addAddress = async (req, res) => {
    try {
        const userId = req.user._id; // lấy từ middleware
        const { address } = req.body;

        await Address.create({ ...address, userId }); //  lưu với userId

        res.json({ success: true, message: "Address added successfully" });
    } catch (error) {
        console.error(error.message);
        res.json({ success: false, message: error.message });
    }
};

// Get Address: /api/address/get
export const getAddress = async (req, res) => {
    try {
        const userId = req.user._id; // từ middleware authUser
        const address = await Address.find({ userId }); // lấy theo userId
        if (!address || address.length === 0) {
            return res.status(404).json({ success: false, message: "Address not found" });
        }

        res.json({ success: true, address });
    } catch (error) {
        res.status(500).json({ success: false, message: "Lỗi server", error: error.message });
    }
};



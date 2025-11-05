import Order from "../models/Order.js";
import Product from "../models/Product.js";
import stripe from "stripe";
import User from "../models/User.js"

//Place Order COD: /api/order/cod
// API xử lý đặt hàng với hình thức thanh toán khi nhận hàng (COD)
export const placeOrderCOD = async (req, res) => {
    try {
        const userId = req.user._id; //lấy từ middleware
        const { items, address } = req.body;

        if (!address || items.length === 0) {
            return res.json({ success: false, message: "Invalid data" });
        }

        let amount = 0;
        for (let item of items) {
            const product = await Product.findById(item.product);
            amount += product.offerPrice * item.quantity;
        }
        amount += Math.floor(amount * 0.02);

        await Order.create({
            userId,
            items,
            amount,
            address,
            paymentType: "COD",
        });

        return res.json({ success: true, message: "Order Placed Successfully" });
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
};


//Place Order Stripe: /api/order/stripe
// API xử lý đặt hàng với hình thức thanh toán khi nhận hàng (Stripe)
export const placeOrderStripe = async (req, res) => {
    try {
        const userId = req.user._id; //lấy từ middleware
        const { items, address } = req.body;
        const { origin } = req.headers;

        if (!address || items.length === 0) {
            return res.json({ success: false, message: "Invalid data" });
        }

        let productData = [];

        //Calculate Amount Using Items
        let amount = 0;
        for (let item of items) {
            const product = await Product.findById(item.product);
            productData.push({
                name: product.name,
                price: product.offerPrice,
                quantity: item.quantity,
            });
            amount += product.offerPrice * item.quantity;
        }
        //Add Tax Charge (2%)
        amount += Math.floor(amount * 0.02);

        const order = await Order.create({
            userId,
            items,
            amount,
            address,
            paymentType: "Online",
            isPaid: true, // Tạm thời đánh dấu đã thanh toán cho development
        });

        // Xóa giỏ hàng sau khi tạo đơn hàng thành công
        await User.findByIdAndUpdate(userId, { cartItems: {} });

        //Stripe Gateway Initialize
        const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);

        //Create line items for stripe
        const line_items = productData.map((item) => {
            return {
                price_data: {
                    currency: "usd",
                    product_data: {
                        name: item.name,
                    },
                    unit_amount: Math.floor(item.price + item.price * 0.02) * 100
                },
                quantity: item.quantity,
            }
        })

        //Create session
        const sesstion = await stripeInstance.checkout.sessions.create({
            line_items,
            mode: "payment",
            success_url: `${origin}/loader?next=my-orders`,
            cancel_url: `${origin}/cart`,
            metadata: {
                orderId: order._id.toString(),
                userId: userId.toString(),
            }
        })

        return res.json({ success: true, url: sesstion.url });
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
};

//Stripe Webhooks to Verify Payments Action: /stripe
export const stripeWebhooks = async (request, response) => {
    //Stripe Gateway Initialize
    const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);

    const sig = request.headers["stripe-signature"];
    let event;

    try {
        event = stripeInstance.webhooks.constructEvent(
            request.body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (error) {
        response.status(400).send(`Webhook Error: ${error.message}`)
    }

    //Handle the event
    switch (event.type) {
        case "checkout.session.completed": {
            const session = event.data.object;
            const { orderId, userId } = session.metadata;

            console.log('✅ Payment completed for order:', orderId);

            //Mark Payment as Paid
            await Order.findByIdAndUpdate(orderId, { isPaid: true });
            //Clear user cart
            await User.findByIdAndUpdate(userId, { cartItems: {} });
            break;
        };
        case "payment_intent.succeeded": {
            const paymentIntent = event.data.object;
            const paymentIntentId = paymentIntent.id;

            //Getting Session Metadata
            const sessions = await stripeInstance.checkout.sessions.list({
                payment_intent: paymentIntentId,
            });

            if (sessions.data.length > 0) {
                const { orderId, userId } = sessions.data[0].metadata;
                console.log('✅ Payment intent succeeded for order:', orderId);

                //Mark Payment as Paid
                await Order.findByIdAndUpdate(orderId, { isPaid: true });
                //Clear user cart
                await User.findByIdAndUpdate(userId, { cartItems: {} });
            }
            break;
        };
        case "payment_intent.failed": {
            const paymentIntent = event.data.object;
            const paymentIntentId = paymentIntent.id;

            //Getting Session Metadata
            const sessions = await stripeInstance.checkout.sessions.list({
                payment_intent: paymentIntentId,
            });

            if (sessions.data.length > 0) {
                const { orderId } = sessions.data[0].metadata;
                console.log('❌ Payment failed for order:', orderId);
                await Order.findByIdAndDelete(orderId);
            }
            break;
        }

        default:
            console.error(`Unhandled event type ${event.type}`)
            break;
    }
    response.json({ received: true })
}

//Get Orders by User ID: /api/order/user
//API lấy danh sách đơn hàng của người dùng (theo userId)
export const getUserOrders = async (req, res) => {
    try {
        const userId = req.user._id;

        // Debug: Lấy tất cả đơn hàng của user để kiểm tra
        const allOrders = await Order.find({ userId }).populate("items.product").sort({ createdAt: -1 });
        console.log('All orders for user:', allOrders.map(order => ({
            id: order._id,
            paymentType: order.paymentType,
            isPaid: order.isPaid,
            amount: order.amount
        })));

        // Lấy đơn hàng theo điều kiện: COD hoặc đã thanh toán online
        const orders = await Order.find({
            userId,
            $or: [
                { paymentType: "COD" },
                { paymentType: "Online", isPaid: true }
            ]
        }).populate("items.product").sort({ createdAt: -1 });

        return res.json({ success: true, orders });
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
}

//Get All Orders (for seller / admin) : /api/order/seller
//API dành cho quản trị viên để xem tất cả đươn hàng ( chỉ đơn đã thanh toán hoặc COD)
export const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find({
            $or: [{ paymentType: "COD" }, { isPaid: true }]
        }).populate("items.product address").sort({ createdAt: -1 });
        return res.json({ success: true, orders });
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
}


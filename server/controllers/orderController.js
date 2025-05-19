import Order from '../models/order.js';
import Product from '../models/product.js';
import stripe from 'stripe';
import User from '../models/user.js';

// Place Order COD : /api/order/cod

export const placeOrderCOD = async (req, res) => {
    try {
        const {userId} = req;
        const {items, address} = req.body;

        if (items.length === 0 || !address) {
            return res.json({success: false, message: 'Invalid data'});
        }

        let amount = await items.reduce(async (acc, item) => {
            const product = await Product.findById(item.product);
            return (await acc) + product.offerPrice * item.quantity;
        }, 0);

        amount += Math.floor(amount * 0.02);

        await Order.create({
            userId, items, amount, address, paymentType: 'COD'
        });
        return res.json({success: true, message: 'Order Placed Successfully'});
    } catch (error) {
        console.log(error.message);
        return res.json({success: false, message: error.message});
    }
};
// Place Order Stripe : /api/order/stripe

export const placeOrderStripe = async (req, res) => {
    try {
        const {userId} = req;
        const {items, address} = req.body;
        const {origin} = req.headers;

        if (items.length === 0 || !address) {
            return res.json({success: false, message: 'Invalid data'});
        }

        let productData = [];

        let amount = await items.reduce(async (acc, item) => {
            const product = await Product.findById(item.product);
            productData.push({
                name: product.name, price: product.offerPrice, quantity: item.quantity
            });
            return (await acc) + product.offerPrice * item.quantity;
        }, 0);

        amount += Math.floor(amount * 0.02);

        const order = await Order.create({
            userId, items, amount, address, paymentType: 'Online'
        });

        // Stripe Gateway Initialize
        const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);

        // Create line items for strip

        const line_items = productData.map(item => {
            return {
                price_data: {
                    currency: 'eur', product_data: {
                        name: item.name
                    }, unit_amount: Math.floor(item.price + item.price * 0.02) * 100
                }, quantity: item.quantity
            };
        });

        // Create session
        const session = await stripeInstance.checkout.sessions.create({
            line_items,
            mode: 'payment',
            success_url: `${origin}/loader?next=my-orders`,
            cancel_url: `${origin}/cart`,
            metadata: {
                orderId: order._id.toString(), userId
            }
        });

        console.log('order', order._id);
        console.log('toString', order._id.toString);

        return res.json({success: true, url: session.url});
    } catch (error) {
        console.log(error.message);
        return res.json({success: false, message: error.message});
    }
};

// Stripe WebHooks to Verify Payments Action : /stripe

export const stripeWebhooks = async (req, res) => {
// Stripe Gatewate Initialize
    const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);

    const signature = req.headers['stripe-signature'];
    let event;

    try {
        event = stripeInstance.webhooks.constructEvent(req.body, signature, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (error) {
        return res.status(400).send(`WebHook Error: ${error.message}`);
    }

//     Handle the event

    switch (event.type) {
        case 'payment_intent.succeeded': {
            const paymentIntent = event.data.object;
            const paymentIntentId = paymentIntent.id;

            //     Getting Session Metadata
            const session = await stripeInstance.checkout.sessions.list({
                payment_intent: paymentIntentId
            });

            const {orderId, userId} = session.data[0].metadata;

            //     Mark Payment as Paid

            await Order.findByIdAndUpdate(orderId, {isPaid: true});

            //     Clear User Cart
            await User.findByIdAndUpdate(userId, {cartItems: {}});

            break;
        }

        case 'payment_intent.payment_failed': {
            const paymentIntent = event.data.object;
            const paymentIntentId = paymentIntent.id;

            //     Getting Session Metadata
            const session = await stripeInstance.checkout.sessions.list({
                payment_intent: paymentIntentId
            });

            const {orderId} = session.data[0].metadata;

            await Order.findByIdAndDelete(orderId);

            break;
        }

        default:
            console.error(`Unhandled event type : ${event.type}`);
            break;
    }

    return res.json({received: true});

};

// Get Orders by User ID: /api/order/user

export const getUserOrders = async (req, res) => {
    try {
        const {userId} = req;
        const orders = await Order.find({
            userId, $or: [{paymentType: 'COD'}, {isPaid: true}]
        }).populate('items.product address').sort({createdAt: -1});
        return res.json({success: true, orders});
    } catch (error) {
        console.log(error.message);
        return res.json({success: false, message: error.message});
    }
};

// Get All Orders ( for seller / admin ) : /api/order/seller

export const getAllOrders = async (req, res) => {
    try {

        const orders = await Order.find({
            $or: [{paymentType: 'COD'}, {isPaid: true}]
        }).populate('items.product address').sort({createdAt: -1});
        return res.json({success: true, orders});
    } catch (error) {
        console.log(error.message);
        return res.json({success: false, message: error.message});
    }
};
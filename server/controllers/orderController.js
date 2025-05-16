// Place Order COD : /api/order/cod

import Product from '../models/product.js';
import Order from '../models/order.js';

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


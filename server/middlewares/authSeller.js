import jwt from 'jsonwebtoken';

const authSeller = async (req, res, next) => {
    const sellerCookie = req.cookies['seller-cookie'];

    if (!sellerCookie) {
        return res.json({success: false, message: 'Not Authorized'});
    }

    try {
        const tokenDecoded = jwt.verify(sellerCookie, process.env.JWT_SECRET);
        if (tokenDecoded.email === process.env.SELLER_EMAIL) {
            next();
        } else {
            return res.json({success: false, message: 'Not Authorized'});
        }

    } catch (error) {

        return res.json({success: false, message: error.message});
    }

};

export default authSeller;
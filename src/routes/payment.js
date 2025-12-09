import express from 'express';
import { userAuth } from '../middlewares/auth.js';
import razorPayInstance from '../utils/razorpay.js';
import { validateWebhookSignature } from 'razorpay/dist/utils/razorpay-utils.js';

import Payment from '../models/payments.js';
import { membershipAmount } from '../utils/constants.js';
import User from '../models/user.js';

const paymentRouter = express.Router();

paymentRouter.post("/payment/create", userAuth, async (req, res) => {

    console.log("HIT PAYMENT ROUTE");
    console.log("BODY:", req.body);
    try {
        const order = await razorPayInstance.orders.create({
            "amount": membershipAmount[membershipType] * 100,  //500 rupees
            "currency": "INR",
            "receipt": "receipt#1",
            "partial_payment": false,
            "notes": {
                firstName,
                lastName,
                email,
                membershipType: membershipType
            }
        });

        const payment = new Payment({
            userId: req.user._id,
            orderId: order.id,
            status: order.status,
            amount: order.amount,
            currency: order.currency,
            receipt: order.receipt,
            notes: order.notes
        });

        const savedPayment = await payment.save();

        res.json({
            orderId: order.id,
            amount: order.amount,
            currency: order.currency,
            notes: order.notes,
            keyId: process.env.RAZORPAY_KEY_ID
        });

    } catch (error) {
        res.status(404).json({ message: error.message });
    }

});

paymentRouter.post("/payment/webhook", async (req, res) => {
    try {

        const webhookSignature = req.headers["X-Razorpay-Signature"];

        const isWebhookValid = validateWebhookSignature(
            JSON.stringify(req.body),
            webhookSignature,
            process.env.RAZORPAY_WEBHOOK_SECRET,
        )

        if(!isWebhookValid){
            return res.status(400).json({msg: "Web Hook signature is invalid"});
        }

        const paymentDetails = req.body.payload.payment.entity;

        const payment = await Payment.findOne({orderId: paymentDetails.order_id});
        payment.status = paymentDetails.status;
        await payment.save();

        const user = User.findOne({_id: payment.userId});
        user.isPremium = true;
        await user.save();
        
        // if(req.body.event==="payment.captured"){

        // }
        // if(req.body.event==="payment.failed"){

        // }

        return res.status(200).json({msg: "WebHook received successfully"});
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
})

export default paymentRouter;
// Import the required modules
const express = require("express")
const router = express.Router()

const { auth, isInstructor, isStudent, isAdmin } = require("../middlewares/auth")

//import { createCheckoutSession } from "../controllers/Payments"
const {createCheckoutSession} = require("../controllers/Payments")

router.post('/create-checkout-session', createCheckoutSession)


// const { capturePayment, verifySignature} = require("../controllers/Payments")
// const { auth, isInstructor, isStudent, isAdmin } = require("../middlewares/auth")
// //router.post("/capturePayment", auth, isStudent, capturePayment)
// //router.post("/verifySignature", verifySignature)
// //router.post("/sendPaymentSuccessEmail", auth, isStudent, sendPaymentSuccessEmail);

module.exports = router
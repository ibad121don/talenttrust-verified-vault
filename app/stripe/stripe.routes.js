const express = require("express");

const router = express.Router();
const stripecontroler = require("./stripe.controller");

router.post("/onetimestripe", stripecontroler.oneTimeStripecontroler);
router.post(
  "/create-checkout-session",
  stripecontroler.createCheckoutSessionController
);

module.exports = router;

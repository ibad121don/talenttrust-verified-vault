const moment = require("moment");
const stripeService = require("./stripe.service");

exports.oneTimeStripecontroler = async (req, res) => {
  try {
    const parseResult = await stripeService.oneTimeStripe(req.body);

    return res.status(200).json({
      status: "200",
      code: 200,
      message: parseResult,
    });
  } catch (error) {
    console.log("error: ", error);
    return res
      .status(500)
      .json({ status: false, code: 500, message: error.message });
  }
};

// exports.createCheckoutSessionController = async (req, res) => {
//   try {
//     const result = await stripeService.createCheckoutSession();
//     return res.status(200).json({
//       status: true,
//       code: 200,
//       message: "Checkout session created successfully",
//       data: result,
//     });
//   } catch (error) {
//     console.error("Stripe session error:", error);
//     return res.status(500).json({
//       status: false,
//       code: 500,
//       message: error.message,
//     });
//   }
// };

exports.createCheckoutSessionController = async (req, res) => {
  try {
    const { userId, planId } = req.body;

    if (!userId || !planId) {
      return res.status(400).json({
        status: false,
        code: 400,
        message: "Missing userId or planId",
      });
    }

    const result = await stripeService.createCheckoutSession({
      userId,
      planId,
    });

    if (!result?.id) {
      throw new Error("Stripe session ID not created.");
    }

    return res.status(200).json({
      status: true,
      code: 200,
      message: "Checkout session created successfully",
      data: result,
    });
  } catch (error) {
    console.error("Stripe session error:", error);
    return res.status(500).json({
      status: false,
      code: 500,
      message: error.message,
    });
  }
};

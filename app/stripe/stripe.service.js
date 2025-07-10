// services/stripe.js
const Stripe = require("stripe");
const stripe = Stripe(process.env.STRIPE_SECRET_KEY); // Store in .env

exports.oneTimeStripe = async (userData) => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: userData.amount * 100, // amount in smallest currency unit (e.g., cents)
      currency: userData.currency,
      payment_method_types: ["card"],
    });

    console.log(paymentIntent);
    return {
      code: 200,
      status: true,
      message: { clientSecret: paymentIntent.client_secret },
    };
  } catch (err) {
    console.error(err);

    return {
      code: 500,
      status: false,
      message: { error: "Payment failed" },
    };
  }
};

// exports.createCheckoutSession = async () => {
//   const session = await stripe.checkout.sessions.create({
//     line_items: [
//       {
//         price: "price_1RfKzz4dNWsss1pNg0ZNXWaq", // Replace with your real price ID from Stripe
//         quantity: 1,
//       },
//     ],
//     mode: "subscription", // or 'subscription'
//     success_url: "http://localhost:8080/pricing?success=true",
//     cancel_url: "http://localhost:8080/pricing?canceled=true",
//   });

//   return { url: session.url };
// };

// stripe.service.js

exports.createCheckoutSession = async ({ userId, planId }) => {
  // You can fetch pricing data by planId from DB if needed here

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "subscription", // or "payment" if one-time
    line_items: [
      {
        price: "price_1RfKzz4dNWsss1pNg0ZNXWaq", // You can use a dynamic price from your DB mapped from planId
        quantity: 1,
      },
    ],
    success_url: "http://localhost:8080/pricing?success=true",
    cancel_url: "http://localhost:8080/pricing?canceled=true",
    metadata: {
      userId,
      planId,
    },
  });

  return session;
};

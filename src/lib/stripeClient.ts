import { loadStripe, Stripe } from "@stripe/stripe-js";

const publishableKey =
  "pk_test_51Rec7I4dNWsss1pNKQzunssm1m3opwmK6LrVqjxeZlEOVQJIjuse9jKc0uF501vibiZLcA5YVUDuGQPCUroMjKoR00FkQ4rnfX";

export const stripePromise: Promise<Stripe | null> = loadStripe(publishableKey);

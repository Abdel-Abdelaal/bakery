const Stripe = require("stripe");

const MENU = {
  "midnight-cookie": { name: "Velvet Midnight Cookie", price: 380 },
  "lavender-roll": { name: "Lavender Cloud Roll", price: 310 },
  "hazelnut-scoop": { name: "Hazelnut Midnight Scoop", price: 420 },
  "moon-tart": { name: "Moonlit Citrus Tart", price: 350 },
  "blackberry-bowl": { name: "Blackberry Velvet Bowl", price: 390 },
  "ember-scone": { name: "Ember Cardamom Scone", price: 270 }
};

exports.handler = async function (event) {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers: { "Allow": "POST" },
      body: "Method not allowed"
    };
  }

  if (!process.env.STRIPE_SECRET_KEY) {
    return {
      statusCode: 500,
      body: "Stripe secret key not configured."
    };
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

  let payload;
  try {
    payload = JSON.parse(event.body);
  } catch (error) {
    return {
      statusCode: 400,
      body: "Invalid request payload."
    };
  }

  const line_items = (payload.items || [])
    .map((entry) => {
      const item = MENU[entry.id];
      if (!item) {
        return null;
      }
      return {
        price_data: {
          currency: "usd",
          product_data: {
            name: item.name
          },
          unit_amount: item.price
        },
        quantity: Math.max(1, Number(entry.quantity) || 1)
      };
    })
    .filter(Boolean);

  if (!line_items.length) {
    return {
      statusCode: 400,
      body: "Cart is empty."
    };
  }

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items,
      mode: "payment",
      success_url: `${event.headers.origin}/success.html?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${event.headers.origin}/`
    });

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ url: session.url })
    };
  } catch (error) {
    console.error("Checkout creation failed", error);
    return {
      statusCode: 502,
      body: "Unable to create checkout session."
    };
  }
};

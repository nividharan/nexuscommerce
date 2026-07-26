const Settings = require("../models/Settings");
const stripeKey = process.env.STRIPE_SECRET_KEY;
const stripe = stripeKey ? require("stripe")(stripeKey) : null;

// Plan configurations
const PLAN_DETAILS = {
    starter: {
        name: "Starter Operator",
        price: 2900, // $29.00 in cents
        currency: "usd",
        limit: 100
    },
    pro: {
        name: "Pro Operator",
        price: 9900, // $99.00 in cents
        currency: "usd",
        limit: "unlimited"
    },
    enterprise: {
        name: "Enterprise Custom",
        price: 29900, // $299.00 in cents
        currency: "usd",
        limit: "unlimited"
    }
};

// @desc    Create Stripe Checkout Session or simulated subscription upgrade
// @route   POST /api/billing/create-checkout-session
exports.createCheckoutSession = async (req, res) => {
    try {
        const { planId } = req.body;
        const targetPlan = PLAN_DETAILS[planId] || PLAN_DETAILS.pro;
        const frontendUrl = process.env.PRODUCTION_FRONTEND_URL || "http://localhost:3000";

        // 1. Official Stripe Integration (if STRIPE_SECRET_KEY is configured in .env)
        if (stripe && stripeKey && stripeKey.startsWith("sk_")) {
            const session = await stripe.checkout.sessions.create({
                payment_method_types: ["card"],
                mode: "subscription",
                customer_email: req.user.email,
                line_items: [
                    {
                        price_data: {
                            currency: targetPlan.currency,
                            product_data: {
                                name: `NexusCommerce ${targetPlan.name} Subscription`,
                                description: `Automated catalog export quota: ${targetPlan.limit}`
                            },
                            unit_amount: targetPlan.price,
                            recurring: { interval: "month" }
                        },
                        quantity: 1
                    }
                ],
                success_url: `${frontendUrl}/account?session_id={CHECKOUT_SESSION_ID}&plan=${planId}`,
                cancel_url: `${frontendUrl}/pricing?canceled=true`,
                metadata: {
                    userId: req.user._id.toString(),
                    planId: planId
                }
            });

            return res.status(200).json({
                success: true,
                checkoutUrl: session.url,
                sessionId: session.id,
                simulated: false
            });
        }

        // 2. Seamless Instant Upgrade Fallback Mode (for Instant Demo / Pre-Stripe Keys)
        let settings = await Settings.findOne({ user: req.user._id });
        if (!settings) {
            settings = new Settings({ user: req.user._id });
        }
        settings.activePlan = targetPlan.name;
        await settings.save();

        return res.status(200).json({
            success: true,
            simulated: true,
            activePlan: targetPlan.name,
            message: `Successfully upgraded to ${targetPlan.name} subscription!`,
            checkoutUrl: `${frontendUrl}/account?upgraded=true`
        });

    } catch (error) {
        console.error("[Billing] Checkout session error:", error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Stripe Webhook Listener
// @route   POST /api/billing/webhook
exports.handleWebhook = async (req, res) => {
    const sig = req.headers["stripe-signature"];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event;

    try {
        if (stripe && webhookSecret) {
            event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
        } else {
            event = req.body;
        }

        // Handle successful subscription payment
        if (event.type === "checkout.session.completed") {
            const session = event.data.object;
            const userId = session.metadata?.userId;
            const planId = session.metadata?.planId;

            if (userId) {
                const planName = PLAN_DETAILS[planId]?.name || "Pro Operator";
                await Settings.findOneAndUpdate(
                    { user: userId },
                    { activePlan: planName },
                    { upsert: true }
                );
                console.log(`[Stripe Webhook] Upgraded user ${userId} to ${planName}`);
            }
        }

        res.status(200).json({ received: true });
    } catch (err) {
        console.error("[Stripe Webhook Error]:", err.message);
        res.status(400).send(`Webhook Error: ${err.message}`);
    }
};

// @desc    Get current user billing status
// @route   GET /api/billing/status
exports.getBillingStatus = async (req, res) => {
    try {
        let settings = await Settings.findOne({ user: req.user._id });
        const activePlan = settings?.activePlan || "Free Tier";
        res.status(200).json({
            success: true,
            activePlan: activePlan,
            stripeConfigured: !!(stripe && stripeKey && stripeKey.startsWith("sk_"))
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

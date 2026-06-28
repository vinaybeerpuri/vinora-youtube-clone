import { PLANS, savePlan } from "./plans";

const loadRazorpay = () =>
  new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

export const startPlanPayment = async (planId) => {
  const plan = PLANS[planId];
  if (!plan || plan.price === 0) return savePlan("free");

  const hasRazorpay = await loadRazorpay();

  if (!hasRazorpay) {
    return savePlan(plan.id, `mock_${Date.now()}`);
  }

  return new Promise((resolve) => {
    const checkout = new window.Razorpay({
      key: "rzp_test_1234567890",
      amount: plan.price * 100,
      currency: "INR",
      name: "RealTube Premium",
      description: `${plan.name} plan upgrade`,
      handler: (response) => resolve(savePlan(plan.id, response.razorpay_payment_id)),
      modal: {
        ondismiss: () => resolve(null)
      },
      theme: { color: "#ff0033" }
    });

    checkout.open();
  });
};

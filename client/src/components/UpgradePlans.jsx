import React, { useState } from "react";
import { formatLimit, getCurrentPlan, PLANS } from "../services/plans";
import { startPlanPayment } from "../services/payments";

const UpgradePlans = ({ compact = false, onUpgrade }) => {
  const [currentPlan, setCurrentPlan] = useState(getCurrentPlan());
  const [message, setMessage] = useState("");

  const upgrade = async (planId) => {
    const invoice = await startPlanPayment(planId);
    if (!invoice) return;

    const nextPlan = getCurrentPlan();
    setCurrentPlan(nextPlan);
    setMessage(`Payment confirmed. Invoice ${invoice.id} was sent to ${invoice.email}.`);
    if (onUpgrade) onUpgrade(nextPlan);
  };

  return (
    <section className={compact ? "plans compact" : "plans"}>
      {Object.values(PLANS).filter((plan) => plan.id !== "free").map((plan) => (
        <article className="plan-card" key={plan.id}>
          <h3>{plan.name}</h3>
          <strong>Rs.{plan.price}</strong>
          <p>{formatLimit(plan.watchLimitSeconds)} watching</p>
          <p>{plan.downloadLimit === Infinity ? "Unlimited downloads" : "1 download per day"}</p>
          <button disabled={currentPlan.id === plan.id} onClick={() => upgrade(plan.id)}>
            {currentPlan.id === plan.id ? "Current Plan" : "Upgrade"}
          </button>
        </article>
      ))}
      {message && <p className="notice">{message}</p>}
    </section>
  );
};

export default UpgradePlans;

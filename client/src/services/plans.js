import { readJson, todayKey, writeJson } from "./storage";

export const PLANS = {
  free: { id: "free", name: "Free", price: 0, watchLimitSeconds: 300, downloadLimit: 1 },
  bronze: { id: "bronze", name: "Bronze", price: 10, watchLimitSeconds: 420, downloadLimit: 1 },
  silver: { id: "silver", name: "Silver", price: 50, watchLimitSeconds: 600, downloadLimit: 1 },
  gold: { id: "gold", name: "Gold", price: 100, watchLimitSeconds: Infinity, downloadLimit: Infinity }
};

export const getCurrentPlan = () => {
  const planId = localStorage.getItem("currentPlan") || "free";
  return PLANS[planId] || PLANS.free;
};

export const savePlan = (planId, paymentId = "test-payment") => {
  const plan = PLANS[planId] || PLANS.free;
  localStorage.setItem("currentPlan", plan.id);
  if (plan.id === "gold") {
    localStorage.setItem("premiumUser", "true");
  } else {
    localStorage.removeItem("premiumUser");
  }

  const invoice = {
    id: `INV-${Date.now()}`,
    planId: plan.id,
    planName: plan.name,
    amount: plan.price,
    paymentId,
    email: getUserProfile().email,
    createdAt: new Date().toLocaleString()
  };

  const invoices = readJson("invoices", []);
  writeJson("invoices", [invoice, ...invoices]);

  const emails = readJson("emailNotifications", []);
  writeJson("emailNotifications", [
    {
      to: invoice.email,
      subject: `Invoice for ${plan.name} plan`,
      body: `Payment ${invoice.paymentId} confirmed for ${plan.name}. Amount: Rs.${plan.price}. Invoice: ${invoice.id}.`,
      createdAt: invoice.createdAt
    },
    ...emails
  ]);

  return invoice;
};

export const getUserProfile = () =>
  readJson("userProfile", {
    name: "Demo User",
    email: "demo@example.com",
    mobile: "9999999999",
    city: "Chennai",
    state: "Tamil Nadu"
  });

export const saveUserProfile = (profile) => {
  writeJson("userProfile", profile);
};

export const getDownloadUsage = () => readJson("downloadUsage", { date: todayKey(), count: 0 });

export const canDownloadToday = () => {
  const plan = getCurrentPlan();
  if (plan.downloadLimit === Infinity) return true;
  const usage = getDownloadUsage();
  return usage.date !== todayKey() || usage.count < plan.downloadLimit;
};

export const recordDownload = (video) => {
  const downloads = readJson("downloads", []);
  writeJson("downloads", [
    {
      id: `${video.id}-${Date.now()}`,
      name: video.title,
      url: video.videoUrl,
      date: new Date().toLocaleString()
    },
    ...downloads
  ]);

  const usage = getDownloadUsage();
  const nextUsage = usage.date === todayKey() ? { ...usage, count: usage.count + 1 } : { date: todayKey(), count: 1 };
  writeJson("downloadUsage", nextUsage);
};

export const formatLimit = (seconds) => {
  if (seconds === Infinity) return "Unlimited";
  return `${Math.floor(seconds / 60)} minutes`;
};

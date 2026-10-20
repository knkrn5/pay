import Razorpay from "razorpay";

const rpi = new Razorpay({
  key_id: "rzp_test_TonjKCtk3qcRek",
  key_secret: "PGj1V4YUf4m5p56zeaxGPRK7",
});

const data = await rpi.payments.all();

console.log("data", data);

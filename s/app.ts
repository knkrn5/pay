import Fastify from "fastify";
import orders from "./data.json" with { type: "json" };
import Razorpay from "razorpay";

const fastify = Fastify({
  logger: true,
});

const rpi = new Razorpay({
  key_id: "rzp_test_TonjKCtk3qcRek",
  key_secret: "PGj1V4YUf4m5p56zeaxGPRK7",
});

// Declare a route
fastify.get("/", function (req, res) {
  res.send({ hello: "world" });
});

fastify.post("/create-order", (req, res) => {
  const order = {
    id: "order_Tq2mmmXIzR3ySn",
    amount: 500,
    currency: "INR",
  };

  res.send(order);
});

fastify.listen({ port: 3000 }, function (err, address) {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  console.log(address);
  // Server is now listening on ${address}
});

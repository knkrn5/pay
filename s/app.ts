import Fastify from "fastify";
import orders from "./data.json" with { type: "json" };
import Razorpay from "razorpay";
import { writeFile } from "node:fs/promises";
import cors from "@fastify/cors";

type orderType = {
  id: string;
  amount: number | string;
  currency: string;
};

const orderData = orders as orderType[];

console.log("orders data", orderData);

const fastify = Fastify({
  logger: true,
});

const rpi = new Razorpay({
  key_id: "rzp_test_TonjKCtk3qcRek",
  key_secret: "PGj1V4YUf4m5p56zeaxGPRK7",
});

await fastify.register(cors, {
  origin: ["http://localhost:5173"],
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true, // only if you use cookies
});
// Declare a route
fastify.get("/", function (req, res) {
  res.send({ hello: "world" });
});

fastify.post("/create-order", async (req, res) => {
  /*  const order = {
    id: "order_Tq2mmmXIzR3ySn",
    amount: 500,
    currency: "INR",
  }; */

  const data = req.body as { amount: number };

  if (!data || typeof data.amount !== "number") {
    res.status(400).send({ error: "Invalid request body" });
    return;
  }
  console.log("data from client", data);

  const order = await rpi.orders.create({
    amount: data.amount,
    currency: "INR",
  });
  console.log("created order", order);
  orderData.push({
    id: order.id,
    amount: order.amount,
    currency: order.currency,
  });

  await writeFile("data.json", JSON.stringify(orderData, null, 2), "utf8");

  res.send(order.id);
});

fastify.listen({ port: 3000 }, function (err, address) {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  console.log(address);
  // Server is now listening on ${address}
});

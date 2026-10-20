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

fastify.put("/capture-pay", async (req, res) => {
  /* const { payId } = req.params as { payId: string };

  if (!payId) {
    res.status(400).send({ error: "Order ID is required" });
    return;
  }
  console.log("order id", payId) */

  const order = req.body as { payId: string; orderId: string };

  if (
    !order ||
    typeof order.payId !== "string" ||
    typeof order.orderId !== "string"
  ) {
    res.status(400).send({ error: "Invalid request body" });
    return;
  }
  console.log("data from client", order);

  const existingOrder = orderData.find((o) => o.id === order.orderId);
  if (!existingOrder) {
    res.status(404).send({ error: "Order not found" });
    return;
  }

  const orderRes = await rpi.payments.capture(
    order.payId,
    existingOrder.amount,
    existingOrder.currency,
    // order.id,
    // order.amount,
    // order.currency,
  );
  console.log("captured order", orderRes);

  const updatedOrders = orderData.map((o) => {
    if (o.id === order.orderId) {
      return {
        ...o,
        captured: true,
      };
    }
    return o;
  });

  await writeFile("data.json", JSON.stringify(updatedOrders, null, 2), "utf8");
  res.send(orderRes);
});

fastify.get("/complete-order/:orderId", async (req, res) => {
  const { orderId } = req.params as { orderId: string };

  if (!orderId) {
    res.status(400).send({ error: "Order ID is required" });
    return;
  }
  console.log("Order ID:", orderId);

  const order = await rpi.orders.fetch(orderId);
  console.log(order);

  if (!order) {
    return res.status(404).send({ error: "Invalid order id" });
  }

  if (order.status !== "paid") {
    return res.status(400).send({ error: "Order not paid yet" });
  }

  const updatedOrders = orderData.map((o) => {
    if (o.id === orderId) {
      return {
        ...o,
        completed: true,
      };
    }
    return o;
  });

  await writeFile("data.json", JSON.stringify(updatedOrders, null, 2), "utf8");
  return res.send({ message: "Order Completed" });
});

fastify.listen({ port: 3000 }, function (err, address) {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  console.log(address);
  // Server is now listening on ${address}
});

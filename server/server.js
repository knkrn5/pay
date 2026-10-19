const http = require("node:http");
const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");

const envFile = path.join(__dirname, ".env");
if (fs.existsSync(envFile)) {
  for (const line of fs.readFileSync(envFile, "utf8").split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*?)\s*$/);
    if (match && !process.env[match[1]]) {
      process.env[match[1]] = match[2].replace(/^(['"])(.*)\1$/, "$2");
    }
  }
}

const port = Number(process.env.PORT || 3000);
const keyId = process.env.RAZORPAY_KEY_ID;
const keySecret = process.env.RAZORPAY_KEY_SECRET;
const root = __dirname;
const amount = 10000; // ₹100 in paise

if (!keyId || !keySecret) {
  throw new Error("Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET before starting the server.");
}

function sendJson(response, statusCode, body) {
  response.writeHead(statusCode, { "Content-Type": "application/json" });
  response.end(JSON.stringify(body));
}

function readJson(request) {
  return new Promise((resolve, reject) => {
    let body = "";
    request.on("data", (chunk) => {
      body += chunk;
      if (body.length > 10_000) {
        reject(new Error("Request body is too large."));
        request.destroy();
      }
    });
    request.on("end", () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch {
        reject(new Error("Request body must be valid JSON."));
      }
    });
    request.on("error", reject);
  });
}

async function createOrder() {
  const credentials = Buffer.from(`${keyId}:${keySecret}`).toString("base64");
  const razorpayResponse = await fetch("https://api.razorpay.com/v1/orders", {
    method: "POST",
    headers: {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      amount,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    }),
  });

  const result = await razorpayResponse.json();
  if (!razorpayResponse.ok) {
    throw new Error(result.error?.description || "Razorpay order creation failed.");
  }

  return result;
}

function verifyPayment(payment) {
  const { razorpay_order_id: orderId, razorpay_payment_id: paymentId, razorpay_signature: signature } = payment;
  if (!orderId || !paymentId || !signature) {
    throw new Error("Incomplete payment details.");
  }

  const expectedSignature = crypto
    .createHmac("sha256", keySecret)
    .update(`${orderId}|${paymentId}`)
    .digest("hex");

  if (
    expectedSignature.length !== signature.length ||
    !crypto.timingSafeEqual(Buffer.from(expectedSignature), Buffer.from(signature))
  ) {
    throw new Error("Invalid payment signature.");
  }
}

const server = http.createServer(async (request, response) => {
  try {
    if (request.method === "POST" && request.url === "/api/create-order") {
      const order = await createOrder();
      return sendJson(response, 200, {
        id: order.id,
        amount: order.amount,
        currency: order.currency,
        keyId,
      });
    }

    if (request.method === "POST" && request.url === "/api/verify-payment") {
      verifyPayment(await readJson(request));
      return sendJson(response, 200, { verified: true });
    }

    if (request.method === "GET" && request.url === "/") {
      response.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      return response.end(fs.readFileSync(path.join(root, "index.html")));
    }

    if (request.method === "GET" && request.url === "/script.js") {
      response.writeHead(200, { "Content-Type": "application/javascript; charset=utf-8" });
      return response.end(fs.readFileSync(path.join(root, "script.js")));
    }

    sendJson(response, 404, { error: "Not found." });
  } catch (error) {
    console.error(error);
    sendJson(response, 500, { error: error.message });
  }
});

server.listen(port, () => {
  console.log(`Payment page running at http://localhost:${port}`);
});

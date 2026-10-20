import logoDark from "./logo-dark.svg";
import logoLight from "./logo-light.svg";
import type { Route } from "./+types/welcome";
import { useState } from "react";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Payment Gateway" },
    { name: "description", content: "Welcome to the Payment Gateway!" },
  ];
}

const paymentHandler = async (amount: number) => {
  try {
    const orderResponse = await fetch("http://localhost:3000/create-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount }),
    });

    if (!orderResponse.ok) {
      throw new Error("Could not create the payment order.");
    }

    const order = await orderResponse.text();
    console.log("result of order req", order);

    // const order = await orderResponse.json();

    const checkout = new window.Razorpay({
      key: "rzp_test_TonjKCtk3qcRek",
      amount: 0,
      // currency: order.currency,
      order_id: order,
      name: "karan store",
      description: "Example payment",
      prefill: {
        name: "John Doe",
        email: "k@k.com",
        contact: "9999999999",
      },
      theme: {
        color: "#3399cc",
      },
      notes: {
        description: "Payment for order #12345",
        amount: 100,
        test: "key",
      },
      handler: async (response) => {
        console.log("Payment success:", response);

        const verificationResponse = await fetch(
          `http://localhost:3000/complete-order/${response.razorpay_order_id}`,
          {
            // method: "POST",
            // headers: { "Content-Type": "application/json" },
            // body: JSON.stringify(payment),
          },
        );

        if (!verificationResponse.ok) {
          throw new Error("Payment verification failed.");
        }

        const verificationResult = await verificationResponse.json();
        console.log("Payment verification result:", verificationResult);

        alert(JSON.stringify(verificationResult, null, 2));
      },

      /*   handler: async (payment) => {
        showStatus("Verifying your payment...");

        const verificationResponse = await fetch("/api/verify-payment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payment),
        });

        if (!verificationResponse.ok) {
          throw new Error("Payment verification failed.");
        }

        showStatus("Payment successful.");
      }, */
      modal: {
        ondismiss: () => {
          console.log("payment cancelled");
        },
      },
    });

    checkout.on("payment.failed", (response) => {
      console.log(`Payment failed, `, response.error);
      // showStatus(`Payment failed: ${response.error.description}`);
    });

    checkout.open();
  } catch (error) {
    console.log("err in payment", error);
  }
};

export default function Welcome() {
  const [amount, setAmount] = useState<number>(100);

  return (
    <main className="flex items-center justify-center pt-16 pb-4">
      <h1>payment gateway</h1>

      <input
        type="number"
        className="mx-2 border border-gray-300 rounded px-2 py-1"
        value={amount}
        onChange={(e) => setAmount(Number(e.target.value))}
      />

      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded "
        onClick={() => paymentHandler(amount)}
      >
        pay
      </button>
    </main>
  );
}

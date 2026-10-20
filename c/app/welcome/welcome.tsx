import logoDark from "./logo-dark.svg";
import logoLight from "./logo-light.svg";
import type { Route } from "./+types/welcome";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Payment Gateway" },
    { name: "description", content: "Welcome to the Payment Gateway!" },
  ];
}

/* export const links: Route.LinksFunction = () => [
  {
    rel: "preconnect",
    href: "https://checkout.razorpay.com/v1/checkout.js",
  },
]; */

const paymentHandler = async () => {
  try {
    /* const orderResponse = await fetch("/api/create-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });

    if (!orderResponse.ok) {
      throw new Error("Could not create the payment order.");
    } */

    // const order = await orderResponse.json();

    const checkout = new Razorpay({
      key: "rzp_test_TonjKCtk3qcRek",
      amount: 500,
      //   currency: order.currency,
      order_id: "order_Tq2mmmXIzR3ySn",
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
      handler(response) {
        console.log("Payment success:", response);
        alert(JSON.stringify(response, null, 2));
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
  return (
    <main className="flex items-center justify-center pt-16 pb-4">
      <h1>payment gateway</h1>

      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded "
        onClick={paymentHandler}
      >
        pay
      </button>
    </main>
  );
}

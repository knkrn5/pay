const payButton = document.querySelector("#pay-button");
const status = document.querySelector("#status");

function showStatus(message) {
  status.textContent = message;
}

payButton.addEventListener("click", async () => {
  payButton.disabled = true;
  showStatus("Creating your order...");

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
      amount: 50000,
      //   currency: order.currency,
      //   order_id: order.id,
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
        payButton.disabled = false;
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
      /*  modal: {
        ondismiss: () => {
          payButton.disabled = false;
          showStatus("Payment cancelled.");
        },
      }, */
    });

    checkout.on("payment.failed", (response) => {
      payButton.disabled = false;
      console.log(`Payment failed: ${response.error}`);
      // showStatus(`Payment failed: ${response.error.description}`);
    });

    checkout.open();
  } catch (error) {
    payButton.disabled = false;
    showStatus(error.message);
  }
});

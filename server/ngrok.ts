import ngrok from "@ngrok/ngrok";

process.loadEnvFile(".env.example");

async function forwardToApp() {
  const forwarder = await ngrok.forward({
    addr: 3000,
    authtoken_from_env: true,
    domain: "rework-parched-unlisted.ngrok-free.dev",
  });
  console.log(`Available at: ${forwarder.url()}`);
}

forwardToApp();

// keeps Node running so the tunnel stays open
process.stdin.resume();
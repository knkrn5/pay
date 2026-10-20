// Require the framework and instantiate it

// ESM
import Fastify from 'fastify'

const fastify = Fastify({
  logger: true
})


// Declare a route
fastify.get('/', function (req, res) {
  res.send({ hello: 'world' })
})

fastify.post('/create-order', (req, res) => {
  const order = {
    id: "order_Tq2mmmXIzR3ySn",
    amount: 500,
    currency: "INR",
  };

  res.send(order);
});

// Run the server!
fastify.listen({ port: 3000 }, function (err, address) {
  if (err) {
    fastify.log.error(err)
    process.exit(1)
  }
    console.log(address)
  // Server is now listening on ${address}
})
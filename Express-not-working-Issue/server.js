const http = require("http");
const app = require("./App");

const port = process.env.PORT || 5000;

const server = http.createServer(app);

server.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

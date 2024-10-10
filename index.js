const http = require("http");
const dotenv = require("dotenv");
const port = process.env.PORT || 3003;
const server = http.createServer((req, res) => {
  console.log("request made");
});
server.listen(port, "localhost", () => {
  console.log("🟢 listening for requests on port " + port);
});

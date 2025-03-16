import home from "./src/index";
const port = process.env.PORT1 || 3000;
console.log("PORT1", port);
// run the app
export default {
  port,
  fetch: home.fetch,
};

import home from "./src/index";
const port = process.env.PORT || 3000;
console.log("PORT2", port);
// run the app
export default {
  port,
  fetch: home.fetch,
};

import home from "./src/index";
const port = process.env.PORT || 3000;

// run the app
export default {
  port,
  fetch: home.fetch,
};

const groupRoute = require("./groups");
const userRoute = require('./users');
const zipcodeApiRoute = require('./zipcodeApi');
const domain = process.env.REACT_APP_DOMAIN || `https://aglie-monsters-frontend.herokuapp.com/`
const apiDomain = process.env.API_DOMAIN || `https://agile-monsters.herokuapp.com`;

module.exports = (app) => {
   app.use(function (req, res, next) {
      res.header("Access-Control-Allow-Origin", `${domain}`);
      res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS");
      res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
      next();
   });

   app.use("/groups", groupRoute);
   app.use("/users", userRoute);
   app.use("/zipcodeApi", zipcodeApiRoute);

   app.use("*", (req, res) => {
      res.status(404).json("Page Not Found");
   })
}
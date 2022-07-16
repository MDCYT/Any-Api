const fs = require("fs");
const path = require("path");

const routes = fs.readdirSync(path.join(__basedir, "routes"));

const router = {};

//For all routes in routes folder
routes.forEach((route) => {
  //If the file is a js file, require it
  if (route.endsWith(".js") && route !== "index.js") {
    //router.use(require(path.join(__basedir, "routes", route)));
    router[route.replace(".js", "")] = require(path.join(
      __basedir,
      "routes",
      route
    ));
  }
});

//Api index route
router["/"] = require(path.join(__basedir, "routes/api/index.js"));

//Api routes
const apiRoutes = fs.readdirSync(path.join(__basedir, "routes/api"));
apiRoutes.forEach((route) => {
  //Check every folder in api folder
  if (route.endsWith(".js")) {
  } else {
    const versions = fs.readdirSync(path.join(__basedir, "routes/api", route));
    versions.forEach((version) => {
      if (version.endsWith(".js")) {
        router[
          `/api/${route}/${version.replace(".js", "")}`
        ] = require(path.join(__basedir, "routes/api", route, version));
      }
    });
  }
});

module.exports = router;

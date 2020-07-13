import path from "path";
import fs from "fs";

const loadRoutes = () => {
    const routes = {};
    const routesDir = path.join(__dirname, "api");

    fs.readdirSync(routesDir).forEach(function (file) {
        const extension = path.extname(file);
        if (file === "index.js" || extension !== ".js") {
            return;
        }

        const routeType = `/api/${path.basename(file, ".js")}`;
        routes[routeType] = `./routes${routeType}`;
    });

    return routes;
};

export default loadRoutes;

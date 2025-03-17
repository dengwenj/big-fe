const express = require("express");

const esbuild = require("esbuild");

const fs = require("fs");

const path = require("path");

const app = express();

const port = 3000;



app.get("/", (req, res) => {

  res.sendFile(__dirname + "/src/index.html");

});



app.get("/*.ts", async (req, res) => {

  // 在这里面做了一系列事情
  try {

    const reqPath = req.path;



    const file = fs.readFileSync(

      path.join(__dirname, "src", reqPath),

      "utf8"

    );



    const result = await esbuild.transform(file, {

      loader: "ts",

      format: "esm",

      target: "es2017",

    });

    res.type("js");

    res.send(result.code);

  } catch (error) {

    console.error(error);

    res.status(500).send("Server error");

  }

});



app.listen(port, () => {

  console.log(`Server running at http://localhost:${port}`);

});
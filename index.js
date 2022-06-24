"use strict";

const express = require("express");
// const pug = require("pug");
const url = require("url");
const StoryblokClient = require('storyblok-js-client');

const { removeEditableTags } = require("./helpers/storyblokHelpers")

require("dotenv").config()

const app = express();

app.locals.STORYBLOK_ACCESS_TOKEN = process.env.STORYBLOK_ACCESS_TOKEN

// Initialize the client
// You can use this preview token for now, we'll change it later
let Storyblok = new StoryblokClient({
  accessToken: process.env.STORYBLOK_ACCESS_TOKEN,
//   cache: {
//     type: "memory"
//   }
});

app.use("/public", express.static("public"))

// JSON Body Parser
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.set("view engine", "pug")

// For live preview
// app.post("/preview", function (req, res) {
//   // console.log("new story", req.body)
//   res.render("index", {
//     story: req.body.story
//   })
// })

// Define a wilcard route to get the story mathing the url path
app.get('/*', async function (req, res) {
  // preview
  let path = url.parse(req.url).pathname;

  path = path == '/' ? 'home' : path;

  try {
    const response = await Storyblok.get(`cdn/stories/${path}`, {
        version: req.query._storyblok ? "draft": "published"
    })
    
    res.render("index", {
      story: removeEditableTags(response.data.story)
    })
  } catch (error) {
    res.send(error)
  }
});

app.listen(process.env.SERVER_PORT, function () {
    console.log(`App listening on port ${process.env.SERVER_PORT}`)
})
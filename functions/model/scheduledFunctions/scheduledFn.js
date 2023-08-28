/* eslint-disable linebreak-style */
/* eslint-disable max-len */
/* eslint-disable object-curly-spacing */
/* eslint-disable eol-last */

/** *********************************************************
 * Copyright (C) 2022
 * Worktez
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the MIT License
 *
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 * See the MIT License for more details.
 ***********************************************************/


const { functions, cors, fastify, requestHandler } = require("../application/lib");
const { addSchedularOrg } = require("./tark/addSchedular");
const { autoSprint } = require("./tark/autoSprint");
const { manualStart } = require("./tark/manualStart");
const { startSchedular } = require("./tark/startSchedular");

/**
 * Description
 * @param {any} "121***"
 * @returns {any}
 */
// exports.scheduledFn = functions.https.onRequest((req, res) => {
//   cors(req, res, () => {
exports.scheduledFn = functions.pubsub.schedule("1 23 * * *").onRun((context) => {
  startSchedular();
});

exports.sprintScheduler = functions.pubsub.schedule("1 00 * * *").onRun((context) => {
  autoSprint();
});
//   });
// });

// /**
//  * Description
//  * @param {any} "121***"
//  * @returns {any}
//  */
// exports.scheduledFnManually = functions.runWith({
//   // Keep 5 instances warm for this latency-critical function
//   memory: "256MB",
//   timeoutSeconds: 540,
// }).https.onRequest((req, res) => {
//   cors(req, res, () => {
//     startSchedular();
//     return res.status(200).send("Success");
//   });
// });

/**
 * Description
 * @param {any} "/addScheduler"
 * @param {any} req
 * @param {any} res
 * @returns {any}
 */
fastify.post("/startSchedular", (req, res) => {
  console.log("Running Schedular for charts");
  startSchedular();
  return res.status(200).send("Success");
});

/**
 * Description
 * @param {any} "/manualStart"
 * @param {any} req
 * @param {any} res
 * @returns {any}
 */
fastify.post("/manualStart", (req, res) => {
  console.log("Manual scheduler triggered");
  manualStart(req, res);
});

/**
 * Description
 * @param {any} "/addScheduler"
 * @param {any} req
 * @param {any} res
 * @returns {any}
 */
fastify.post("/addScheduler", (req, res) => {
  addSchedularOrg(req, res);
});

/**
 * Description
 * @param {any} req
 * @param {any} res
 * @returns {any}
 */
exports.scheduledFnManually = functions.https.onRequest((req, res) => {
  cors(req, res, () => {
    fastify.ready((err) => {
      if (err) throw err;
      requestHandler(req, res);
    });
  });
});

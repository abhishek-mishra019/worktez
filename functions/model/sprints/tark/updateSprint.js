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
 * Author : Sanjay Krishna <sanjaykrishna1203@gmail.com>
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 * See the MIT License for more details.
 ***********************************************************/
const {getSprint, updateSprint, setSprint} = require("../lib");
const admin = require("firebase-admin");

exports.updateSprintData = function(teamId, project, orgDomain, previousSprintName, oldStoryPointNumber, storyPointNumber, editedSprintNumber, orgId, editedSprintName, currentSprint) {
  const sprintPromises = [];
  const prevSprintPromise = getSprint(orgDomain, project, previousSprintName).then((prevSprint) => {
    if (prevSprint != undefined) {
      const totalUnCompletedTask = admin.firestore.FieldValue.increment(-1);
      const totalNumberOfTask = admin.firestore.FieldValue.increment(-1);

      let updatePrevSprintJson;
      if (parseInt(prevSprint.SprintNumber) > 0) {
        if (prevSprint.Status == "Not Started") {
          const startStoryPointNumber = admin.firestore.FieldValue.increment(-oldStoryPointNumber);
          updatePrevSprintJson = {
            TotalNumberOfTask: totalNumberOfTask,
            TotalUnCompletedTask: totalUnCompletedTask,
            StartStoryPoint: startStoryPointNumber,
          };
        } else if (prevSprint.SprintNumber == currentSprint) {
          const midStoryPointNumber =admin.firestore.FieldValue.increment(-oldStoryPointNumber);
          updatePrevSprintJson = {
            TotalNumberOfTask: totalNumberOfTask,
            TotalUnCompletedTask: totalUnCompletedTask,
            MidStoryPoint: midStoryPointNumber,
          };
        } else {
          updatePrevSprintJson = {
            TotalNumberOfTask: totalNumberOfTask,
            TotalUnCompletedTask: totalUnCompletedTask,
          };
        }
      } else {
        updatePrevSprintJson = {
          TotalNumberOfTask: totalNumberOfTask,
          TotalUnCompletedTask: totalUnCompletedTask,
        };
      }

      updateSprint(updatePrevSprintJson, orgDomain, project, previousSprintName);
    }
  });
  sprintPromises.push(prevSprintPromise);

  const newSprintPromise = getSprint(orgDomain, project, editedSprintName).then((newSprint) => {
    if (newSprint != undefined) {
      const totalUnCompletedTask = admin.firestore.FieldValue.increment(1);
      const totalNumberOfTask = admin.firestore.FieldValue.increment(1);

      let updateNewSprintJson;
      if (parseInt(newSprint.SprintNumber) > 0) {
        if (newSprint.Status == "Not Started") {
          const startStoryPointNumber = admin.firestore.FieldValue.increment(storyPointNumber);
          updateNewSprintJson = {
            TotalNumberOfTask: totalNumberOfTask,
            TotalUnCompletedTask: totalUnCompletedTask,
            StartStoryPoint: startStoryPointNumber,
          };
        } else if (newSprint.SprintNumber == currentSprint) {
          const midStoryPointNumber = admin.firestore.FieldValue.increment(storyPointNumber);
          updateNewSprintJson = {
            TotalNumberOfTask: totalNumberOfTask,
            TotalUnCompletedTask: totalUnCompletedTask,
            MidStoryPoint: midStoryPointNumber,
          };
        } else {
          updateNewSprintJson = {
            TotalNumberOfTask: totalNumberOfTask,
            TotalUnCompletedTask: totalUnCompletedTask,
          };
        }
      } else {
        updateNewSprintJson = {
          TotalNumberOfTask: totalNumberOfTask,
          TotalUnCompletedTask: totalUnCompletedTask,
        };
      }
      updateSprint(updateNewSprintJson, orgDomain, project, editedSprintName);
    } else {
      setSprint(orgDomain, project, editedSprintName, orgId, teamId, editedSprintNumber, "Not Started", 1, 1, storyPointNumber);
    }
  });
  sprintPromises.push(newSprintPromise);
  return Promise.resolve(sprintPromises);
};

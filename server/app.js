const { App, LogLevel, ExpressReceiver } = require("@slack/bolt");
const orgAuth = require("./database/auth/store_user_org_install");
const workspaceAuth = require("./database/auth/store_user_workspace_install");
const db = require("./database/db");
const dbQuery = require("./database/find_user");
const { findAllUsers } = require("./database/db");
// const customRoutes = require("./utils/custom_routes");
const express = require("express");
const axios = require("axios");
const receiver = new ExpressReceiver({
  scopes: ["incoming-webhook"],
  token: process.env.SLACK_BOT_TOKEN,
  logLevel: LogLevel.ERROR,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  clientId: process.env.SLACK_CLIENT_ID,
  clientSecret: process.env.SLACK_CLIENT_SECRET,
  stateSecret: process.env.SLACK_STATE_SECRET,
  // customRoutes: customRoutes.customRoutes,
  installerOptions: {
    stateVerification: false,
    callbackOptions: {
      success: (installation, installOptions, req, res) => {
        res.send("successful!");
      },
      failure: (error, installOptions, req, res) => {
        res.send("failure");
      },
    },
    // directInstall: true
  },
  installationStore: {
    storeInstallation: async (installation) => {
      console.log("installation: " + installation);
      if (
        installation.isEnterpriseInstall &&
        installation.enterprise !== undefined
      ) {
        return orgAuth.saveUserOrgInstall(installation);
      }
      if (installation.team !== undefined) {
        return workspaceAuth.saveUserWorkspaceInstall(installation);
      }
      throw new Error("Failed saving installation data to installationStore");
    },
    fetchInstallation: async (installQuery) => {
      console.log("installQuery: " + installQuery);
      if (
        installQuery.isEnterpriseInstall &&
        installQuery.enterpriseId !== undefined
      ) {
        return dbQuery.findUser(installQuery.enterpriseId);
      }
      if (installQuery.teamId !== undefined) {
        return dbQuery.findUser(installQuery.teamId);
      }
      throw new Error("Failed fetching installation");
    },
  },
});
receiver.router.use(express.json());

const app = new App({
  receiver,
});

// Non-Slack HTTP request listeners on receiver.router

receiver.router.get("/users", async (_, res, next) => {
  try {
    const users = await findAllUsers();
    res.send(users);
  } catch (error) {
    console.log("error finding all users: ", error);
    next(error);
  }
});

receiver.router.get("/users", async (_, res, next) => {
  try {
    const users = await findAllUsers();
    res.send(users);
  } catch (error) {
    console.log("error finding all users");
    next(error);
  }
});

receiver.router.post("/notifications:generate", async (req, res, next) => {
  try {
    const { text, incomingWebhook } = req.body;
    const response = await axios.post(incomingWebhook.url, { text });
    res.status(200).json({ message: "notification generated: ", text });
  } catch (error) {
    console.log("error posting to incoming webhook: ", error);
    next(error);
  }
});

/** Start Bolt App */
(async () => {
  try {
    await app.start(process.env.PORT || 3000);
    console.log("⚡️ Bolt app is running! ⚡️");
    db.connect();
    console.log("DB is connected.");
  } catch (error) {
    console.error("Unable to start App", error);
  }
})();

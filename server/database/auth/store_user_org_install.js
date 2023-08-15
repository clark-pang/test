
const model = require('../db');
const saveUserOrgInstall = async function(installation) {
  const resp = await model.User.updateOne(
      {_id: installation.enterprise.id},
      {
        team: 'null',
        enterprise: {
          id: installation.enterprise.id,
          name: installation.enterprise.name,
        },
        user: {
          token: installation.user.token,
          scopes: installation.user.scopes,
          id: installation.user.id,
        },
        tokenType: installation.tokenType,
        isEnterpriseInstall: installation.isEnterpriseInstall,
        appId: installation.appId,
        authVersion: installation.authVersion,
        bot: 'null',
        incomingWebhook: {
          url: installation.incomingWebhook.url,
          channel: installation.incomingWebhook.channel,
          channelId: installation.incomingWebhook.channelId,
          configurationUrl: installation.incomingWebhook.configurationUrls,
        }
      },
      {upsert: true},
  );
  return resp;
};

module.exports = {saveUserOrgInstall};
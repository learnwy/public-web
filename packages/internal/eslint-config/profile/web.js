const webConfig = require("@rushstack/eslint-config/profile/web-app");
const rulesConfig = require("../rules-config/common");

webConfig.parser = "@typescript-eslint/parser";

rulesConfig.addCommonRules(webConfig, { type: "web", ts: true });

module.exports = webConfig;

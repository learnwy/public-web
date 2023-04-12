const nodeConfig = require("@rushstack/eslint-config/profile/node");
const rulesConfig = require("../rules-config/common");

nodeConfig.parser = "@typescript-eslint/parser";

rulesConfig.addCommonRules(nodeConfig, { type: "node", ts: true });

module.exports = nodeConfig;

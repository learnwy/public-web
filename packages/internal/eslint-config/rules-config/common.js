const commonRules = {
  "prefer-const": "error",
};

const tsCommonRules = {
  "@typescript-eslint/explicit-function-return-type": "error",
};

function assignRules(targetRules, extraRules) {
  Object.assign(targetRules, extraRules);
}

/**
 *
 * @param {import("@typescript-eslint/utils").Linter.Config} config
 * @param {object} options
 * @param {"node" | "web"} options.type
 * @param {boolean} options.ts
 * @return {void}
 */
function addCommonRules(config, options) {
  const updateRules = {};
  Object.assign(updateRules, commonRules);
  if (options.ts) {
    Object.assign(updateRules, tsCommonRules);
  }

  if (config.rules) {
    assignRules(config.rules, updateRules);
  }
  config.overrides?.forEach((overrideConfig) => {
    let isTS = false;
    if (typeof overrideConfig.files === "string") {
      isTS = overrideConfig.files.includes("ts");
    } else {
      isTS = overrideConfig.files?.some((f) => f.includes("ts")) ?? false;
    }
    addCommonRules(overrideConfig, { type: options.type, ts: isTS });
  });
}

module.exports.addCommonRules = addCommonRules;

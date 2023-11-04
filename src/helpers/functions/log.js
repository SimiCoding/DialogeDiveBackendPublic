const chalk = require("chalk");

const log = (string, style) => {
  const date = new Date();
  date.setTime(date.getTime());
  switch (style) {
    case "info": {
      console.log(
        `[${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}] ` +
          chalk.blue("[INFO] " + string)
      );

      break;
    }

    case "error": {
      console.error(
        `[${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}] ` +
          chalk.red("[ERROR] " + string)
      );

      break;
    }

    case "warn": {
      console.warn(
        `[${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}] ` +
          chalk.yellow("[WARNING] " + string)
      );

      break;
    }

    case "success": {
      console.log(
        `[${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}] ` +
          chalk.green("[SUCCESS] " + string)
      );

      break;
    }

    default: {
      console.log(
        `[${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}] ` +
          string
      );

      break;
    }
  }
};

module.exports = {
  log,
};

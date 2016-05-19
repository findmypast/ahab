'use strict';

module.exports = {
  valuePresence: (value, message) => {
    if (value === undefined || value === null) {
      throw new Error(message);
    }
  },
};

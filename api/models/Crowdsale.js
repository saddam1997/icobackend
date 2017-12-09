/**
 * Crowdsale.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    crowdsalelink: {
      type: 'string'
    },
    iconame: {
      type: 'string'
    },
    icoshortname: {
      type: 'string'
    },
    logopath: {
      type: 'string'
    },
    weblink: {
      type: 'string'
    },
    timetostart: {
      type: 'string'
    },
    timetoend: {
      type: 'string'
    },
    totalsupply: {
      type: 'float'
    }
  }
};
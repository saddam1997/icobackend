/**
 * Crowdsalesetup.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    crowdsalesetupname: {
      type: 'string'
    },
    walletaddress: {
      type: 'string'
    },
    rate: {
      type: 'string'
    },
    supply: {
      type: 'string'
    },
    starttime: {
      type: 'string'
    },
    endtime: {
      type: 'string'
    },
    allowmodify: {
      type: 'string'
    },
    disablewhitelist: {
      type: 'string'
    },
    globalLimitInvestorMinCap: {
      type: 'string'
    }
  }
};

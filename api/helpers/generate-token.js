const jwt = require('jsonwebtoken');
module.exports = {
  friendlyName: 'Generate token',

  description: '',

  inputs: {
    id: {
      type: 'string',
      required: true
    },
    email: {
      type: 'string',
      required: true
    }
  },

  exits: {
    success: {
      description: 'All done.'
    }
  },

  fn: async function (inputs) {
    try {
      const token = jwt.sign(
        {
          data: {
            id: inputs.id,
            email: inputs.email,
            timestamp: Date.now()
          }
        },
        sails.config.secret,
        {
          expiresIn: Date.now() + 1000 * (60 * 60)
        }
      );

      return token;
    } catch (err) {
      console.log(err);
      return '';
    }
  }
};

const axios = require('axios');
const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');
module.exports = {
  friendlyName: 'Sso login',

  description: '',

  inputs: {
    tokenId: {
      description: 'The google token that was returned during google login.',
      example: 'gwa8gs8hgw9h2g9hg29hgwh9asdgh9q34$$$$$asdgasdggds',
      required: true
    }
  },

  exits: {
    success: {
      description:
        'Google signin successful, and requesting user agent is now logged in.'
    },
    userNotFound: {
      description: `The provided email user not in the database.`
    },
    invalidToken: {
      description:
        'The provided google token is invalid, expired, or has already been used.',
      responseType: 'expired'
    },
    couldntVerifyToken: {
      description: 'Could not verify the token.',
      statusCode: 409
    },
    invalid: {
      responseType: 'badRequest',
      description: 'Could not create new user.',
      extendedDescription:
        'If this request was sent from a graphical user interface, the request ' +
        'parameters should have been validated/coerced _before_ they were sent.'
    }
  },

  fn: async function (inputs, exits) {
    if (!inputs.tokenId) {
      throw new Error('invalidToken');
    }

    const url = 'https://www.googleapis.com/oauth2/v3/tokeninfo';
    /* eslint-disable camelcase */
    const googleOAuthResponse = await axios
      .get(url, {
        params: {
          id_token: inputs.tokenId
        }
      })
      .catch(() => {
        throw new Error('couldntVerifyToken');
      });

    if (
      !googleOAuthResponse &&
      (!googleOAuthResponse.status !== 200 || !googleOAuthResponse.data)
    ) {
      return exits.invalidToken('Invalid token');
    }

    const googleUserDetails = googleOAuthResponse.data;

    let userRecord = await User.findOne({
      email: googleUserDetails.email
    });

    if (!userRecord) {
      const salt = crypto.randomBytes(10).toString('hex');
      const hash = crypto.createHmac('sha256', salt);

      password = hash.digest('hex').toString('hex');

      userRecord = await User.create({
        name: googleUserDetails.email.split('@')[0],
        email: googleUserDetails.email,
        passwordHash: uuidv4() || 'password',
        salt: salt
      }).fetch()
    }

    const token = crypto.randomBytes(10).toString('hex');
    const session = await Session.create({
      user: userRecord.id,
      sessionToken: token,
      expiresAt: Date.now() + 1000 * (60 * 5),
      status: 1
    }).fetch();

    return this.res
      .status(200)
      .send({ userId: userRecord.id, sessionToken: session.sessionToken });
  }
};

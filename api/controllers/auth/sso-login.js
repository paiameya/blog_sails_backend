module.exports = {


  friendlyName: 'Sso login',


  description: '',


  inputs: {
    tokenId: {
      description: 'The google token that was returned during google login.',
      example: 'gwa8gs8hgw9h2g9hg29hgwh9asdgh9q34$$$$$asdgasdggds',
      required: true,
    },

  },


  exits: {
    success: {
      description:
        'Google signin successful, and requesting user agent is now logged in.',
    },

    invalidToken: {
      description:
        'The provided google token is invalid, expired, or has already been used.',
      responseType: 'expired',
    },
    couldntVerifyToken: {
      description: 'Could not verify the token.',
      statusCode: 409,
    },
    invalid: {
      responseType: 'badRequest',
      description: 'Could not create new user.',
      extendedDescription:
        'If this request was sent from a graphical user interface, the request ' +
        'parameters should have been validated/coerced _before_ they were sent.',
    },

  },


  fn: async function (inputs) {

    const axios = require('axios');

    if (!inputs.tokenId) {
      throw 'invalidToken';
    }

    const url = 'https://www.googleapis.com/oauth2/v3/tokeninfo';

    const googleOAuthResponse = await axios
      .get(url, {
        params: {
          id_token: inputs.tokenId,
        },
      })
      .catch(() => {
        throw 'couldntVerifyToken';
      });

    if (
      !googleOAuthResponse &&
      (!googleOAuthResponse.status !== 200 || !googleOAuthResponse.data)
    ) {
      throw 'invalidToken';
    }

    const googleUserDetails = googleOAuthResponse.data;

    // Look up the user with this reset token.
    var userRecord = await User.findOne({
      emailAddress: googleUserDetails.email,
    });

    if (userRecord) {
      // Log the user in.
      // (This will be persisted when the response is sent.)
      this.req.session.userId = userRecord.id;
      return;
    }


    let session = await Session.create({
      user: userRecord.id,
      sessionToken: token,
      expiresAt: Date.now() + 1000 * (60 * 5),
      status: 1
    }).fetch()

    // Store the user's new id in their session.
    this.req.session.userId = newUserRecord.id;
  }

};

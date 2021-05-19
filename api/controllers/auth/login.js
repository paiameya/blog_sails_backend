const crypto = require('crypto')
const jwt = require("jsonwebtoken");

module.exports = {
  friendlyName: 'Login',

  description: 'Login auth.',

  inputs: {
    email: {
      description: 'The email to try in this attempt, e.g. "irl@example.com".',
      type: 'string',
      required: true
    },

    password: {
      description:
        'The unencrypted password to try in this attempt, e.g. "passwordlol".',
      type: 'string',
      required: true
    }
  },

  exits: {
    success: {
      description: 'Successful log in'
    },
    userNotFound: {
      description: `The provided email user not in the database.`
    },
    invalidPassword: {
      description: `The password is invalid`
    }
  },

  fn: async function (inputs, exits) {
    let userRecord;
    if (inputs.email.includes('@')) {
      userRecord = await User.findOne({
        email: inputs.email
      });
    }
    if (userRecord === undefined) {
      return exits.userNotFound('User not found');
    }

    const hash = crypto.createHmac('sha256', userRecord.salt);

    hash.update(inputs.password);
    let password = hash.digest("hex").toString("hex");

    if (userRecord.passwordHash === password) {
      console.log("****", sails.config.locals.secret)
      let token = await sails.helpers.generateToken({ id: userRecord.id, email: userRecord.email })
      if (token.trim() !== '') {
        let session = await Session.create({
          user: userRecord.id,
          sessionToken: token,
          expiresAt: Date.now() + 1000 * (60 * 5),
          status: 1
        }).fetch();
        const userId = userRecord.id;
        const sessionToken = session.sessionToken;

        return exits.success({ userId, sessionToken });
      }
      else {
        this.res.send("Login failed")
      }

    } else {
      return exits.invalidPassword('Invalid Password');
    }
  }
};

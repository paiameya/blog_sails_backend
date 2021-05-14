const crypto = require('crypto')

module.exports = {


  friendlyName: 'Signup',


  description: 'Signup auth.',


  inputs: {
    name: { type: "string", required: true },
    email: { type: "string", required: true },
    password: { type: "string", required: true }
  },
  exits: {
    success: {
      description: "Successful sign up."
    },
    emailAlreadyInUse: {
      statusCode: 409,
      description: "The provided email id is already in use."
    }
  },


  fn: async function (inputs, exits) {
    let { name, email, password } = inputs
    let salt = crypto.randomBytes(10).toString("hex")
    const hash = crypto.createHmac("sha256", salt)
    hash.update(password);
    password = hash.digest("hex").toString("hex")
    let newUser = await User.create({
      name: name,
      email: email,
      passwordHash: password,
      salt: salt,
    }).intercept('E_UNIQUE', () => {
      this.res.status(409).send("Email already in use")
      return 'emailAlreadyInUse'
    })
    return exits.success("Successfully signed up")
  }

};
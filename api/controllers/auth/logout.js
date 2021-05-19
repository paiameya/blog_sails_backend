module.exports = {
  friendlyName: 'Logout',

  description: 'Logout auth.',

  inputs: {},

  exits: {},




  fn: async function (inputs) {

    let session = await Session.update({ sessionToken: this.req.sessionToken, status: 1 }).set({ status: 0 })
    if (session)
      return this.ref.status(200).send("Successfully logged out")
  }
};

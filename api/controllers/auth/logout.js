module.exports = {
  friendlyName: 'Logout',

  description: 'Logout auth.',

  inputs: {},

  exits: {
    success: {
      description: 'Successfully logged out'
    }
  },

  fn: async function () {
    await Session.update({
      sessionToken: this.req.sessionToken,
      status: 1
    }).set({ status: 0 });
    this.res.status(200).send('Successfully logged out');
  }
};

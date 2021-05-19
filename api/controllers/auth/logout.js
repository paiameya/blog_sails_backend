module.exports = {
  friendlyName: 'Logout',

  description: 'Logout auth.',

  inputs: {},

  exits: {},

  fn: async function () {
    const session = await Session.update({
      sessionToken: this.req.sessionToken,
      status: 1
    }).set({ status: 0 });
    if (session) return 'Successfully Logged Out';
  }
};

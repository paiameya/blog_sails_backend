module.exports = {


  friendlyName: 'Logout',


  description: 'Logout auth.',


  inputs: {

  },


  exits: {

  },


  fn: async function (inputs) {

    let session = await Session.update({ sessionToken: token, status: 1 }).set({ status: 2 })
    return "Successfully Logged Out"

  }


};

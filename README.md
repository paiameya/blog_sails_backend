### To run the project

```
npm install
sails lift
```

### To connect to the mongo database ensure that you add mongodb connection uri of the format in config/datastores.js

```
mongodb://[username:password@]host1[:port1][,...hostN[:portN]][/[defaultauthdb][?options]]
```

### Add a secret key for JWT token generation in the env file config/env/[environment-name].js

Example:

```
./config/env/[environment-name].js
module.exports = {
 secret: 'this_is_a_secret'
}
```

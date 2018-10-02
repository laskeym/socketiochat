const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  createdDate: { type: Date, default: Date.now }
});

userSchema.methods.generateHash = password => {
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(password, salt, (err, hash) => {
      return hash;
    });
  });
};

userSchema.methods.validatePassword = password => {
  bcrypt
    .compare(password, this.password)
    .then(isMatch => {
      return isMatch;
    })
    .catch(err => console.log(err));
};

module.exports = mongoose.model("User", userSchema);

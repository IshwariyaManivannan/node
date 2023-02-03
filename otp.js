
const otpGenerator = require('otp-generator');
// const { OTP_LENGTH, OTP_CONFIG } = require('../constants/constants');
module.exports.generateOTP = () => {
  const OTP = otpGenerator.generate(4, {digits:true,upperCaseAlphabets:false,specialChars:false,lowerCaseAlphabets:false});
  console.log({"message":"otp is",OTP})
  return OTP;
};

// The OTP_LENGTH is a number, For my app i selected 10.
// The OTP_CONFIG is an object that looks like 

// OTP_CONFIG: {
//   upperCaseAlphabets: true,
//   specialChars: false,
// }

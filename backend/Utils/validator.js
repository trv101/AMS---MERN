// validator.js
import validator from 'validator';

class CustomValidator {
  static validateEmail(email) {
    return validator.isEmail(email);
  }

  static validatePassword(password) {
    return validator.isLength(password, { min: 8 });
  }


 
}

export default CustomValidator;

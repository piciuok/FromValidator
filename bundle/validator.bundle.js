(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = global || self, global.Validator = factory());
}(this, function () { 'use strict';

    if (typeof Object.assign != 'function') {
        Object.assign = function(target, varArgs) { // .length of function is 2
            if (target == null) { // TypeError if undefined or null
                throw new TypeError('Cannot convert undefined or null to object');
            }

            var to = Object(target);

            for (var index = 1; index < arguments.length; index++) {
                var nextSource = arguments[index];

                if (nextSource != null) { // Skip over if undefined or null
                    for (var nextKey in nextSource) {
                        // Avoid bugs when hasOwnProperty is shadowed
                        if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
                            to[nextKey] = nextSource[nextKey];
                        }
                    }
                }
            }
            return to;
        };
    }

    if ('NodeList' in window && !NodeList.prototype.forEach) {
        NodeList.prototype.forEach = function (callback, thisArg) {
            thisArg = thisArg || window;
            for (var i = 0; i < this.length; i++) {
                callback.call(thisArg, this[i], i, this);
            }
        };
    }

    var Rules = {
        'required': {
            valid: (value, field) => {
                if(field.type === 'radio' || field.type === 'checkbox') {
                    const elements = document.getElementsByName(field.name);
                    let anyChecked = false;

                    elements.forEach(radio => {
                        if(anyChecked) return true;
                        if(radio.checked) {
                            anyChecked = true;
                            return true;
                        }
                    });
                    return anyChecked;

                } else if(field.type === 'select') {
                    return value !== "";
                } else
                return value.length !== 0
            },
        },
        'phone' : {
            valid: (value, field) => {
                const re = /^([0-9]{9})$/;
                return re.test(value);
            },
        },
        'email' : {
            valid: (value, field) => {
                const re = /\S+@\S+\.\S+/;
                return re.test(value);
            },
        },
        'password' : {
            valid: (value, field) => {
                const minLowercase  = '(?=.*[a-z])';
                const minUppercase  = '(?=.*[A-Z])';
                const minNumeric    = '(?=.*[0-9])';
                const minSpecial    = '(?=.*[!@#\\$%\\^&])';
                const minLenght     = '(?=.{8,})';
                const re = new RegExp(`^${minLowercase}${minUppercase}${minNumeric}${minSpecial}${minLenght}`);
                return re.test(value);
            },
        },
        'pesel' : {
            valid: (value, field) => {
                if (value.length !== 11) return false;
                let year = parseInt(value.substr(0, 2));
                let month = parseInt(value.substr(2, 2));
                let day = parseInt(value.substr(4, 2));

                if(month > 12 || month < 1) {
                    if(month < 21 || month > 32) return false;
                }

                if( day > 31) return false;

                return true;
            },
        },
        'regon' : {
            valid: (value, field) => {
                let weightsNine = [8, 9, 2, 3, 4, 5, 6, 7],
                    weightsFourteen = [2, 4, 8, 5, 0, 9, 7, 3, 6, 1, 2, 4, 8],
                    checkSum = 0, modulo = 0, control = 0;

                if( /(\d{14}|\d{9})/.test( value ) && ( value.length === 9 || value.length === 14 ) ){

                    if(value.length === 9) {
                        for (let i = 0; i < 8; i++) {
                            checkSum += parseInt(value[ i ]) * weightsNine[ i ];
                        }

                        modulo = checkSum % 11;
                        control = modulo === 10 ? 0 : modulo;

                        if( parseInt( value.charAt( 8 ) ) === control ) return true;
                    }

                    if(value.length === 14) {
                        for (let i = 0; i < 13; i++) {
                            checkSum += parseInt(value[ i ]) * weightsFourteen[ i ];
                        }
                        modulo = checkSum % 11;
                        control = modulo === 10 ? 0 : modulo;

                        if( parseInt( value.charAt( 13 ) ) === control ) return true;
                    }
                }

                return false;
            },
        },
        'nip': {
            valid: function (value, field) {
                let nipWithoutDashes = value.replace("-","",value);

                if(nipWithoutDashes.length !== 10) return false;

                let digits = nipWithoutDashes.split('');
                let checksum = (6*parseInt(digits[0]) + 5*parseInt(digits[1]) + 7*parseInt(digits[2]) + 2*parseInt(digits[3]) + 3*parseInt(digits[4]) + 4*parseInt(digits[5]) + 5*parseInt(digits[6]) + 6*parseInt(digits[7]) + 7*parseInt(digits[8]))%11;

                return (parseInt(digits[9]) === checksum);
            }
        },
        'idCard': {
            valid: function (value, field) {
                if (value == null || value.length !== 9)
                    return false;

                let i, j, sum, letterValues;

                value = value.toUpperCase();
                letterValues = [
                    '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
                    'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J',
                    'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T',
                    'U', 'V', 'W', 'X', 'Y', 'Z'];

                function getLetterValue(letter)
                {
                    for (j=0; j<letterValues.length; j++)
                        if (letter === letterValues[j])
                            return j;
                    return -1;
                }

                for (i=0; i<3; i++)
                    if (getLetterValue(value[i]) < 10)
                        return false;

                for (i=3; i<9; i++)
                    if (getLetterValue(value[i]) < 0 || getLetterValue(value[i]) > 9)
                        return false;

                sum = 7 * getLetterValue(value[0]) +
                    3 * getLetterValue(value[1]) +
                    1 * getLetterValue(value[2]) +
                    7 * getLetterValue(value[4]) +
                    3 * getLetterValue(value[5]) +
                    1 * getLetterValue(value[6]) +
                    7 * getLetterValue(value[7]) +
                    3 * getLetterValue(value[8]);
                sum %= 10;
                if(sum !== getLetterValue(value[3]))
                    return false;

                return true;
            }
        }
    };

    var Events = {
        onFieldValidateError: function (field, value, errorMessages) {
            if(this.debug) {
                console.log('Fire onFieldValidateError');
            }
        },

        onFieldValidateSuccessful: function (field, value) {
            if(this.debug) {
                console.log('Fire onFieldValidateSuccessful');
            }
        },

        onFormValidationError: function (form, errorMessages) {
            if(this.debug) {
                console.log('Fire onFormValidationError');
            }
        },

        onFormValidationSuccessful: function (form) {
            if(this.debug) {
                console.log('Fire onFormValidationSuccessful');
            }
        },

        beforeFieldValidation: function (field) {
            if(this.debug) {
                console.log('Fire beforeFieldValidation');
            }
        },

        afterFieldValidation: function (field) {
            if(this.debug) {
                console.log('Fire afterFieldValidation');
            }
        },

        beforeFormValidation: function (form) {
            if(this.debug) {
                console.log('Fire beforeFormValidation');
            }
        },

        afterFormValidation: function (form) {
            if(this.debug) {
                console.log('Fire afterFormValidation');
            }
        }
    };

    var en = {
      "Rules": {
        "Errors": {
          "required": "This field is required.",
          "phone": "Incorrect phone format. Should be exact 9 digits.",
          "email": "Incorrect email address.",
          "password": "Password is too week. Password should contain 1 uppercase, 1 lowercase, 1 digit, 1 special char and be greater or equal 9 chars.",
          "pesel": "This field is invalid",
          "regon": "This field is invalid",
          "nip": "This field is invalid",
          "idCard": "This field is invalid",
        }
      }
    };

    var pl = {
      "Rules": {
        "Errors": {
          "required": "To pole jest wymagane.",
          "phone": "Nieprawidłowy numer telefonu. Musi to być dokładnie 9 cyfr.",
          "email": "Nieprawidłowy adres e-mail.",
          "password": "Hasło za słabe. Hasło powinno zawierać 1 wielką i małą literę, 1 cyfrę, 1 znak specjalny i mieć co najmniej 8 znaków.",
          "pesel": "Podany pesel jest nieprawidłowy",
          "regon": "Podany regon jest nieprawidłowy",
          "nip": "Podany NIP jest nieprawidłowy",
          "idCard": "Podany numer dowodu jest nieprawidłowy",
        }
      }
    };

    var Languages = {
        pl: pl,
        en: en
    };

    function Validator(options = {}) {
      const _options = {
        debug: false,
        constraints: {},
        errorWrapperClass: 'form-errors-msgs',
        errorClass: 'single-error-msg',
        errorPosition: 'before', //before|after
        translations: en,
        language: 'en',
        rules: Rules,
        ...Events
      };

      options = {
        ..._options,
        ...options
      };

      Object.assign(this, options);

      if(en === options.translations) {
        this._setTranslations(options.language, true);
      } else {
        if(this.debug) console.log(`Translations override by user custom translations passed.`);
      }
    }

    Validator.prototype = {
      construct: Validator,
      errors: {},
      form: null,

      _setTranslations: function(langCode, initialize = false) {
        if(initialize && langCode === 'en') return;

        const translations = Languages[langCode];

        if( translations === undefined) {
          if(this.debug) console.log(`Lang '${langCode}' is not supported yet. Load default.`);
          this.translations = Languages.en;
        } else {
          if(this.debug) console.log(`Lang '${langCode}' set successful.`);
          this.translations = translations;
        }
      },

      /**
       * Get Value from self deep properties, eg. path = translations.Rules.Errors.required, return a string
       * 'This field is required.'
       **/
      _getDeepPropertyValue: function(start = this, path = '') {
        let tree = path.split('.');
        let obj = start;

        if(tree.length === 0) {
          if(this.debug) console.log(`You shouldn't read anything from mains properties. Path: ${path}`);
          return `You shouldn't read anything from main properties. Path: ${path}`;
        }

        function readTreeValue(tree, prop) {
          const nextProp = tree.shift();
          if(prop[nextProp] === undefined) return false;
          prop = prop[nextProp];
          if(tree.length !== 0) return readTreeValue(tree, prop); else return prop;
        }

        let value = readTreeValue(tree, obj);

        if(value === false) {
          if(this.debug) {
            console.log(`Invalid property path: ${path}. Check your object below:`);
            console.log(obj);
          }
          return `BAD PROPERTY PATH: ${path}`;
        } else return value;
      },

      /**
       * Get translated message
       * TODO: set locale.
       * TODO: make hints for field.
       **/
      getTranslated: function(path) {
        return this._getDeepPropertyValue(this.translations, path);
      },

      /**
       * Validate whole form
       **/
      validateForm: function(form = null) {
        if(form === null) {
          console.log(`You don't pass form element`);
          return;
        }

        this.form = form;

        this.removeAllErrorMessages();
        this.beforeFormValidation(form);

        if(this.debug) console.log(`Total form elements: ${form.elements.length}`);

        let alreadyChecked = [];

        for(let i = 0; i < form.elements.length; i++) {
          if(alreadyChecked.includes(form.elements[i].name)) continue;
          this.validateField(form.elements[i]);
          alreadyChecked.push(form.elements[i].name);
        }

        this.afterFormValidation(form);

        if(!this.isFormValid()) {
          this.onFormValidationError(form, this.getErrors());
        } else {
          this.onFormValidationSuccessful(form);
        }
      },

      /**
       * Validate single field (native JS Object)
       **/
      validateField: function(field = null, forceValue = false) {
        if(field === null) {
          if(this.debug) console.log(`You don't pass a field`);
          return;
        }

        const value = forceValue !== false ? forceValue : field.value;

        const name = field.name;
        const fieldHasParams = this.constraints[name] !== undefined;

        if(name === "") {
          if(this.debug) console.log(`${field} without name!`);
          return;
        }

        if(!fieldHasParams) {
          if(this.debug) console.log(`No constraints for ${name}`);
          return;
        }

        this._removeFieldErrors(name, field);

        this.beforeFieldValidation(field);

        let errorsState = [];
        let errorMessages = [];

        const params = this.constraints[name];

        /**
         * Iterate over field key:values
         **/
        Object.keys(params).map((rule) => {
          let _valid = true;

          if(this.rules[rule] === undefined) {
            if(this.debug) console.log(`Rule not exists for: ${rule}`);
          } else {
            _valid = this.rules[rule].valid(value, field);

            if(!_valid) {
              errorMessages.push( this.getTranslated(`Rules.Errors.${rule}`) );
            }
            errorsState.push( _valid );
          }
        });

        this.afterFieldValidation(field);

        if(errorsState.indexOf(false) >=0 ) {
          this.onFieldValidateError(field, value, errorMessages);
          this._addFieldErrors(name, field, errorMessages);
          return false;
        } else {
          this.onFieldValidateSuccessful(field, value);
          this._removeFieldErrors(name, field);
          return true;
        }
      },

      /**
       * Remove key (fieldName) from errors object
       * Remove field errors from HTML
       **/
      _removeFieldErrors: function(fieldName, field) {
        if(this.errors[fieldName] !== undefined) {
          delete this.errors[fieldName];
        }

        this.removeErrorMessagesFromField(field, fieldName);
      },

      /**
       * Add key (fieldName) with errorsArray, to errors object
       * Add form errors to HTML
       **/
      _addFieldErrors: function(fieldName, field, errorsArray) {
        this.errors[fieldName] = errorsArray;

        this.addErrorMessagesToField(fieldName, errorsArray);
      },

      /**
       * Clear all messages from whole document
       **/
      removeAllErrorMessages: function() {
        this.errors = {};

        const errorsMessages = document.querySelectorAll(`.${this.errorWrapperClass}`);
        errorsMessages.forEach(error => {
          error.remove();
        });
      },

      /**
       * Remove added Errors to HTML from single field
       **/
      removeErrorMessagesFromField: function(field = null, fieldName = false) {
        if(field === null) return;

        const errorsMessages = field.parentElement.querySelectorAll(`.${this.errorWrapperClass}`);
        errorsMessages.forEach(error => {
          error.remove();
        });
      },

      /**
       * Add Errors to HTML of single field
       **/
      addErrorMessagesToField: function(fieldName = null, messages) {
        if(fieldName === null || fieldName === "") {
          if(this.debug) console.log(`No fieldName passed`);
          return;
        }

        let msg = document.createElement('DIV');
        let targetField = document.querySelector(`[name="${fieldName}"]`);
        let parent = targetField.parentElement;

        msg.classList.add(this.errorWrapperClass);

        messages.forEach( message => {
          let inner = document.createElement('SPAN');
          let text = document.createTextNode(message);

          inner.classList.add(this.errorClass);
          inner.appendChild(text);
          msg.appendChild(inner);
        });

        if(this.errorPosition === 'after') {
          parent.appendChild(msg);
        } else {
          parent.insertBefore(msg, targetField);
        }

      },

      /**
       * Check form is valid - based on errors count
       **/
      isFormValid: function() {
        return Object.keys(this.errors).length === 0;
      },

      /**
       * Get errors object - key: errorsArray
       **/
      getErrors: function() {
        return this.isFormValid() ? false: this.errors;
      },

      debugMsg: function (msg) {
        console.log(msg);
      }
    };

    return Validator;

}));

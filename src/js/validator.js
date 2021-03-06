import "./polyfills/index"
import Rules from "./rules"
import Events from "./events"
import DefaultTranslation from "./i18n/en";
import Languages from "./i18n/index"

function Validator(options = {}) {
  const _options = {
    debug: false,
    constraints: {},
    errorWrapperClass: 'form-errors-msgs',
    errorClass: 'single-error-msg',
    errorPosition: 'before', //before|after
    translations: DefaultTranslation,
    language: 'en',
    rules: Rules,
    ...Events
  };

  options = {
    ..._options,
    ...options
  };

  Object.assign(this, options);

  if(DefaultTranslation === options.translations) {
    this._setTranslations(options.language, true);
  } else {
    if(this.debug) console.log(`Translations override by user custom translations passed.`)
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
        console.log(`Invalid property path: ${path}. Check your object below:`)
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
      this.onFormValidationError(form, this.getErrors())
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
          errorMessages.push( this.getTranslated(`Rules.Errors.${rule}`) )
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
    })
  },

  /**
   * Remove added Errors to HTML from single field
   **/
  removeErrorMessagesFromField: function(field = null, fieldName = false) {
    if(field === null) return;

    const errorsMessages = field.parentElement.querySelectorAll(`.${this.errorWrapperClass}`);
    errorsMessages.forEach(error => {
      error.remove();
    })
  },

  /**
   * Add Errors to HTML of single field
   **/
  addErrorMessagesToField: function(fieldName = null, messages) {
    if(fieldName === null || fieldName === "") {
      if(this.debug) console.log(`No fieldName passed`);
      return;
    }

    let msg = document.createElement('DIV')
    let targetField = document.querySelector(`[name="${fieldName}"]`);
    let parent = targetField.parentElement;

    msg.classList.add(this.errorWrapperClass);

    messages.forEach( message => {
      let inner = document.createElement('SPAN')
      let text = document.createTextNode(message);

      inner.classList.add(this.errorClass)
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
}

export default Validator
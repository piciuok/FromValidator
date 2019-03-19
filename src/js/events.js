export default {
    onFieldValidateError: function (field, value, errorMessages) {
        if(this.debug) {
            console.log('Fire onFieldValidateError')
        }
    },

    onFieldValidateSuccessful: function (field, value) {
        if(this.debug) {
            console.log('Fire onFieldValidateSuccessful')
        }
    },

    onFormValidationError: function (form, errorMessages) {
        if(this.debug) {
            console.log('Fire onFormValidationError')
        }
    },

    onFormValidationSuccessful: function (form) {
        if(this.debug) {
            console.log('Fire onFormValidationSuccessful')
        }
    },

    beforeFieldValidation: function (field) {
        if(this.debug) {
            console.log('Fire beforeFieldValidation')
        }
    },

    afterFieldValidation: function (field) {
        if(this.debug) {
            console.log('Fire afterFieldValidation')
        }
    },

    beforeFormValidation: function (form) {
        if(this.debug) {
            console.log('Fire beforeFormValidation')
        }
    },

    afterFormValidation: function (form) {
        if(this.debug) {
            console.log('Fire afterFormValidation')
        }
    }
}
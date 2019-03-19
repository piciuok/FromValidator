# **mp-form-validator**
It's just a simple form validator with events, custom rules, translations, overriding functions.

# `In Development`

## Installation
```
npm i mp-form-validator
```
## Usage
````javascript
import Validator from "mp-form-validator"
````
or
````javascript
import "mp-form-validator/bundle/validator.bundle.min.js"
````
Next, create new Validator instance:
```javascript
var v = new Validator({...params});
```

Params object:

|property| value type | desc |
|:---:|:---:|:---:|
| debug | boolean | Show/hide debug messages in console |
| errorWrapperClass | string | Class name for errors wrapper |
| errorClass | string | Class name of single error |
| errorPosition | string ('before' or 'after') | Where place a error - before or after input |
| constraints | object | Object of constraints |

Default params object:

```javascript
var paramas = {
    debug: true,
    errorWrapperClass: 'form-errors-msgs',
    errorClass: 'single-error-msg',
    errorPosition: 'before',
    constraints: {}
}
```

## Methods

|method|param|return|desc|
|:---:|:---:|:---:|:---:|
| validateField|field,forceValue|boolean|validate single field|
| validateForm|form|boolean|validate passed form|
| isFormValid|-|boolean|check if form is valid|
| removeAllErrorMessages|-|void|remove all added messages to form elements|
| getErrors|-|object|get all form elements|

...where:
- field - DOM element
- form - DOM element
- forceValue - string/boolean - sometimes value of your field is changing with delay (e.g. react setState() method, field is binded with state value, but metod works async and value of DOM element will be one change before - NOW you can pass directly field value and all works fine :))

## Constraints

By default, Validator don't know, what you want to validate - so, let's go!

Sample definition of constraints:

```javascript
var constraints = {
    firstName: {
        required: true,
    },
    phone: {
        required: true,
        phone: true
    },
    email: {
        required: true,
        email: true
    }
};

var params = {
    ...params,
    constraints: constraints
}
```

firstName, phone, email is just name of form element. **Each form element must have a name.**

Order of processing rules is just order of rules in your object - for phone: first will be required, second phone.


## ...and rules

For now, we have only 3 rules available - yes - it's simple but powerful validator :>

| ruleName | description |
| --- | --- |
| required | check if length of field > 0; if checkbox or radio, check if input group has any checked values |
| phone | check if have only digits and 9 numbers |
| email | simple check email  |
| password | check if password has 1 lower, 1 upper, 1 numeric, 1 special and >= 8 chars |

## Custom rules

Yes - you can define your own logic for rules.

For example - you want to validate if entered text >= 10 characters.

First, define your rule:

```javascript
var rules = {
    'text-length': {
        valid: function(value, field) {
          return value.length >= 10;
        }
    }
}
```
...and define translation (if invalid):

```javascript
var translations = {
    Rules: {
        Errors: {
            'text-length': 'You should enter min. 10 chars or greater'
        }
    }
}
```
...and pass it to your params:

```javascript
var params = {
    ...params,
    rules: rules,
    translations: translations
}
```

## Translations

For now, there no implemented language selector (default is only one - english). Of course, you can easily overwrite messages with own - look above. 


## Hooks

Plugin have some hooks inside. You can override default hook, by passing to params object, a function definition:

| functionName | params |
|:---:|:---:|
|onFieldValidateError|field,value,errorMessages|
|onFieldValidateSuccessful|field, value|
|onFormValidationError|form, errorMessages|
|onFormValidationSuccessful|form|
|beforeFieldValidation|field|
|afterFieldValidation|field|
|beforeFormValidation|form|
|afterFormValidation|form|
  
...where:
- field - DOM element
- form - DOM element
- value - string/boolean with field value
- errorMessages - object with errors, where key is a field name, ale value is an array of validation messages

Sample usage:

```javascript
var params = {
    ...params,
    onFormValidationError: function(form, errorMessages) {
      form.querySelector('.btn-submit').classList.add('disabled')
    },
    onFormValidationSuccessful: function(form) {
      form.querySelector('.btn-submit').classList.remove('disabled')
    }
}
```


Notice: 
- There's no validation on submit, you have full control over when & how

## License
[MIT](https://choosealicense.com/licenses/mit/)
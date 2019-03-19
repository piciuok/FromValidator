export default {
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
                })
                return anyChecked;

            } else if(field.type === 'select') {
                return value !== "";
            } else
            return value.length !== 0
        },
    },
    'phone' : {
        valid: (value, field) => {
            const re = /([0-9]+){9}/;
            return re.test(value)
        },
    },
    'email' : {
        valid: (value, field) => {
            const re = /\S+@\S+\.\S+/;
            return re.test(value)
        },
    },
    'password' : {
        valid: (value, field) => {
            console.log(value);
            const minLowercase  = '(?=.*[a-z])';
            const minUppercase  = '(?=.*[A-Z])';
            const minNumeric    = '(?=.*[0-9])';
            const minSpecial    = '(?=.*[!@#\\$%\\^&])';
            const minLenght     = '(?=.{8,})';
            const re = new RegExp(`^${minLowercase}${minUppercase}${minNumeric}${minSpecial}${minLenght}`);
            return re.test(value)
        },
    }
}
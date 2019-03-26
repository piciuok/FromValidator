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
                checkSum = 0, checkDigit = 0, modulo = 0, control = 0;

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
}
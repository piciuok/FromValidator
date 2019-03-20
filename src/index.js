import Validator from "./js/validator"
// import "./../bundle/validator.bundle.min"


let v = new Validator({
    debug: false,
    errorPosition: 'after',
    language: 'pl',
    constraints: {
        inputText: {
            required: true
        },
        inputEmail: {
            required: true,
            email: true
        },
        inputPhone: {
            required: true,
            phone: true
        },
        inputPassword: {
            required: true,
            password: true
        },
        inputRadio: {
            required: true,
        },
        inputCheckbox: {
            required: true,
        },
        inputSelect: {
            required: true,
        },
        inputTextarea: {
            required: true,
        }
    }
});

window.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('test-form');

    v.validateForm(form)
    console.log(v.getErrors());

    const formElements = document.querySelectorAll('input:not([type=radio]),textarea');
    const checkboxes = document.querySelectorAll('input[type=checkbox]');
    const radios = document.querySelectorAll('input[type=radio]');
    const selects = document.querySelectorAll('select');

    formElements.forEach(formEl => {
        formEl.addEventListener('keyup', (e) => {
            console.log('change')
            v.validateField(e.target)
        })
    })

    checkboxes.forEach(formEl => {
        formEl.addEventListener('change', (e) => {
            console.log('change checkbox')
            v.validateField(e.target)
        })
    })

    radios.forEach(formEl => {
        formEl.addEventListener('change', (e) => {
            console.log('change radio')
            v.validateField(e.target)
        })
    })

    selects.forEach(formEl => {
        formEl.addEventListener('change', (e) => {
            console.log('change select')
            v.validateField(e.target)
        })
    })

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        v.validateForm(form);
        console.log(v.getErrors());
    })

})



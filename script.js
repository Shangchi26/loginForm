function Validator(options) {
    function validate(inputElement, rule) {
        var errorMessage = rule.test(inputElement.value);
        var errorElement = inputElement.parentElement.querySelector(options.errorSelector);

        if (errorMessage) {
            errorElement.innerText = errorMessage;
            inputElement.parentElement.classList.add('invalid');
        } else {
            errorElement.innerText = '';
            inputElement.parentElement.classList.remove('invalid');
        }
        return !errorMessage;

    }
    var formElement = document.querySelector(options.form)
    if (formElement) {
        formElement.onsubmit = function(e){
            e.preventDefault();

            var isformValid = true;

            options.rules.forEach(function(rule){
                var inputElement = formElement.querySelector(rule.selector);
                var isValid = validate(inputElement, rule);
                if (!isValid) {
                    isformValid = false;
                }
            });
            if (isformValid) {
                if (typeof options.onSubmit === 'function') {
                    var enebalInputs = formElement.querySelectorAll('[name]');
                    var formValues = Array.from(enebalInputs).reduce(function(values, input){
                        return (values[input.name] = input.value) && values;
                    }, {});
                    options.onSubmit(formValues)
                }
            }
        }

        options.rules.forEach(function(rule){
            var inputElement = formElement.querySelector(rule.selector);
            
            if (inputElement) {
                inputElement.onblur = function() {
                    validate(inputElement, rule);
                }
                inputElement.oninput = function() {
                    var errorElement = inputElement.parentElement.querySelector('.form-message');
                    errorElement.innerText = '';
                    inputElement.parentElement.classList.remove('invalid');
                    inputElement.parentElement.classList.add('valid');
                    }
            }
        });
    }
}
// định nghĩa rules
Validator.isRequired = function(selector){
    return {
        selector: selector,
        test: function(value){
            return value.trim() ? undefined : 'Vui lòng nhập!'
        }
    };
}

Validator.isEmail = function(selector){
    return {
        selector: selector,
        test: function(value){
            var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            return regex.test(value) ? undefined : 'Phải nhập email!'
        }
    };
}

Validator.minLength = function(selector, min){
    return {
        selector: selector,
        test: function(value){
            return value.length >= min ? undefined : 'Nhập tối thiếu ' + min + ' kí tự';
        }
    };
}

Validator.isComfirmed = function(selector, getConfirmValue){
    return {
        selector: selector,
        test: function(value){
            return value === getConfirmValue() ? undefined : 'Không chính xác';
        }
    }
}
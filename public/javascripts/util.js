function getFormAsJson(form) {
    const json = {};
    for (let pair of new FormData(form).entries()) {
        json[pair[0]] = pair[1];
    }

    return json;
}

function formIsValid(form) {
    let hasErrors = true;
    const inputs = form.querySelectorAll('input, select');
    inputs.forEach(input => {
        if (input.required && input.value === '') {
            hasErrors = false;
            input.parentElement.classList.add('invalid');
        }
    });

    return hasErrors;
};
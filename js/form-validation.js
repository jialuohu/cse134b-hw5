const form = document.getElementById('contact-form');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const commentsInput = document.getElementById('comments');
const errorOutput = document.getElementById('error-message');
const infoOutput = document.getElementById('info-message');
const charCounter = document.getElementById('char-counter');
const charCount = document.getElementById('char-count');
const formErrorsField = document.getElementById('form-errors-field');

const form_errors = [];

const CHAR_LIMIT = 1000;
const CHAR_WARNING_THRESHOLD = 900; 
const ERROR_FADE_TIME = 4000; 

function trackError(fieldName, errorType, errorMessage, value = '') {
    const error = {
        timestamp: new Date().toISOString(),
        field: fieldName,
        errorType: errorType,
        message: errorMessage,
        attemptedValue: value.substring(0, 50) 
    };
    form_errors.push(error);
    console.log('Error tracked:', error);
}

function showErrorMessage(message) {
    errorOutput.textContent = message;
    errorOutput.classList.remove('fade-out');

    // fade out after time
    setTimeout(() => {
        errorOutput.classList.add('fade-out');
        setTimeout(() => {
            errorOutput.textContent = '';
            errorOutput.classList.remove('fade-out');
        }, 300);
    }, ERROR_FADE_TIME);
}

function showInfoMessage(message) {
    infoOutput.textContent = message;
    infoOutput.classList.remove('fade-out');

    setTimeout(() => {
        infoOutput.classList.add('fade-out');
        setTimeout(() => {
            infoOutput.textContent = '';
            infoOutput.classList.remove('fade-out');
        }, 300);
    }, ERROR_FADE_TIME);
}

function flashField(field) {
    field.classList.add('flash-error');
    setTimeout(() => {
        field.classList.remove('flash-error');
    }, 300);
}

nameInput.addEventListener('input', function(e) {
    const pattern = /^[A-Za-z\s\-']*$/;
    const value = this.value;

    if (!pattern.test(value)) {
        // find and remove invalid character
        const validValue = value.replace(/[^A-Za-z\s\-']/g, '');
        const invalidChar = value.replace(/[A-Za-z\s\-']/g, '');

        this.value = validValue;
        flashField(this);
        showErrorMessage(`Invalid character "${invalidChar}": Only letters, spaces, hyphens, and apostrophes allowed`);

        trackError('name', 'invalid_character',
            `Invalid character entered: "${invalidChar}"`,
            value);
    }
});

commentsInput.addEventListener('input', function(e) {
    const currentLength = this.value.length;
    charCount.textContent = currentLength;
    if (currentLength > CHAR_LIMIT) {
        charCounter.classList.add('error');
        charCounter.classList.remove('warning');
        this.classList.add('invalid');
        this.classList.remove('valid');

        trackError('comments', 'max_length_exceeded',
            `Character limit exceeded: ${currentLength}/${CHAR_LIMIT}`,
            this.value);
    } else if (currentLength >= CHAR_WARNING_THRESHOLD) {
        charCounter.classList.add('warning');
        charCounter.classList.remove('error');
        this.classList.remove('invalid', 'valid');
    } else {
        charCounter.classList.remove('warning', 'error');
        this.classList.remove('invalid', 'valid');
    }
});

function validateName() {
    const value = nameInput.value.trim();
    const namePattern = /^[A-Za-z\s\-']+$/;
    if (value === '') {
        nameInput.setCustomValidity('Name is required');
        nameInput.classList.add('invalid');
        nameInput.classList.remove('valid');
        return false;

    } else if (value.length < 3) {
        nameInput.setCustomValidity('Name must be at least 3 characters long');
        nameInput.classList.add('invalid');
        nameInput.classList.remove('valid');
        trackError('name', 'min_length', 'Name too short (less than 3 characters)', value);
        return false;

    } else if (value.length > 100) {
        nameInput.setCustomValidity('Name must be less than 100 characters');
        nameInput.classList.add('invalid');
        nameInput.classList.remove('valid');
        trackError('name', 'max_length', 'Name too long (more than 100 characters)', value);
        return false;

    } else if (!namePattern.test(value)) {
        nameInput.setCustomValidity('Name can only contain letters, spaces, hyphens, and apostrophes');
        nameInput.classList.add('invalid');
        nameInput.classList.remove('valid');
        trackError('name', 'pattern_mismatch', 'Name contains invalid characters', value);
        return false;

    } else {
        nameInput.setCustomValidity('');
        nameInput.classList.remove('invalid');
        nameInput.classList.add('valid');
        return true;
    }
}
function validateEmail() {
    const value = emailInput.value.trim();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (value === '') {
        emailInput.setCustomValidity('Email is required');
        emailInput.classList.add('invalid');
        emailInput.classList.remove('valid');
        return false;
    } else if (!emailPattern.test(value)) {
        emailInput.setCustomValidity('Please enter a valid email address');
        emailInput.classList.add('invalid');
        emailInput.classList.remove('valid');
        trackError('email', 'pattern_mismatch', 'Invalid email format', value);
        return false;
    } else if (value.length > 50) {
        emailInput.setCustomValidity('Email must be less than 50 characters');
        emailInput.classList.add('invalid');
        emailInput.classList.remove('valid');
        trackError('email', 'max_length', 'Email too long (more than 50 characters)', value);
        return false;
    } else {
        emailInput.setCustomValidity('');
        emailInput.classList.remove('invalid');
        emailInput.classList.add('valid');
        return true;
    }
}
function validateComments() {
    const value = commentsInput.value;

    if (value.length > CHAR_LIMIT) {
        commentsInput.setCustomValidity(`Comments must be less than ${CHAR_LIMIT} characters`);
        commentsInput.classList.add('invalid');
        commentsInput.classList.remove('valid');
        return false;
    } else {
        commentsInput.setCustomValidity('');
        commentsInput.classList.remove('invalid', 'valid');
        return true;
    }
}

// name field
nameInput.addEventListener('blur', function() {
    if (this.value.trim() !== '') {
        validateName();
    }
});
nameInput.addEventListener('input', function() {
    if (this.value.trim() !== '') {
        validateName();
    } else {
        this.classList.remove('valid', 'invalid');
    }
});

// email field
emailInput.addEventListener('blur', function() {
    if (this.value.trim() !== '') {
        validateEmail();
    }
});
emailInput.addEventListener('input', function() {
    if (this.value.trim() !== '') {
        validateEmail();
    } else {
        this.classList.remove('valid', 'invalid');
    }
});

// comment field
commentsInput.addEventListener('blur', function() {
    validateComments();
});


// submit
form.addEventListener('submit', function(e) {
    e.preventDefault();

    // clear previous errors
    errorOutput.textContent = '';
    infoOutput.textContent = '';

    // validate
    const isNameValid = validateName();
    const isEmailValid = validateEmail();
    const isCommentsValid = validateComments();

    if (!form.checkValidity() || !isNameValid || !isEmailValid || !isCommentsValid) {
        trackError('form', 'submit_failed', 'Form submission attempted with validation errors', '');

        // first invalid
        const invalidField = form.querySelector(':invalid, .invalid');
        if (invalidField) {
            invalidField.focus();
            showErrorMessage('Please correct the errors in the form before submitting');
        }

        return false;
    }

    formErrorsField.value = JSON.stringify(form_errors);
    console.log('Form Errors Log:', form_errors);
    console.log('Form Errors JSON:', formErrorsField.value);

    showInfoMessage('Form validated successfully! Submitting...');

    setTimeout(() => {
        form.submit();
    }, 500);
});

// characters counter
document.addEventListener('DOMContentLoaded', function() {
    charCount.textContent = commentsInput.value.length;
});

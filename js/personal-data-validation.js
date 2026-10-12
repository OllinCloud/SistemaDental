/* Validaciones compartidas de datos personales de pacientes. */
(function () {
    const namePattern = /^[\p{L}\p{M} \p{Zs}'\u2019-]+$/u;

    function localDateString(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    function isValidBirthDate(value) {
        if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
        const [year, month, day] = value.split('-').map(Number);
        const date = new Date(0);
        date.setHours(0, 0, 0, 0);
        date.setFullYear(year, month - 1, day);
        if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
            return false;
        }
        return value <= localDateString(new Date());
    }

    function clearError(field, errorElement) {
        field.removeAttribute('aria-invalid');
        if (errorElement) {
            errorElement.textContent = '';
            errorElement.hidden = true;
        }
    }

    function showError(field, errorElement, message) {
        field.setAttribute('aria-invalid', 'true');
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.hidden = false;
        }
    }

    function updateEmailValidity(rule, field) {
        field.setCustomValidity('');
        if (field.value.trim() && field.validity.typeMismatch) {
            field.setCustomValidity(rule.message);
        }
    }

    const boundFields = new WeakSet();

    function bind(form, fieldRules) {
        fieldRules.forEach(function (rule) {
            const field = form.elements.namedItem(rule.id);
            if (boundFields.has(field)) return;
            boundFields.add(field);
            const errorElement = document.getElementById(rule.errorId);
            field.addEventListener('input', function () {
                if (rule.trim !== false && field.type === 'email') {
                    const trimmed = field.value.trim();
                    if (trimmed !== field.value) field.value = trimmed;
                }
                if (field.type === 'email') updateEmailValidity(rule, field);
                const current = field.value.trim();
                if (current ? (!rule.check || rule.check(field, current)) : rule.required === false) {
                    clearError(field, errorElement);
                }
            });
            field.addEventListener('blur', function () {
                if (rule.trim !== false) field.value = field.value.trim();
                if (field.type === 'email') updateEmailValidity(rule, field);
            });
            field.addEventListener('invalid', function () {
                if (field.type === 'email') {
                    updateEmailValidity(rule, field);
                    clearError(field, errorElement);
                    return;
                }
                if (rule.required && !field.value.trim()) {
                    showError(field, errorElement, rule.message);
                } else if (field.validity.typeMismatch) {
                    showError(field, errorElement, rule.message);
                }
            });
        });

        form.addEventListener('reset', function () {
            clear(form, fieldRules);
        });
    }

    function validate(form, fieldRules) {
        const invalidFields = [];

        fieldRules.forEach(function (rule) {
            const field = form.elements.namedItem(rule.id);
            const errorElement = document.getElementById(rule.errorId);
            if (rule.trim !== false) field.value = field.value.trim();
            if (field.type === 'email') updateEmailValidity(rule, field);
            clearError(field, errorElement);

            const value = field.value;
            const valid = (rule.required === false || value !== '') &&
                (!value || !rule.check || rule.check(field, value));
            if (!valid) {
                showError(field, errorElement, rule.message);
                invalidFields.push(field);
            }

        });

        if (invalidFields.length) {
            invalidFields[0].scrollIntoView({ behavior: 'smooth', block: 'center' });
            invalidFields[0].focus({ preventScroll: true });
            return false;
        }
        return true;
    }

    function refresh(form, fieldRules) {
        fieldRules.forEach(function (rule) {
            const field = form.elements.namedItem(rule.id);
            if (field.type !== 'email') return;
            updateEmailValidity(rule, field);
            clearError(field, document.getElementById(rule.errorId));
        });
    }

    function clear(form, fieldRules) {
        fieldRules.forEach(function (rule) {
            const field = form.elements.namedItem(rule.id);
            if (field.type === 'email') field.setCustomValidity('');
            clearError(field, document.getElementById(rule.errorId));
        });
    }

    function nameCheck(_field, value) {
        return namePattern.test(value);
    }

    function birthDateCheck(_field, value) {
        return isValidBirthDate(value);
    }

    function emailCheck(field, value) {
        field.value = value;
        return field.checkValidity();
    }

    function emergencyPhoneCheck(field) {
        return window.MexicanPhone.isValid(field);
    }

    function phoneCheck(field) {
        return window.MexicanPhone.isValid(field);
    }

    window.PersonalDataValidation = Object.freeze({
        validate,
        refresh,
        clear,
        bind,
        nameCheck,
        birthDateCheck,
        emailCheck,
        phoneCheck,
        emergencyPhoneCheck
    });
})();

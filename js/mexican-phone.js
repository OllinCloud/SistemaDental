/* Compartido por los formularios de alta y edición de pacientes. */
(function () {
    function normalize(value) {
        return String(value ?? '').replace(/\D/g, '');
    }

    function format(value) {
        const digits = normalize(value);
        if (digits.length <= 2) return digits;
        if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
        return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6, 10)}${digits.slice(10)}`;
    }

    function isValid(input) {
        const value = input.value.trim();
        const digits = normalize(value);
        return input.dataset.invalidCharacters !== 'true' &&
            /^[\d\s()-]+$/.test(value) &&
            !digits.startsWith('52') &&
            digits.length === 10;
    }

    function attach(input) {
        input.dataset.invalidCharacters = 'false';
        input.addEventListener('input', function () {
            const value = input.value;
            const selectionStart = input.selectionStart ?? value.length;
            const digitsBeforeCursor = (value.slice(0, selectionStart).match(/\d/g) || []).length;
            const hasInvalidCharacters = /[^\d\s()-]/.test(value);
            const digits = normalize(value);

            input.dataset.invalidCharacters = hasInvalidCharacters ? 'true' : 'false';
            input.value = format(digits);

            let cursor = 0;
            let seenDigits = 0;
            while (cursor < input.value.length && seenDigits < digitsBeforeCursor) {
                if (/\d/.test(input.value[cursor])) seenDigits++;
                cursor++;
            }
            input.setSelectionRange(cursor, cursor);
        });
    }

    window.MexicanPhone = Object.freeze({ normalize, format, isValid, attach });
})();

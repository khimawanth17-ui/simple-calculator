
let display = document.getElementById("display");

// Add value to display
function appendValue(value) {
    if (display.value === "Error") {
        display.value = "";
    }

    display.value += value;
}

// Clear display
function clearDisplay() {
    display.value = "";
}

// Delete last character
function deleteLast() {
    display.value = display.value.slice(0, -1);
}

// Calculate result
function calculate() {
    try {
        let expression = display.value;

        if (expression === "") {
            return;
        }

        // Allow only calculator characters
        if (!/^[0-9+\-*/%.() ]+$/.test(expression)) {
            throw new Error("Invalid");
        }

        // Convert expression into tokens
        let tokens = expression.match(
            /(\d*\.?\d+|[+\-*/%])/g
        );

        if (!tokens || tokens.join("") !== expression.replace(/\s/g, "")) {
            throw new Error("Invalid");
        }

        let position = 0;

        function parseExpression() {
            let result = parseTerm();

            while (
                tokens[position] === "+" ||
                tokens[position] === "-"
            ) {
                let operator = tokens[position++];
                let next = parseTerm();

                result = operator === "+"
                    ? result + next
                    : result - next;
            }

            return result;
        }

        function parseTerm() {
            let result = parseNumber();

            while (
                ["*", "/", "%"].includes(tokens[position])
            ) {
                let operator = tokens[position++];
                let next = parseNumber();

                if (
                    (operator === "/" || operator === "%") &&
                    next === 0
                ) {
                    throw new Error("Cannot divide by zero");
                }

                if (operator === "*") result *= next;
                if (operator === "/") result /= next;
                if (operator === "%") result %= next;
            }

            return result;
        }

        function parseNumber() {
            let token = tokens[position++];

            if (token === "+" || token === "-") {
                let number = parseNumber();
                return token === "-" ? -number : number;
            }

            if (!token || !/^\d*\.?\d+$/.test(token)) {
                throw new Error("Invalid");
            }

            return Number(token);
        }

        let result = parseExpression();

        if (position !== tokens.length || !Number.isFinite(result)) {
            throw new Error("Invalid");
        }

        display.value = Number(result.toPrecision(12));

    } catch (error) {
        display.value = "Error";
    }
}
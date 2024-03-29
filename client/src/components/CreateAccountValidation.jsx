function Validation(values) {
    let error = {};
    const email_pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const password_pattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9]{8,}$/;

    if (values.full_name === "") {
        error.full_name = "Name should not be empty";
    } else {
        error.full_name = "";
    }

    if (values.age === "") {
        error.age = "Age should not be empty";
    } else if (values.age === 0) {
        error.age = "Age cannot be zero";
    } else if (values.age < 0) {
        error.age = "Age cannot less than zero";
    } else {
        error.age = "";
    }

    if (values.email === "") {
        error.email = "Email should not be empty";
    } else if (!email_pattern.test(values.email)) {
        error.email = "Email format is invalid";
    } else {
        error.email = "";
    }

    if (values.password === "") {
        error.password = "Password should not be empty";
    } else if (!password_pattern.test(values.password)) {
        error.password = "Password must contain at least 8 characters, including one digit, one lowercase letter, and one uppercase letter";
    } else {
        error.password = "";
    }

    return error;
}

export default Validation;

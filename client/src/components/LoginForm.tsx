import { useState } from "react";
import {isValidEmail, isValidPassword} from "../utils/validation";
import {login as loginApi} from "../api/auth";
import {useAuth} from "../context/AuthContext";
import {Link, useNavigate} from "react-router-dom";

const LoginForm = () => {
    const [emailInput, setEmailInput] = useState('');
    const [passwordInput, setPasswordInput] = useState('');

    const navigate = useNavigate();
    const {login} = useAuth();

    const handleLogin = async () => {
        const emailInputLowerCase = emailInput.toLowerCase().trim();

        // Complete validation later
        if (!isValidEmail(emailInputLowerCase)) {
            alert('Please enter a valid email address');
            return;
        }

        if (!isValidPassword(passwordInput)) {
            alert("Password must be at least 6 characters.");
            return;
        }

        try {
            const response = await loginApi(emailInputLowerCase, passwordInput);
            login(response.token, response.user);
            navigate("/");
        }
        catch (error: any) {
            const errorMessage = error.response?.data?.message || "Login failed!"
            alert(errorMessage);
            console.error(error);
        }
    }

    return (
      <div id="login-form">
          <input
              id="input-user"
              type="text"
              placeholder="Enter email"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}/>
          <input
              id="input-pass"
              type="password"
              placeholder="Enter password"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}/>
          <button onClick={handleLogin}>
              Login
          </button>
          <p>Don't have an account? <Link id="auth-switch" to="/register">Sign up</Link></p>
      </div>
    );
}

export default LoginForm;
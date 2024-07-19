import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css'; 

function Login() {
    const [values, setValues] = useState({
        email: '',
        password: ''
    });

    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const handleInput = (event) => {
        const { name, value } = event.target;
        setValues((prevValues) => ({ ...prevValues, [name]: value }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await axios.post('http://localhost:8081/user/signIn', values);

            console.log('Login successful:', response.data);
 
            const { token } = response.data.user;

            localStorage.setItem('authToken', token);

            navigate('/dashboard');
        } catch (error) {
            console.error('Error logging in:', error);
            setErrors({
                general: error.response?.data?.message || 'An error occurred during login'
            });
        }
    };

    return (
        <div className='login-container'>
            <div className='login-form'>
                <h2>Login</h2>
                <form onSubmit={handleSubmit}>
                    {errors.general && <div className='alert alert-danger'>{errors.general}</div>}
                    
                    <div className='mb-3'>
                        <label htmlFor='email'><strong>Email</strong></label>
                        <input
                            type='email'
                            id='email'
                            placeholder='Enter Email'
                            name='email'
                            value={values.email}
                            onChange={handleInput}
                            className='form-control'
                        />
                        {errors.email && <small className='text-danger'>{errors.email}</small>}
                    </div>
                    
                    <div className='mb-3'>
                        <label htmlFor='password'><strong>Password</strong></label>
                        <input
                            type='password'
                            id='password'
                            placeholder='Enter Password'
                            name='password'
                            value={values.password}
                            onChange={handleInput}
                            className='form-control'
                        />
                        {errors.password && <small className='text-danger'>{errors.password}</small>}
                    </div>
                    
                    <div className='form-buttons'>
                        <button type='submit' className='btn btn-success w-100'>
                            Login
                        </button>
                    </div>
                    
                    <p>You agree to our terms and policies</p>
                    <Link to='/signup' className='btn btn-default w-100 text-decoration-none'>
                        Create Account
                    </Link>
                </form>
            </div>
        </div>
    );
}

export default Login;

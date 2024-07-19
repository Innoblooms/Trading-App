import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Signup.css';  

function Signup() {
    const [values, setValues] = useState({
        name: '',
        email: '',
        password: '',
        age: '',
        adhaarImage: null,
        panImage: null,
        bank_statements: null
    });

    const [errors, setErrors] = useState({});
    const [currentStep, setCurrentStep] = useState(1);
    const navigate = useNavigate();

    const handleInput = (e) => {
        const { name, value, type, files } = e.target;
        setValues({
            ...values,
            [name]: type === 'file' ? files[0] : value
        });
    };

    const handleNext = () => {
        setCurrentStep(currentStep + 1);
    };

    const handlePrevious = () => {
        setCurrentStep(currentStep - 1);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Basic form validation
        const newErrors = {};
        if (currentStep === 1) {
            if (!values.name) newErrors.name = 'Name is required';
            if (!values.email) newErrors.email = 'Email is required';
            if (!values.password) newErrors.password = 'Password is required';
            if (!values.age) newErrors.age = 'Age is required';
        } else if (currentStep === 2) {
            if (!values.adhaarImage) newErrors.adhaarImage = 'Adhaar Image is required';
            if (!values.panImage) newErrors.panImage = 'PAN Image is required';
            if (!values.bank_statements) newErrors.bank_statements = 'Bank Statements are required';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        if (currentStep === 2) {
            const formData = new FormData();
            formData.append('name', values.name);
            formData.append('email', values.email);
            formData.append('password', values.password);
            formData.append('age', values.age);
            formData.append('adhaarImage', values.adhaarImage);
            formData.append('panImage', values.panImage);
            formData.append('bank_statements', values.bank_statements);

            try {
                const response = await axios.post('http://localhost:8081/user/register', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
                console.log('User created:', response.data);
                navigate('/');
            } catch (error) {
                console.error('Error creating user:', error);
                if (error.response && error.response.data) {
                    setErrors({ general: error.response.data.message || 'Error creating user' });
                } else {
                    setErrors({ general: 'Error creating user' });
                }
            }
        } else {
            handleNext();
        }
    };

    return (
        <div className='signup-container'>
            <div className='signup-form'>
                <h2>Sign Up</h2>
                <form onSubmit={handleSubmit}>
                    {errors.general && <div className='alert alert-danger'>{errors.general}</div>}
                    
                    {currentStep === 1 && (
                        <>
                            <div className='mb-3'>
                                <label htmlFor='name'><strong>Name</strong></label>
                                <input
                                    type='text'
                                    placeholder='Enter your name'
                                    name='name'
                                    value={values.name}
                                    onChange={handleInput}
                                    className='form-control'
                                />
                                {errors.name && <small className='text-danger'>{errors.name}</small>}
                            </div>
                            <div className='mb-3'>
                                <label htmlFor='email'><strong>Email</strong></label>
                                <input
                                    type='email'
                                    placeholder='Enter your email'
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
                                    placeholder='Enter Password'
                                    name='password'
                                    value={values.password}
                                    onChange={handleInput}
                                    className='form-control'
                                />
                                {errors.password && <small className='text-danger'>{errors.password}</small>}
                            </div>
                            <div className='mb-3'>
                                <label htmlFor='age'><strong>Age</strong></label>
                                <input
                                    type='number'
                                    placeholder='Enter your age'
                                    name='age'
                                    value={values.age}
                                    onChange={handleInput}
                                    className='form-control'
                                />
                                {errors.age && <small className='text-danger'>{errors.age}</small>}
                            </div>
                        </>
                    )}
                    
                    {currentStep === 2 && (
                        <>
                            <div className='mb-3'>
                                <label htmlFor='adhaarImage'><strong>Adhaar Image</strong></label>
                                <input
                                    type='file'
                                    name='adhaarImage'
                                    onChange={handleInput}
                                    className='form-control'
                                />
                                {errors.adhaarImage && <small className='text-danger'>{errors.adhaarImage}</small>}
                            </div>
                            <div className='mb-3'>
                                <label htmlFor='panImage'><strong>PAN Image</strong></label>
                                <input
                                    type='file'
                                    name='panImage'
                                    onChange={handleInput}
                                    className='form-control'
                                />
                                {errors.panImage && <small className='text-danger'>{errors.panImage}</small>}
                            </div>
                            <div className='mb-3'>
                                <label htmlFor='bank_statements'><strong>Bank Statements</strong></label>
                                <input
                                    type='file'
                                    name='bank_statements'
                                    onChange={handleInput}
                                    className='form-control'
                                />
                                {errors.bank_statements && <small className='text-danger'>{errors.bank_statements}</small>}
                            </div>
                        </>
                    )}

                    <div className='form-buttons'>
                        {currentStep > 1 && (
                            <button type='button' onClick={handlePrevious} className='btn btn-secondary'>Previous</button>
                        )}
                        <button type='submit' className='btn btn-success'>
                            {currentStep === 1 ? 'Next' : 'Submit'}
                        </button>
                    </div>

                    <p>You agree to our terms and policies</p>
                    <Link to='/' className='btn btn-default w-100 text-decoration-none'>Login</Link>
                </form>
            </div>
        </div>
    );
}

export default Signup;
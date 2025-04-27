import * as React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SignupPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState('');
    const [type, setType] = useState("customer");

    const handleSelect = (e: any) => {
        setType(e.target.value);
    };

    const navigate = useNavigate();

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        setError(''); // Clear any previous errors

        try {
            // Send a POST request to the signup endpoint on the server
            const response = await fetch('http://localhost:8000/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password, type, name }),
            });

            // Check if the signup was successful
            if (response.ok) 
            {
                console.log('Signup successful');
                navigate('/home', { state: { username: username, type: type, name:name } });
            } 
            else 
            {
                const data = await response.json();
                setError(data.message || 'Error signing up. Please try again.');
            }
        } catch (error) {
            // If an error occurs during the signup process, log the error
            console.error('Signup error:', error);
            setError('Network error. Please check your connection and try again.');
        }
    };

    return (
        <div>
            <h2>Signup</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Name:</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Username:</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Signup</button>
            </form>
        </div>
    );
};

export default SignupPage;

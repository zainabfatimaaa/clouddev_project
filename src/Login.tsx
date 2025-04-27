import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [type, setType] = useState("customer");

    const handleSelect = (e : any) => {
        setType(e.target.value);
    };

    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e: any) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:8000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password, type }),
            });

            if (response.ok) 
            {
                let result = await response.json()
                console.log("result: ", result)
                navigate('/home', { state: { username: username, type: type, name:result.name } });
            } 
            else 
            {
                const data = await response.json();
                setError(data.message);
            }
        } catch (error) {
            console.error('Login error:', error);
        }

    };

    return (
        <div>
            <h2>Login</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleSubmit}>
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
                <div>
                    <label>
                        Customer or employee?:
                        <select onChange={handleSelect}>
                            <option  value="customer">Customer</option>
                            <option value="employee">Employee</option>
                        </select>
                    </label>
                </div>
                <button type="submit">Login</button>
            </form>
            <p>New to Auction app? <Link to="/signup">Signup</Link></p>
        </div>
    );
};

export default LoginPage;

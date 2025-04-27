import * as React from 'react';
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from './NavBar';

interface OrderItem {
    name: string;
    description: string;
    price: number;
    qty: number;
}

interface Order {
    order: OrderItem[];
    total: number;
    user: string;
}

const ProfilePage = () => {
    const location = useLocation();
    const username = location.state?.username;
    const name = location.state?.name;
    const type = location.state?.type;

    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        // Function to fetch user's orders directly from the API
        const fetchMyOrders = async () => {
            try {
                setLoading(true);
                setError('');
                
                const response = await fetch(`http://localhost:8000/my-orders/${username}`);
                
                if (response.ok) {
                    const data = await response.json();
                    console.log("Profile orders:", data.orders);
                    setOrders(data.orders);
                } else {
                    const errorData = await response.json();
                    setError(errorData.message || 'Failed to fetch orders');
                    console.error('Failed to fetch orders:', response.statusText);
                }
            } catch (err) {
                setError('Error connecting to the server. Please try again later.');
                console.error('Error fetching orders:', err);
            } finally {
                setLoading(false);
            }
        };

        if (username) {
            fetchMyOrders();
        }
    }, [username]);

    return (
        <div style={styles.container}>
            <Navbar username={username} type={type} name={name} />
            <h2>My Profile</h2>
            <div>
                <p>Name: {name}</p>
                <p>Username: {username}</p>
                <p>Role: {type}</p>
            </div>
            <h3>Order History</h3>
            
            {loading && <p>Loading your order history...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
            
            {!loading && !error && orders.length === 0 && (
                <p>You don't have any orders yet.</p>
            )}
            
            <div>
                {orders.map((order, index) => (
                    <div key={index} style={styles.card}>
                        {order.order.map((item, itemId) => (
                            <div key={itemId} style={styles.card}>
                                <h3>{item.name}</h3>
                                <p>Description: {item.description}</p>
                                <p>Price: {item.price}</p>
                                <p>Quantity: {item.qty}</p>
                            </div>
                        ))}
                        <p>Total: {order.total}</p>
                        <p>User: {order.user}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

const styles = {
    container: {
        maxWidth: '600px',
        margin: '0 auto',
        padding: '20px',
        backgroundColor: '#f0f0f0',
        borderRadius: '5px',
    },
    card: {
        border: '1px solid #ccc',
        borderRadius: '5px',
        padding: '10px',
        marginBottom: '10px',
    },
};

export default ProfilePage;

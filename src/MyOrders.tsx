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
    id?: string;
    order: OrderItem[];
    total: number;
    user: string;
    status?: string;
}

const MyOrdersPage = () => {
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
            if (!username) {
                setError('Username is missing. Please log in again.');
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError('');
                
                console.log(`Fetching orders for user: ${username}`);
                const response = await fetch(`http://localhost:8000/my-orders/${username}`);
                
                if (!response.ok) {
                    const errorText = await response.text();
                    console.error('Error response:', errorText);
                    
                    try {
                        const errorData = JSON.parse(errorText);
                        setError(errorData.message || errorData.error || 'Failed to fetch orders');
                    } catch (parseError) {
                        setError(`Server error: ${response.status} ${response.statusText}`);
                    }
                    
                    console.error('Failed to fetch orders:', response.statusText);
                    setLoading(false);
                    return;
                }
                
                const data = await response.json();
                console.log("My orders response:", data);
                
                if (!data || !Array.isArray(data.orders)) {
                    console.error('Invalid data format:', data);
                    setError('Invalid data format received from server');
                    setLoading(false);
                    return;
                }
                
                setOrders(data.orders);
            } catch (err) {
                console.error('Error fetching orders:', err);
                setError('Error connecting to the server. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchMyOrders();
    }, [username]);
    
    return (
        <div style={styles.container}>
            <Navbar username={username} type={type} name={name}/>
            <h2>My Orders</h2>
            
            {loading && <p>Loading your orders...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
            
            {!loading && !error && orders.length === 0 && (
                <p>You don't have any orders yet.</p>
            )}
            
            <div>
                {orders.map((order, index) => (
                    <div key={index} style={styles.card}>
                        <h3>Order #{order.id || index + 1}</h3>
                        <p>Status: {order.status || 'Processing'}</p>
                        
                        {Array.isArray(order.order) ? (
                            order.order.map((item, itemId) => (
                                <div key={itemId} style={styles.itemCard}>
                                    <h4>{item.name || 'Unknown Item'}</h4>
                                    <p>Description: {item.description || 'No description'}</p>
                                    <p>Price: ${item.price?.toFixed(2) || '0.00'}</p>
                                    <p>Quantity: {item.qty || 0}</p>
                                </div>
                            ))
                        ) : (
                            <p>No items in this order</p>
                        )}
                        
                        <p>Total: ${order.total?.toFixed(2) || '0.00'}</p>
                        <p>User: {order.user || username}</p>
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
        backgroundColor: '#fff',
    },
    itemCard: {
        border: '1px solid #eee',
        borderRadius: '3px',
        padding: '8px',
        marginBottom: '8px',
        backgroundColor: '#f9f9f9',
    }
};

export default MyOrdersPage;

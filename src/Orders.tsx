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
    id: string;
    order: OrderItem[];
    total: number;
    user: string;
    status: string;
}

const OrdersPage = () => {
    const location = useLocation();
    const username = location.state?.username;
    const name = location.state?.name;
    const type = location.state?.type;

    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [updateStatus, setUpdateStatus] = useState<{ [key: string]: boolean }>({});

    const fetchAllOrders = async () => {
        try {
            setLoading(true);
            setError('');
            
            const response = await fetch('http://localhost:8000/all-orders');
            
            if (response.ok) {
                const data = await response.json();
                console.log("All orders:", data.orders);
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

    useEffect(() => {
        fetchAllOrders();
    }, []);

    const handleUpdateStatus = async (orderId: string) => {
        try {
            setUpdateStatus(prev => ({ ...prev, [orderId]: true }));
            
            const response = await fetch(`http://localhost:8000/update-order-status/${orderId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    status: 'Confirmed and Delivered' 
                }),
            });
            
            if (response.ok) {
                // Update the local orders state to reflect the change
                setOrders(prevOrders => 
                    prevOrders.map(order => 
                        order.id === orderId 
                            ? { ...order, status: 'Confirmed and Delivered' } 
                            : order
                    )
                );
            } else {
                const errorData = await response.json();
                console.error('Failed to update order status:', errorData.message);
                alert(`Failed to update order status: ${errorData.message || 'Unknown error'}`);
            }
        } catch (error) {
            console.error('Error updating order status:', error);
            alert('Failed to update order status. Please try again.');
        } finally {
            setUpdateStatus(prev => ({ ...prev, [orderId]: false }));
        }
    };

    return (
        <div style={styles.container}>
            <Navbar username={username} type={type} name={name}/>
            <h2>Orders</h2>
            
            {loading && <p>Loading orders...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
            
            {!loading && !error && orders.length === 0 && (
                <p>There are no orders currently in the system.</p>
            )}
            
            <div>
                {orders.map((order, index) => (
                    <div key={index} style={styles.card}>
                        <div style={styles.orderHeader}>
                            <h3>Order #{order.id}</h3>
                            <div style={styles.statusContainer}>
                                <span style={{
                                    ...styles.statusBadge,
                                    backgroundColor: order.status === 'Processing' ? '#ff9800' : '#4caf50'
                                }}>
                                    {order.status}
                                </span>
                                
                                {order.status === 'Processing' && (
                                    <button 
                                        onClick={() => handleUpdateStatus(order.id)}
                                        disabled={updateStatus[order.id]}
                                        style={styles.updateButton}
                                    >
                                        {updateStatus[order.id] ? 'Updating...' : 'Mark as Delivered'}
                                    </button>
                                )}
                            </div>
                        </div>
                        <p style={styles.userInfo}>Customer: {order.user}</p>
                        
                        <div style={styles.itemsContainer}>
                            <h4>Items:</h4>
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
                        </div>
                        
                        <p style={styles.total}>Total: ${order.total?.toFixed(2) || '0.00'}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

const styles = {
    container: {
        maxWidth: '800px',
        margin: '0 auto',
        padding: '20px',
        backgroundColor: '#f5f5f5',
        borderRadius: '5px',
    },
    card: {
        border: '1px solid #ddd',
        borderRadius: '5px',
        padding: '15px',
        marginBottom: '15px',
        backgroundColor: '#fff',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    },
    orderHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '10px',
        borderBottom: '1px solid #eee',
        paddingBottom: '10px',
    },
    statusContainer: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
    },
    statusBadge: {
        padding: '4px 8px',
        borderRadius: '4px',
        color: 'white',
        fontSize: '14px',
        fontWeight: 'bold',
    },
    updateButton: {
        padding: '6px 12px',
        backgroundColor: '#4caf50',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '14px',
    },
    userInfo: {
        fontSize: '14px',
        color: '#555',
        marginBottom: '15px',
    },
    itemsContainer: {
        marginBottom: '15px',
    },
    itemCard: {
        border: '1px solid #eee',
        borderRadius: '3px',
        padding: '10px',
        marginBottom: '8px',
        backgroundColor: '#f9f9f9',
    },
    total: {
        fontSize: '18px',
        fontWeight: 'bold' as const,
        textAlign: 'right' as const,
        marginTop: '10px',
    }
};

export default OrdersPage;

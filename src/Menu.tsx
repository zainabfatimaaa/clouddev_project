import * as React from 'react';
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from './NavBar'; // Import the Navbar component
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import 'bootstrap/dist/css/bootstrap.min.css';

// Define interfaces for type safety
interface FoodItem {
    name: string;
    price: number;
    description: string;
    qty: number;
}

const BrowsePage = () => {
    const location = useLocation();
    const username = location.state ? location.state.username : '';
    const name = location.state?.name;
    const type = location.state?.type;
    const navigate = useNavigate()
    const [error, setError] = useState('');
    
    const [show, setShow] = useState(false);
    const [menu, setMenu] = useState<any[]>([]);
    const [foodArr, setFoodArr] = useState<FoodItem[]>([])
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    
    // Added state variables for confirmation modal
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [orderTotal, setOrderTotal] = useState(0);
    const handleConfirmationClose = () => {
        setShowConfirmation(false);
        // Reset cart after successful order
        resetCart();
        // Navigate to the profile page or keep them on the menu
        // (optional navigation removed) - this allows them to stay on the menu page
    };

    // Function to reset the cart
    const resetCart = () => {
        const resetArray = foodArr.map(item => ({
            ...item,
            qty: 0
        }));
        setFoodArr(resetArray);
    };

    const FoodButton = (food_item: { food_item: FoodItem }) =>
    {
        const [counter, setCounter] = useState(food_item.food_item.qty);
        const increment = () => 
        {
            let tempArr = foodArr
            let newArr = []
            for (let x = 0; x < tempArr.length; x++)
            {
                if (tempArr[x].name === food_item.food_item.name)
                {
                    let obj = {
                        name: tempArr[x].name,
                        price: tempArr[x].price,    
                        description: tempArr[x].description,
                        qty: counter + 1
                    }
                    newArr.push(obj)
                }
                else
                {
                    newArr.push(tempArr[x])
                }
            }
            setCounter(counter + 1)
            setFoodArr(newArr)
        }
        const decrement = () => {
            if (counter > 0)
            {
                let tempArr = foodArr
                let newArr = []
                for (let x = 0; x < tempArr.length; x++)
                {
                    if (tempArr[x].name === food_item.food_item.name)
                    {
                        let obj = {
                            name: tempArr[x].name,
                            price: tempArr[x].price,    
                            description: tempArr[x].description,
                            qty: counter - 1
                        }
                        newArr.push(obj)
                    }
                    else
                    {
                        newArr.push(tempArr[x])
                    }
                }
                setCounter(counter - 1)
                setFoodArr(newArr)
            }
        }
        return (
            <>
                <button onClick={increment}>+</button>
                <button onClick={decrement}>-</button>
            
            </>
        )
    }
    

    useEffect(() => 
    {
        fetchMenu();
    }, 
    []);

    const exists = (arr: FoodItem[]) => 
    {
        for (let x = 0; x < arr.length; x++)
        {
            if (arr[x].qty != 0)
                return true
        }
        return false
    }

    const calculateTotal = () => {
        let total = 0;
        for (let x = 0; x < foodArr.length; x++) {
            if (foodArr[x].qty != 0) {
                total += (foodArr[x].qty * foodArr[x].price);
            }
        }
        return total.toFixed(2);
    };

    const handleOrder = async () => 
    {
        try 
        {
            let order = []
            for (let x = 0; x < foodArr.length; x++)
            {
                if (foodArr[x].qty != 0)
                {
                    order.push(foodArr[x])
                }
            }
            
            let total = 0
            for (let x = 0; x < foodArr.length; x++)
            {
                if (foodArr[x].qty != 0)
                {
                    total += (foodArr[x].qty * foodArr[x].price)
                }
            }
            let user = username
            
            let status = "Processing"
            const response = await fetch('http://localhost:8000/order', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ order , status, total, user }),
            });

            if (response.ok) 
            {
                console.log('Order Placed');
                // Close the cart modal
                handleClose();
                // Set the order total for display in confirmation
                setOrderTotal(total);
                // Show the confirmation modal
                setShowConfirmation(true);
            } 
            else 
            {
                const data = await response.json();
                setError(data.message);
            }
        } 

        catch (error) {
            // If an error occurs during the signup process, log the error
            console.error('Order not placed:', error);
        }
    };
    const fetchMenu = async () => 
    {
        try {
            const response = await fetch(`http://localhost:8000/menu`);
            if (response.ok) {
                const data = await response.json();
                setMenu(data.menu);
                setFoodArr(data.sendArr)
            } 
            else 
            {
                console.error('Failed to fetch menu:', response.statusText);
            }
        } catch (error) {
            console.error('Failed to fetch menu:', error);
        }
    };
    return (
        <div>
            <Navbar username={username} type={type} name={name}/>
            <div style={styles.container}>
                <h2>Menu</h2>
                <div>
                    {foodArr.map((item, index) => (
                        <div key={index} style={styles.auctionCard}>
                            <h3>{item.name}</h3>
                            <p>Description: {item.description}</p>
                            <p>Starting Price: {item.price}</p>
                            <p>Quantity: {item.qty}</p>
                            {type === "customer" && <FoodButton food_item={item}/>}
                        </div>
                    ))}
                </div>
            </div>
            <>
                <Button variant="primary" onClick={handleShow}>
                    Open Shopping Cart
                </Button>

                <Modal show={show} onHide={handleClose}>
                    <Modal.Header closeButton>
                    <Modal.Title>Your items</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {foodArr.map((item, index) => item.qty != 0 && (
                            <div key={index} style={styles.auctionCard}>
                                <h3>{item.name}</h3>
                                <p>Description: {item.description}</p>
                                <p>Starting Price: {item.price}</p>
                                <p>Quantity: {item.qty}</p>
                                {type === "customer" &&  <FoodButton food_item={item}/>}
                            </div>
                        ))}
                        {exists(foodArr) && (
                            <div style={styles.totalSection}>
                                <h4>Total: ${calculateTotal()}</h4>
                            </div>
                        )}
                    </Modal.Body>
                    <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    {exists(foodArr) && 
                        <Button variant="primary" onClick={handleOrder}>
                            Checkout
                        </Button>
                    }
                    </Modal.Footer>
                </Modal>
            </>
            
            {/* Order Confirmation Modal */}
            <Modal 
                show={showConfirmation} 
                onHide={handleConfirmationClose}
                centered
            >
                <Modal.Header closeButton style={styles.successHeader}>
                    <Modal.Title>Order Successful!</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div style={styles.successContent}>
                        <div style={styles.checkmarkContainer}>
                            <div style={styles.checkmark}>✓</div>
                        </div>
                        <h4>Thank you for your order!</h4>
                        <p>Your order has been placed successfully and is being processed.</p>
                        <p>Total: <strong>${orderTotal.toFixed(2)}</strong></p>
                        <p>You can check your order status in the "My Orders" section.</p>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="success" onClick={handleConfirmationClose}>
                        Continue Shopping
                    </Button>
                    <Button variant="outline-primary" onClick={() => {
                        handleConfirmationClose();
                        navigate('/my-orders', { state: { username, type, name } });
                    }}>
                        View My Orders
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

const styles = {
    container: {
        maxWidth: '800px',
        margin: '0 auto',
        padding: '20px',
    },
    searchInput: {
        width: '100%',
        marginBottom: '20px',
        padding: '10px',
        fontSize: '16px',
    },
    auctionCard: {
        border: '1px solid #ccc',
        borderRadius: '5px',
        padding: '10px',
        marginBottom: '10px',
    },
    link: {
        backgroundColor: '#007bff',
        color: '#fff',
        border: 'none',
        padding: '5px 10px',
        borderRadius: '5px',
        display: 'inline-block',
        marginTop: '10px',
        cursor: 'pointer',
    },
    totalSection: {
        marginTop: '20px',
        padding: '10px',
        borderTop: '1px solid #eee',
        textAlign: 'right' as const,
    },
    successHeader: {
        backgroundColor: '#28a745',
        color: 'white',
    },
    successContent: {
        textAlign: 'center' as const,
        padding: '20px',
    },
    checkmarkContainer: {
        display: 'flex',
        justifyContent: 'center',
        marginBottom: '20px',
    },
    checkmark: {
        fontSize: '48px',
        color: '#28a745',
        backgroundColor: '#e8f5e9',
        width: '80px',
        height: '80px',
        borderRadius: '50%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    }
};

export default BrowsePage;

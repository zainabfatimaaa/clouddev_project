import React from 'react';
import Navbar from './NavBar';
import { useLocation } from 'react-router-dom';

const HomePage = () => {
  const location = useLocation();
  const username = location.state ? location.state.username : '';
  const type = location.state ? location.state.type : '';
  const name = location.state ? location.state.name : '';

  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      padding: '20px',
      backgroundColor: '#f0f0f0',
    },
    heading: {
      fontSize: '32px',
      marginBottom: '20px',
      color: '#333',
    },
    description: {
      fontSize: '18px',
      marginBottom: '40px',
      textAlign: 'center',
      color: '#666',
    },
    button: {
      padding: '10px 20px',
      fontSize: '16px',
      backgroundColor: '#007bff',
      color: '#fff',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
      transition: 'background-color 0.3s ease',
    },
  };

  return (
    <div>
      <Navbar username = {username} type={type} name={name} />
      <div>
        <h1 style={styles.heading}>Order Placed {name}</h1>
        <p>{type}</p>
      </div>
    </div>
  );
};

export default HomePage;

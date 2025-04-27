import React from 'react';
import { Link } from 'react-router-dom';

const AuctionPage = () => {
  return (
    <div>
      <h2 style={styles.heading}>Welcome to Auction App</h2>
      <p style={styles.paragraph}>Please login to continue:</p>
      <ul>
        <li>
          <Link to="/login" style={styles.link}>Login</Link>
        </li>
        <li>
          <Link to="/signup" style={styles.link}>signup</Link>
        </li>
      </ul>
    </div>
    // <div style={styles.container}>
    //   <h2 style={styles.heading}>Welcome to Auction App</h2>
    //   <p style={styles.paragraph}>Please login to continue:</p>
    //   <ul>
    //     <li>
    //       <Link to="/login" style={styles.link}>Login</Link>
    //     </li>
    //     <li>
    //       <Link to="/signup" style={styles.link}>signup</Link>
    //     </li>
    //   </ul>
    // </div>
  );
};

const styles = {
  container: {
    textAlign: 'center',
    marginTop: '100px',
  },
  heading: {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '20px',
  },
  paragraph: {
    fontSize: '16px',
    marginBottom: '20px',
  },
  link: {
    fontSize: '18px',
    textDecoration: 'none',
    color: 'blue',
  }
};

export default AuctionPage;

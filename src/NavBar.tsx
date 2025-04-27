import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

interface NavbarProps {
    username: string;
    type: string;
    name: string;
}

const Navbar: React.FC<NavbarProps> = ({ username, type, name }) => {
  const location = useLocation();
  const passingUsername = location.state?.username;
  const navigate = useNavigate();

  const styles = {
    navbar: {
      backgroundColor: '#333',
      padding: '10px',
    },
    navList: {
      listStyle: 'none',
      margin: 0,
      padding: 0,
      display: 'flex',
      alignItems: 'center',
    },
    navLink: {
      color: '#fff',
      textDecoration: 'none',
      padding: '10px',
      cursor: 'pointer', // Add cursor pointer style
    },
  };

  const goToHome = () => {
    navigate('/home', { state: { username: username, type: type, name:name } });
  };
  const goToProfile = () => {
    navigate('/profile', { state: { username: username, type: type, name:name } });
  };
  const goToMenu = () => {
    navigate('/menu', { state: { username: username, type: type, name:name } });
  };
  const goToMyOrder = () => {
    navigate('/my-orders', { state: { username: username, type: type, name:name } });
  };
  const goToOrders = () => {
    navigate('/orders', { state: { username: username, type: type, name:name } });
  };


  
  const goToSignUp = () => {
    navigate('/signup', { state: { username: username, type: type } });
  };
  const goToSignIn = () => {
    navigate('/login', { state: { username: username, type: type } });
  };

  return (
    <nav style={styles.navbar}>
      <ul style={styles.navList}>
        <li>
          <div style={styles.navLink} onClick={goToHome}>
            Home
          </div>
        </li>
        <li>
          <div style={styles.navLink} onClick={goToMenu}>
            Menu
          </div>
        </li>
        {username && (
          <>
          <li>
            <div style={styles.navLink} onClick={goToSignIn}>
              Log out
            </div>
          </li>
        <li>
          <div style={styles.navLink} onClick={goToProfile}>
            Go to Profile
          </div>
        </li>
          </>
        )}
        {!username && (
          <>
            <li>
              <div style={styles.navLink} onClick={goToSignIn}>
                Sign-in
              </div>
            </li>
          </>
        )}
        {type === "customer" && (
          <>
            <li>
              <div style={styles.navLink} onClick={goToMyOrder}>
                My Orders
              </div>
            </li>
            <li>
              <div style={styles.navLink} onClick={goToSignUp}>
                Sign up
              </div>
            </li>
          </>
        )}
        {type === "employee" && (
          <>
            <li>
              <div style={styles.navLink} onClick={goToOrders}>
                Orders
              </div>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;

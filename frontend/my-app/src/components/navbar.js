import React from 'react';
import { Container, Nav, Navbar as BootstrapNavbar, Button, NavDropdown } from 'react-bootstrap';
import { NavLink, useNavigate } from 'react-router-dom'; 
import { useAuth } from '../context/AuthContext'; 
import '../styles/navbar.css';
import { FaUser } from "react-icons/fa";

function Navbar() {
  // ดึงสถานะและข้อมูล user จาก Context
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  // สร้างฟังก์ชัน Handle Logout
  const handleLogout = () => {
    logout();
    navigate('/login'); // ส่งไปหน้า Login หลัง Logout
  };

  return (
    <BootstrapNavbar bg="dark" expand="lg" className="navbar-custom" sticky="top">
      <Container>
        {/* เปลี่ยน Brand ให้เป็น NavLink ไปหน้า Home */}
        <BootstrapNavbar.Brand as={NavLink} to="/" className="navbar-brand-custom">
          IT Support Tickets
        </BootstrapNavbar.Brand>
        <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav" />
        <BootstrapNavbar.Collapse id="basic-navbar-nav">
          
          {/* Navigation Links */}
          <Nav className="ms-auto nav-links">
            <Nav.Link as={NavLink} to="/" className="nav-link-item" end>
              Home
            </Nav.Link>
            
            {/* ซ่อน Link ถ้ายังไม่ Login */}
            {isAuthenticated && (
              <>
                <Nav.Link as={NavLink} to="/report" className="nav-link-item">
                  Report
                </Nav.Link>
                <Nav.Link as={NavLink} to="/mytickets" className="nav-link-item">
                  My Tickets
                </Nav.Link>
              </>
            )}

            <Nav.Link as={NavLink} to="/about" className="nav-link-item">
              About Us
            </Nav.Link>
          </Nav>
          
          {/* Navbar Buttons */}
          <div className="navbar-buttons ms-3">
            
            {isAuthenticated ? (
              // --- (ถ้า Login แล้ว) แสดง Dropdown ชื่อ User ---
              <NavDropdown 
                title={
                  // 'navbar-user-name' ถูกกำหนดไว้ใน CSS ที่แก้ไข
                  <span className="navbar-user-name"> 
                    {/* ใส่ Icon รูปคน) */}
                    <FaUser />
                    {user?.name || 'User'}
                  </span>
                } 
                id="user-nav-dropdown" 
                // 'navbar-user-dropdown'
                className="navbar-user-dropdown" 
                align="end"
              >
                {/* <NavDropdown.Item as={NavLink} to="/profile">Profile</NavDropdown.Item> */}
                {/* <NavDropdown.Divider /> */}
                {/* 'logout-btn' */}
                <NavDropdown.Item onClick={handleLogout} className="navbar-btn logout-btn">
                  Logout
                </NavDropdown.Item>
              </NavDropdown>

            ) : (
              // --- (ถ้ายังไม่ Login) แสดงปุ่มเดิม ---
              <>
                <Button as={NavLink} to="/register" variant="outline-light" className="navbar-btn register-btn">
                  Register
                </Button>
                <Button as={NavLink} to="/login" variant="light" className="navbar-btn login-btn">
                  Login
                </Button>
              </>
            )}

          </div>
        </BootstrapNavbar.Collapse>
      </Container>
    </BootstrapNavbar>
  );
}

export default Navbar;
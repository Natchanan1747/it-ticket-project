import React from 'react';
import { Container, Nav, Navbar as BootstrapNavbar, Button } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import '../styles/navbar.css';

function Navbar() {
  return (
    <BootstrapNavbar bg="dark" expand="lg" className="navbar-custom" sticky="top">
      <Container>
        <BootstrapNavbar.Brand href="#" className="navbar-brand-custom">
          IT Support Tickets
        </BootstrapNavbar.Brand>
        <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav" />
        <BootstrapNavbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto nav-links">
            <Nav.Link as={NavLink} to="/" className="nav-link-item" end>
              Home
            </Nav.Link>
            <Nav.Link as={NavLink} to="/report" className="nav-link-item">
              Report
            </Nav.Link>
            <Nav.Link as={NavLink} to="/mytickets" className="nav-link-item">
              My Tickets
            </Nav.Link>
            <Nav.Link as={NavLink} to="/about" className="nav-link-item">
              About Us
            </Nav.Link>
          </Nav>
          <div className="navbar-buttons ms-3">
            <Button as={NavLink} to="/register" variant="outline-light" className="navbar-btn register-btn">
              Register
            </Button>
            <Button as={NavLink} to="/login" variant="light" className="navbar-btn login-btn">
              Login
            </Button>
          </div>
        </BootstrapNavbar.Collapse>
      </Container>
    </BootstrapNavbar>
  );
}

export default Navbar;

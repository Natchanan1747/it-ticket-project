import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { Container, Form, Button, Row, Col, Alert } from "react-bootstrap";
import "../styles/register.css";

const API_URL = 'http://localhost:3000/api';

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const navigate = useNavigate();

  const validateField = (name, value) => {
    switch (name) {
      case "name":
        if (!value.trim()) return "Name is required";
        return "";
      case "email":
        if (!value.trim()) return "Email is required";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
          return "Invalid email format";
        return "";
      case "phone":
        if (!value.trim()) return "Phone is required";
        if (!/^\+?[0-9\s-]{7,20}$/.test(value)) return "Invalid phone number";
        return "";
      case "password":
        if (!value) return "Password is required";
        if (value.length < 6) return "Password must be at least 6 characters";
        return "";
      default:
        return "";
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSubmitted(true);
    // validate all fields
    const newErrors = {
      name: validateField("name", formData.name),
      email: validateField("email", formData.email),
      phone: validateField("phone", formData.phone),
      password: validateField("password", formData.password),
    };
    setErrors(newErrors);
    const hasError = Object.values(newErrors).some(Boolean);
    if (hasError) return;
    setLoading(true);

    try {
      const endpoint = `${API_URL}/auth/register`;

	  const payload = {
            ...formData,
            role: 'USER'
        };

		const response = await fetch(endpoint, {
			method: "POST",
			headers: {
			"Content-Type": "application/json",
			},
			body: JSON.stringify(payload),
		});

		const data = await response.json();

		if (!response.ok) {
			throw new Error(data.message || "สมัครสมาชิกไม่สำเร็จ");
		}

		// Success case
		setSuccess("Register success! Redirecting...");
		setFormData({ name: "", email: "", password: "", phone: "" });
		setTouched({});
		setSubmitted(false);

		// redirect to login page
		setTimeout(() => {
		  navigate('/login');
		}, 2000);

    } catch (err) {
      setError(err.message || "An error occurred. Please try again.");
      console.error("Registration error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col xs={12} sm={10} md={8} lg={6} xl={5}>
            <div className="register-card">
              <div className="register-header">
                <h2>Create Account</h2>
                <p>Join our IT Support Ticket System</p>
              </div>

              {error && (
                <Alert
                  variant="danger"
                  className="register-alert"
                  dismissible
                  onClose={() => setError("")}
                >
                  {error}
                </Alert>
              )}
              {success && (
                <Alert
                  variant="success"
                  className="register-alert"
                  dismissible
                  onClose={() => setSuccess("")}
                >
                  {success}
                </Alert>
              )}

              <Form
                onSubmit={handleSubmit}
                className="register-form"
                noValidate
              >
                <Form.Group className="form-group" controlId="regName">
                  <Form.Label className="form-label">Full Name *</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    placeholder="Moo Deng"
                    value={formData.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={!!errors.name && (touched.name || submitted)}
                  />
                  {(touched.name || submitted) && errors.name && (
                    <div className="invalid-feedback">{errors.name}</div>
                  )}
                </Form.Group>

                <Form.Group className="form-group" controlId="regEmail">
                  <Form.Label className="form-label">
                    Email Address *
                  </Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    placeholder="moodeng@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={!!errors.email && (touched.email || submitted)}
                  />
                  {(touched.email || submitted) && errors.email && (
                    <div className="invalid-feedback">{errors.email}</div>
                  )}
                </Form.Group>

                <Form.Group className="form-group" controlId="regPhone">
                  <Form.Label className="form-label">Phone Number *</Form.Label>
                  <Form.Control
                    type="tel"
                    name="phone"
                    placeholder="+1 (555) 123-4567"
                    value={formData.phone}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={!!errors.phone && (touched.phone || submitted)}
                  />
                  {(touched.phone || submitted) && errors.phone && (
                    <div className="invalid-feedback">{errors.phone}</div>
                  )}
                </Form.Group>

                <Form.Group className="form-group" controlId="regPassword">
                  <Form.Label className="form-label">Password *</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    placeholder="At least 6 characters"
                    value={formData.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={
                      !!errors.password && (touched.password || submitted)
                    }
                  />
                  {(touched.password || submitted) && errors.password && (
                    <div className="invalid-feedback">{errors.password}</div>
                  )}
                </Form.Group>

                <Button
                  type="submit"
                  disabled={loading}
                  className="register-btn"
                >
                  {loading ? (
                    <>
                      <span className="loading-spinner" /> Creating account...
                    </>
                  ) : (
                    "Create Account"
                  )}
                </Button>
              </Form>

              <div className="register-link">
                <p>
                  Already have an account? <a href="/login">Login</a>
                </p>
              </div>

              {/* Helper comment for future API integration */}
            </div>
            {/*
						Backend API Expected:
						POST /api/auth/register
						Body: { name, email, password, phone }
						Response: { success: true, message: "User registered", user: {...} }
						Or Error: { success: false, message: "Error message" }
					*/}
          </Col>
        </Row>
      </Container>
    </div>
  );
}

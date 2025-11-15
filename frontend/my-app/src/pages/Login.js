import React, { useState } from "react";
import axios from "axios";

// Import hooks สำหรับ redirect และ auth
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Alert,
  Spinner,
} from "react-bootstrap";
import "../styles/login.css";

// ย้าย API_URL ออกมาและแก้ไข Port
const API_URL = "http://localhost:3000/api"; // (ต้องตรงกับ Backend ของคุณ)

export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // เพิ่ม hooks
  const navigate = useNavigate();
  const { login } = useAuth(); // ดึงฟังก์ชัน login มาจาก Context

  const validateField = (name, value) => {
    if (name === "email") {
      if (!value.trim()) return "Email is required";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Invalid email";
    }
    if (name === "password") {
      if (!value) return "Password is required";
      if (value.length < 6) return "Password must be at least 6 characters";
    }
    return "";
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
  // --- จบส่วน Validation ---

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // validate
    const newErrors = {
      email: validateField("email", formData.email),
      password: validateField("password", formData.password),
    };
    setErrors(newErrors);
    if (Object.values(newErrors).some(Boolean)) return;

    setLoading(true);

    try {
      // --- เปลี่ยนมาใช้ axios ---
      const response = await axios.post(`${API_URL}/auth/login`, formData, {
        // Backend HTTP-Only Cookie ให้เปิดคอมเมนต์บรรทัดล่าง
        // withCredentials: true
      });

      // Backend ควรส่งกลับมาเป็น { token: "...", user: {...} }
      const { token, user } = response.data.data;

      if (!token || !user) {
        throw new Error("Invalid response from server");
      }

      // --- จัดการหลัง Login สำเร็จ ---

      // 1. "บันทึก" token และ user ลงใน Context
      login(token, user);

      setSuccess("Login successful! Redirecting...");

      // (เช็ค Role ที่ได้มาจาก 'user' object)
      const userRole = user.role.toUpperCase();

      setTimeout(() => {
        if (userRole === "ADMIN" || userRole === "STAFF") {
          navigate("/dashboard"); // (ส่ง Admin/Staff ไปหน้า Dashboard)
        } else {
          navigate("/mytickets"); // (ส่ง User ไปหน้า My Tickets)
        }
      }, 1000);
      
    } catch (err) {
      // จัดการ Error ของ axios
      const errorMessage =
        err.response?.data?.message || err.message || "An error occurred";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col xs={12} sm={10} md={8} lg={6} xl={5}>
            <div className="login-card">
              <div className="login-header">
                <h2>Login</h2>
                <p>Access your account</p>
              </div>

              {error && (
                <Alert
                  variant="danger"
                  className="login-alert"
                  dismissible
                  onClose={() => setError("")}
                >
                  {error}
                </Alert>
              )}
              {success && (
                <Alert variant="success" className="login-alert">
                  {success}
                </Alert>
              )}

              <Form onSubmit={handleSubmit} className="login-form" noValidate>
                <Form.Group className="form-group" controlId="loginEmail">
                  <Form.Label className="form-label">Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    placeholder="moodeng@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={!!errors.email && touched.email}
                    disabled={loading} // CHANGED: ปิดการแก้ไขตอนโหลด
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.email}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="form-group" controlId="loginPassword">
                  <Form.Label className="form-label">Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    placeholder="password"
                    value={formData.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={!!errors.password && touched.password}
                    disabled={loading} // CHANGED: ปิดการแก้ไขตอนโหลด
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.password}
                  </Form.Control.Feedback>
                </Form.Group>

                <Button type="submit" disabled={loading} className="login-btn">
                  {loading ? (
                    <>
                      <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                      />{" "}
                      Signing in...
                    </>
                  ) : (
                    "Sign in"
                  )}
                </Button>
              </Form>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

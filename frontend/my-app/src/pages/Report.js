import React, { useState } from "react";
import {
  Container,
  Form,
  Button,
  Row,
  Col,
  Alert,
  Spinner,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // 1. Import axios
import "../styles/report.css";

// 2. กำหนด URL ของ Backend
const API_URL = "http://localhost:3000/api";

function Report() {
  // 3. เปลี่ยน State ให้ตรงกับ Schema (description, urgency)
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [urgency, setUrgency] = useState("LOW");
  const [file, setFile] = useState(null);

  // เพิ่ม State สำหรับ 'type'
  const [type, setType] = useState("Incident"); // (ค่าเริ่มต้น)

  // State สำหรับการเชื่อมต่อ API
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  // handleSubmit เพื่อส่งข้อมูลไปที่ Backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // (ตรวจสอบว่า Login หรือยัง - axios header ถูกตั้งค่าโดย AuthContext แล้ว)

    setLoading(true);

    // สร้าง FormData เพราะมีไฟล์แนบ
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("urgency", urgency);
    formData.append("type", type);

    // 'attachments' ต้องตรงกับชื่อ field ใน middleware (upload.single('attachments'))
    if (file) {
      formData.append("attachments", file);
    }

    try {
      // ส่ง FormData ไปที่ Backend
      const response = await axios.post(`${API_URL}/tickets`, formData, {
        headers: {
          // (Auth Header ถูกใส่โดย AuthContext อัตโนมัติ)
          "Content-Type": "multipart/form-data", // บอกว่านี่คือ FormData
        },
      });

      setSuccess("Report submitted successfully! Redirecting...");
      resetForm();

      // ส่งไปหน้า My Tickets หลังสร้างเสร็จ
      setTimeout(() => {
        navigate("/mytickets");
      }, 2000);
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || err.message || "An error occurred";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setUrgency("low");
    setType("Incident");
    setFile(null);
    // รีเซ็ต <input type="file">
    const fileInput = document.querySelector(".file-input");
    if (fileInput) fileInput.value = "";
  };

  const handleCancel = () => {
    resetForm();
  };

  return (
    <div className="report-page">
      <Container className="report-container">
        <div className="report-card">
          <h2 className="report-card__title">Report Problem Form</h2>
          <hr />

          {/* Alert สำหรับ Success/Error */}
          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}

          <Form onSubmit={handleSubmit} className="report-form">
            <Form.Group controlId="reportTitle" className="mb-3">
              <Form.Label>หัวข้อ</Form.Label>
              <Form.Control
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </Form.Group>

            {/*  Dropdown ประเภทของปัญหา */}
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group controlId="reportType">
                  <Form.Label>ประเภทของปัญหา</Form.Label>
                  <Form.Select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                  >
                    {/* (ค่าเหล่านี้ต้องตรงกับ ENUM ใน Database) */}
                    <option value="Incident">Incident (ปัญหา)</option>
                    <option value="Service_Request">
                      Service Request (ขอใช้บริการ)
                    </option>
                    <option value="Question">Question (สอบถาม)</option>
                    <option value="Bug_Report">Bug Report (แจ้งบั๊ก)</option>
                  </Form.Select>
                </Form.Group>
              </Col>

              {/* dropdown ความรุนแรงปัญหา */}
              <Col md={6}>
                <Form.Group controlId="reportUrgency">
                  <Form.Label>ความรุนแรงปัญหา</Form.Label>
                  <Form.Select
                    value={urgency}
                    onChange={(e) => setUrgency(e.target.value)}
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group controlId="reportDescription" className="mb-3">
              <Form.Label>รายละเอียด</Form.Label>
              <Form.Control
                as="textarea"
                rows={6}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </Form.Group>

            <Row className="mb-4">
              <Col>
                <Form.Label>แนบไฟล์</Form.Label>
                <div className="file-input-wrapper">
                  <Form.Control
                    type="file"
                    onChange={(e) =>
                      setFile(e.target.files && e.target.files[0])
                    }
                    className="file-input"
                  />
                </div>
              </Col>
            </Row>

            <div className="d-flex justify-content-center gap-3 report-actions">
              <Button
                variant="danger"
                className="btn-cancel"
                onClick={handleCancel}
                disabled={loading}
              >
                ยกเลิก
              </Button>
              <Button
                variant="success"
                type="submit"
                className="btn-confirm"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                    />{" "}
                    Submitting...
                  </>
                ) : (
                  "ยืนยัน"
                )}
              </Button>
            </div>
          </Form>
        </div>
      </Container>
    </div>
  );
}

export default Report;

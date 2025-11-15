import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Alert,
  Spinner,
  ListGroup,
  Image,
} from "react-bootstrap";
import { useAuth } from "../context/AuthContext"; // (ดึงข้อมูล User ที่ Login อยู่)
import "../styles/ticket-details.css"; // (CSS ใหม่)

// (ต้องตรงกับ Backend ของคุณ)
const API_URL = "http://localhost:3000/api";

// (Helper Function สำหรับ Urgency - เหมือนใน MyTickets)
const getUrgencyProps = (urgency) => {
  switch (urgency) {
    case "LOW":
      return { text: "Low", className: "urgency-low" };
    case "MEDIUM":
      return { text: "Medium", className: "urgency-medium" };
    case "HIGH":
      return { text: "High", className: "urgency-high" };
    default:
      return { text: urgency, className: "urgency-default" };
  }
};

// (Helper Function สำหรับชื่อไฟล์ - เหมือนใน MyTickets)
const getFileName = (filePath) => {
  if (!filePath) return "";
  return filePath.split(/[\\/]/).pop();
};

function TicketDetails() {
  const { id } = useParams(); // ดึง :id จาก URL
  const navigate = useNavigate();
  const { user } = useAuth(); // ดึงข้อมูล User ที่ Login

  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // State สำหรับการส่ง Comment ใหม่
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 1. (Feature) ดึงข้อมูล Ticket เมื่อหน้าโหลด
  useEffect(() => {
    const fetchTicketDetails = async () => {
      try {
        setLoading(true);
        // (Auth Header ถูกส่งไปแล้วโดย AuthContext)
        // (Backend API: getTicketById)
        const response = await axios.get(`${API_URL}/tickets/${id}`);

        // (แกะห่อ .data จาก successResponse)
        setTicket(response.data.data);
        setError("");
      } catch (err) {
        const errorMessage =
          err.response?.data?.message ||
          err.message ||
          "Failed to load ticket details.";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchTicketDetails();
  }, [id]); // (ดึงใหม่ถ้า ID ใน URL เปลี่ยน)

  // 2. (Feature) ส่ง Comment ใหม่
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return; // (ไม่ส่งถ้า Comment ว่าง)

    setIsSubmitting(true);
    setError("");

    try {
      // (Backend API: createComment)
      const response = await axios.post(`${API_URL}/tickets/${id}/comments`, {
        body: newComment,
      });

      // (Backend ส่ง Comment ใหม่กลับมา)
      const newlyCreatedComment = response.data.data;

      // (เพิ่ม Comment ใหม่เข้าไปใน State โดยไม่ต้องโหลดหน้าใหม่)
      // (เราต้อง "แนบ" ข้อมูล User ของเราเข้าไปเอง เพราะ Backend ไม่ได้ส่ง 'author' กลับมา)
      setTicket((prevTicket) => ({
        ...prevTicket,
        comments: [
          ...prevTicket.comments,
          { ...newlyCreatedComment, author: user }, // (แนบ user ที่ login อยู่เข้าไป)
        ],
      }));

      setNewComment(""); // เคลียร์ช่อง Text
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || err.message || "Failed to post comment.";
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- Render ---

  if (loading) {
    return (
      <Container className="d-flex justify-content-center mt-5">
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  if (error && !ticket) {
    return (
      <Container className="mt-4">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  if (!ticket) {
    return (
      <Container className="mt-4">
        <Alert variant="warning">Ticket not found.</Alert>
      </Container>
    );
  }

  const urgencyProps = getUrgencyProps(ticket.urgency);

  return (
    <div className="ticket-details-page">
      <Container>
        <Row className="justify-content-center">
          <Col md={10} lg={8}>
            {/* (Card 1: Ticket Details) */}
            <Card className="mb-4 ticket-details-card">
              <Card.Body>
                <h2 className="ticket-title">{ticket.title}</h2>
                <p className="ticket-description">{ticket.description}</p>

                <Row>
                  <Col md={6}>
                    <div className="details-box">
                      <Form.Label>ไฟล์แนบ</Form.Label>
                      <div className="file-info">
                        <i className="fa fa-paperclip me-2"></i>
                        {ticket.attachments && ticket.attachments.length > 0
                          ? getFileName(ticket.attachments[0].filePath)
                          : "ไม่มีไฟล์แนบ"}
                      </div>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="details-box">
                      <Form.Label>ความรุนแรงปัญหา</Form.Label>
                      <div
                        className={`urgency-badge ${urgencyProps.className}`}
                      >
                        {urgencyProps.text}
                      </div>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            {/* (Card 2: Add Comment) */}
            <Card className="mb-4 comment-form-card">
              <Card.Body>
                <Form onSubmit={handleCommentSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label visuallyHidden>เพิ่มความคิดเห็น</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={4}
                      placeholder="เพิ่มความคิดเห็น..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      required
                    />
                  </Form.Group>
                  {/* (แสดง Error ถ้าส่ง Comment ไม่ผ่าน) */}
                  {error && (
                    <Alert variant="danger" size="sm">
                      {error}
                    </Alert>
                  )}
                  <div className="d-flex justify-content-end gap-2">
                    <Button
                      variant="secondary"
                      onClick={() => setNewComment("")}
                      disabled={isSubmitting}
                    >
                      ยกเลิก
                    </Button>
                    <Button
                      variant="primary"
                      type="submit"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Submitting..." : "เพิ่มความคิดเห็น"}
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>

            {/* (Card 3: Comment List) */}
            <Card className="comment-list-card">
              <Card.Header as="h5">ความคิดเห็นทั้งหมด</Card.Header>
              <ListGroup variant="flush">
                {ticket.comments && ticket.comments.length > 0 ? (
                  ticket.comments.map((comment) => (
                    <ListGroup.Item key={comment.id} className="comment-item">
                      <div className="d-flex">
                        {/* (Icon รูปคน) */}
                        <Image
                          src="https://placehold.co/50x50/1E3A8A/FFFFFF?text=User"
                          className="comment-author-icon"
                        />
                        <div className="ms-3">
                          <div className="d-flex align-items-center">
                            {/* (ถ้า Backend ส่ง author มา, เราจะแสดงชื่อ) */}
                            <span className="comment-author-name">
                              {comment.author ? comment.author.name : "User"}
                            </span>
                            <span className="comment-role ms-2">
                              {comment.author ? `(${comment.author.role})` : ""}
                            </span>
                          </div>
                          <p className="comment-body">{comment.body}</p>
                          <small className="comment-timestamp text-muted">
                            {new Date(comment.createdAt).toLocaleString()}
                          </small>
                        </div>
                      </div>
                    </ListGroup.Item>
                  ))
                ) : (
                  <ListGroup.Item>ยังไม่มีความคิดเห็น</ListGroup.Item>
                )}
              </ListGroup>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default TicketDetails;

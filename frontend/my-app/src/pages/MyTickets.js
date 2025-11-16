import React, { useState, useEffect } from "react";
import axios from "axios"; // Import axios
import { useNavigate } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Badge,
  Form,
  InputGroup,
  Spinner,
  Alert,
} from "react-bootstrap";
import "../styles/mytickets.css";
import { FaSearch } from "react-icons/fa";

// URL ของ Backend API
const API_URL = "http://localhost:3000/api";

// --- Helper Functions ---

const getStatusProps = (status) => {
  // (DB ส่ง "OPEN", "PENDING" ฯลฯ)
  switch (status) {
    case "PENDING":
      return { text: "Pending", variant: "info" };
    case "IN_PROGRESS":
      return { text: "In Progress", variant: "warning" };
    case "CLOSED":
      return { text: "Done", variant: "success" };
    case "OPEN":
      return { text: "Open", variant: "primary" };
    default:
      return { text: status, variant: "secondary" };
  }
};

const getUrgencyProps = (urgency) => {
  // (DB ส่ง "LOW", "MEDIUM", "HIGH")
  switch (urgency) {
    case "LOW":
      return { text: "Low", variant: "secondary" };
    case "MEDIUM":
      return { text: "Medium", variant: "warning" };
    case "HIGH":
      return { text: "High", variant: "danger" };
    default:
      return { text: urgency, variant: "secondary" };
  }
};

//  Helper สำหรับ "Type"
const getTypeProps = (type) => {
  // (DB ส่ง "Service_Request" ฯลฯ)
  switch (type) {
    case "Incident":
      return "Incident";
    case "Service_Request":
      return "Service Request";
    case "Question":
      return "Question";
    case "Bug_Report":
      return "Bug Report";
    default:
      return type;
  }
};

const getFileName = (filePath) => {
  if (!filePath) return "";
  return filePath.split(/[\\/]/).pop();
};

function MyTickets() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // States สำหรับการ Filter
  const [statusFilter, setStatusFilter] = useState("All Tickets");
  //  เพิ่ม State สำหรับ "Type"
  const [typeFilter, setTypeFilter] = useState("All Types");
  const [dateFilter, setDateFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // เปิดใช้งาน useEffect และเชื่อมต่อ Backend
  useEffect(() => {
    const fetchMyTickets = async () => {
      try {
        setLoading(true);
        // (AuthContext ได้ตั้งค่า Header "Authorization" ให้ axios แล้ว)
        const response = await axios.get(`${API_URL}/tickets/my-tickets`);

        // แกะห่อ .data (จาก successResponse)
        setTickets(response.data.data);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch my tickets:", err);
        setError("Failed to load tickets. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchMyTickets();
  }, []); // [] รันครั้งเดียวตอนเริ่ม

  //  Logic การกรองข้อมูล
  const filteredTickets = tickets.filter((ticket) => {
    const matchesStatus =
      statusFilter === "All Tickets" || ticket.status === statusFilter; // (DB ส่ง "OPEN", "PENDING")

    // เพิ่มการกรอง "Type"
    const matchesType =
      typeFilter === "All Types" || ticket.type === typeFilter; // (DB ส่ง "Incident" ฯลฯ)

    const matchesSearch = ticket.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    const matchesDate = true; // (ยังไม่ได้ implement)

    return matchesStatus && matchesSearch && matchesDate && matchesType;
  });

  // --- Render ---

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-2">Loading your tickets...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-4">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container fluid="md" className="mytickets-page-modern mt-4">
      {/* 1. Filter Bar (CHANGED: จัดเรียง Col ใหม่) */}
      <Row className="mb-4 p-3 bg-light rounded shadow-sm align-items-center">
        {/* Status Filter */}
        <Col md={3} className="mb-2 mb-md-0">
          <Form.Group controlId="statusFilter">
            <Form.Label className="fw-bold small">Status</Form.Label>
            <Form.Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All Tickets">All Tickets</option>
              {/* (Value ต้องตรงกับ ENUM) */}
              <option value="OPEN">Open</option>
              <option value="PENDING">Pending</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="CLOSED">Done</option>
            </Form.Select>
          </Form.Group>
        </Col>

        {/* 10. (NEW) Type Filter */}
        <Col md={3} className="mb-2 mb-md-0">
          <Form.Group controlId="typeFilter">
            <Form.Label className="fw-bold small">Type</Form.Label>
            <Form.Select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <option value="All Types">All Types</option>
              <option value="Incident">Incident</option>
              <option value="Service_Request">Service Request</option>
              <option value="Question">Question</option>
              <option value="Bug_Report">Bug Report</option>
            </Form.Select>
          </Form.Group>
        </Col>

        {/* Date Filter */}
        <Col md={3} className="mb-2 mb-md-0">
          <Form.Group controlId="dateFilter">
            <Form.Label className="fw-bold small">Date</Form.Label>
            <Form.Control
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            />
          </Form.Group>
        </Col>

        {/* Search Filter */}
        <Col md={3}>
          <Form.Label className="fw-bold small">Search Title</Form.Label>
          <InputGroup>
            <Form.Control
              type="text"
              placeholder="Search Title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button variant="outline-secondary">
              <i className="fa fa-search">
                <FaSearch />
              </i>
            </Button>
          </InputGroup>
        </Col>
      </Row>

      {/* 2. Tickets Grid */}
      <Row>
        {filteredTickets.map((ticket) => {
          const statusProps = getStatusProps(ticket.status);
          const urgencyProps = getUrgencyProps(ticket.urgency);

          return (
            // 6. (CHANGED) แก้ไข Key (Prisma trả về "id")
            <Col key={ticket.id} sm={12} md={6} className="mb-4">
              <Card className="ticket-card shadow-sm h-100">
                <Card.Header className="d-flex justify-content-between align-items-center">
                  <div>
                    <strong>Status: </strong>
                    <Badge bg={statusProps.variant}>{statusProps.text}</Badge>
                  </div>
                  <div>
                    <strong>Urgency: </strong>
                    <Badge bg={urgencyProps.variant}>{urgencyProps.text}</Badge>
                  </div>
                </Card.Header>

                <Card.Body>
                  <Card.Title>{ticket.title}</Card.Title>

                  {/* 11. (NEW) แสดง "Type" ใน Card */}
                  <Badge pill bg="light" text="dark" className="mb-2">
                    {getTypeProps(ticket.type)}
                  </Badge>

                  <Card.Text className="text-muted">
                    {ticket.description?.substring(0, 100)}...
                  </Card.Text>

                  {/* (Prisma trả về 'attachments' array) */}
                  {ticket.attachments && ticket.attachments.length > 0 && (
                    <div className="text-muted small mt-3">
                      <i className="fa fa-paperclip me-2"></i>
                      {/* (Prisma trả về 'filePath') */}
                      {getFileName(ticket.attachments[0].filePath)}
                    </div>
                  )}
                </Card.Body>

                <Card.Footer className="d-flex justify-content-between align-items-center">
                  <Button
                    variant="primary"
                    size="sm"
                    // 6. (CHANGED) แก้ไข Link (Prisma trả về "id")
                    onClick={() => navigate(`/ticket/${ticket.id}`)}
                  >
                    View Details
                  </Button>
                  <small className="text-muted">
                    {/* 6. (CHANGED) (Prisma trả về "createdAt") */}
                    Created: {new Date(ticket.createdAt).toLocaleDateString()}
                  </small>
                </Card.Footer>
              </Card>
            </Col>
          );
        })}
      </Row>

      {/* (กรณีไม่พบข้อมูล) */}
      {loading === false && filteredTickets.length === 0 && (
        <Alert variant="secondary" className="text-center">
          {tickets.length === 0
            ? "You have not submitted any tickets."
            : "No tickets found matching your criteria."}
        </Alert>
      )}
    </Container>
  );
}

export default MyTickets;

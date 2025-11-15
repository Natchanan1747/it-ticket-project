// src/pages/MyTickets.js
import React, { useState, useEffect } from 'react';
// import axios from 'axios';
import { useNavigate } from 'react-router-dom';
// CHANGED: Import components จาก react-bootstrap
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
  Alert
} from 'react-bootstrap';
// CHANGED: Import CSS ใหม่ (โค้ดอยู่ด้านล่าง)
import '../styles/mytickets.css'; 

// URL ของ Backend API
const API_URL = 'http://localhost:8000/api';

// --- CHANGED: Helper Functions อัปเดตให้ใช้ Bootstrap Variants ---

// Helper Function สำหรับ map สถานะและ Bootstrap Variant
const getStatusProps = (status) => {
  switch (status.toLowerCase()) {
    case 'pending':
      return { text: 'Pending', variant: 'info' };
    case 'in_progress':
      return { text: 'In Progress', variant: 'warning' };
    case 'closed':
      return { text: 'Done', variant: 'success' };
    case 'open':
      return { text: 'Open', variant: 'primary' };
    default:
      return { text: status, variant: 'secondary' };
  }
};

// Helper Function สำหรับ map ความรุนแรงและ Bootstrap Variant
const getUrgencyProps = (urgency) => {
  switch (urgency.toLowerCase()) {
    case 'low':
      return { text: 'Low', variant: 'secondary' };
    case 'medium':
      return { text: 'Warning', variant: 'warning' };
    case 'high':
      return { text: 'High', variant: 'danger' };
    default:
      return { text: urgency, variant: 'secondary' };
  }
};

// Helper Function ตัดชื่อไฟล์ (ไม่เปลี่ยนแปลง)
const getFileName = (filePath) => {
  if (!filePath) return '';
  return filePath.split(/[\\/]/).pop();
};


function MyTickets() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // States สำหรับการ Filter (ไม่เปลี่ยนแปลง)
  const [statusFilter, setStatusFilter] = useState('All Tickets');
  const [dateFilter, setDateFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

//   useEffect(() => {
//     const fetchMyTickets = async () => {
//       try {
//         setLoading(true);
//         const response = await axios.get(`${API_URL}/tickets/my-tickets`, {
//           withCredentials: true,
//         });
//         setTickets(response.data);
//         setError(null);
//       } catch (err) {
//         console.error('Failed to fetch my tickets:', err);
//         setError('Failed to load tickets. Please try again later.');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchMyTickets();
//   }, []);

  // Logic การกรองข้อมูล (ไม่เปลี่ยนแปลง)
  const filteredTickets = tickets.filter((ticket) => {
    const matchesStatus =
      statusFilter === 'All Tickets' ||
      ticket.status.toLowerCase() === statusFilter.toLowerCase();
    
    const matchesSearch =
      ticket.title.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesDate = true; 

    return matchesStatus && matchesSearch && matchesDate;
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
    // CHANGED: ใช้ <Container>
    <Container fluid="md" className="mytickets-page-modern mt-4">
      
      {/* 1. Filter Bar (CHANGED: ใช้ Row, Col, Form) */}
      <Row className="mb-4 p-3 bg-light rounded shadow-sm align-items-center">
        <Col md={4} className="mb-2 mb-md-0">
          <Form.Group controlId="statusFilter">
            <Form.Label className="fw-bold small">Status</Form.Label>
            <Form.Select 
              value={statusFilter} 
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All Tickets">All Tickets</option>
              <option value="open">Open</option>
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="closed">Done</option>
            </Form.Select>
          </Form.Group>
        </Col>

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

        <Col md={5}>
          <Form.Label className="fw-bold small">Search Title</Form.Label>
          <InputGroup>
            <Form.Control
              type="text"
              placeholder="Search Title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button variant="outline-secondary">
              <i className="fa fa-search"></i>
            </Button>
          </InputGroup>
        </Col>
      </Row>

      {/* 2. Tickets Grid (CHANGED: ใช้ Row, Col, Card) */}
      <Row>
        {filteredTickets.map((ticket) => {
          const statusProps = getStatusProps(ticket.status);
          const urgencyProps = getUrgencyProps(ticket.urgency);

          return (
            // Responsive Column: 12 (มือถือ), 6 (จอปกติ) = 2 card ต่อแถว
            <Col key={ticket.ticket_id} sm={12} md={6} className="mb-4">
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
                  <Card.Text className="text-muted">
                    {ticket.description?.substring(0, 100)}...
                  </Card.Text>
                  
                  {ticket.attachments && ticket.attachments.length > 0 && (
                    <div className="text-muted small mt-3">
                      <i className="fa fa-paperclip me-2"></i>
                      {getFileName(ticket.attachments[0].file_path)}
                    </div>
                  )}
                </Card.Body>
                
                <Card.Footer className="d-flex justify-content-between align-items-center">
                  <Button 
                    variant="primary" 
                    size="sm"
                    onClick={() => navigate(`/my-tickets/${ticket.ticket_id}`)}
                  >
                    View Details
                  </Button>
                  <small className="text-muted">
                    Created: {new Date(ticket.created_at).toLocaleDateString()}
                  </small>
                </Card.Footer>
              </Card>
            </Col>
          );
        })}
      </Row>

      {filteredTickets.length === 0 && (
        <Alert variant="secondary" className="text-center">
          No tickets found matching your criteria.
        </Alert>
      )}

    </Container>
  );
}

export default MyTickets;
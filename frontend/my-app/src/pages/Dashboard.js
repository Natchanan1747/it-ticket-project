import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Badge, Spinner, Alert, Form, InputGroup, Button } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import '../styles/dashboard.css';
import { FaSearch } from "react-icons/fa";

const API_URL = 'http://localhost:3000/api';

// (Helpers - เหมือนใน MyTickets แต่เราจะใช้ createdAt และ submittedBy)
const getStatusProps = (status) => {
  switch (status) {
    case 'PENDING': return { text: 'Pending', variant: 'info' };
    case 'IN_PROGRESS': return { text: 'In Progress', variant: 'warning' };
    case 'CLOSED': return { text: 'Done', variant: 'success' };
    case 'OPEN': return { text: 'Open', variant: 'primary' };
    default: return { text: status, variant: 'secondary' };
  }
};

const getUrgencyProps = (urgency) => {
  switch (urgency) {
    case 'LOW': return { text: 'Low', variant: 'secondary' };
    case 'MEDIUM': return { text: 'Medium', variant: 'warning' };
    case 'HIGH': return { text: 'High', variant: 'danger' };
    default: return { text: urgency, variant: 'secondary' };
  }
};

const getStatusClass = (status) => {
  switch (status) {
    case 'PENDING': return 'status-pending';
    case 'IN_PROGRESS': return 'status-in-progress';
    case 'CLOSED': return 'status-closed';
    case 'OPEN': return 'status-open';
    default: return 'status-default';
  }
};

function AdminDashboard() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { user } = useAuth(); // (ดึงข้อมูล Role)

  // (States สำหรับ Filter - เหมือน MyTickets)
  const [statusFilter, setStatusFilter] = useState('All Tickets');
  const [typeFilter, setTypeFilter] = useState('All Types');
  const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
    // (1) "ยาม" ด่านแรก: ถ้า user เป็น null (เช่น หลัง Logout) ให้ออกทันที
    if (!user) return; 

    // (2) "ยาม" ด่านที่สอง: (จะทำงาน "หลัง" ด่านแรก)
    // ถ้า user ไม่ใช่ Admin/Staff ให้ย้ายไปหน้า My Tickets
    if (user.role !== 'ADMIN' && user.role !== 'STAFF') {
      navigate('/my-tickets'); 
      return;
    }

    // (3) (จะทำงาน "หลัง" ด่าน 1 & 2)
    const fetchAllTickets = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/tickets/`);
        setTickets(response.data.data); 
        setError(null);
      } catch (err) {
        console.error('Failed to fetch all tickets:', err);
        setError('Failed to load tickets.');
      } finally {
        setLoading(false);
      }
    };

    fetchAllTickets();
  }, [user, navigate]);

  const handleStatusChange = async (ticketId, newStatus) => {
    // (เก็บสถานะเดิมไว้เผื่อ "Rollback")
    const originalTickets = [...tickets];

    // 1. Optimistic Update (อัปเดต UI ทันที)
    setTickets(prevTickets =>
      prevTickets.map(t =>
        t.id === ticketId ? { ...t, status: newStatus } : t
      )
    );
    setError(null); // เคลียร์ Error เก่า

    try {
      // 2. API Call (ส่งไป Backend)
      // (POST /api/tickets/:id/status)
      await axios.post(`${API_URL}/tickets/${ticketId}/status`, { status: newStatus });
      // (ถ้าสำเร็จ ก็ไม่ต้องทำอะไร UI ถูกอัปเดตไปแล้ว)

    } catch (err) {
      // 3. Rollback (ถ้า Backend ล้มเหลว)
      console.error('Failed to update status:', err);
      setError(`Failed to update status for ticket #${ticketId}. Please try again.`);
      // (ย้อน UI กลับไปเป็นเหมือนเดิม)
      setTickets(originalTickets);
    }
  };

  // (Logic การกรอง - เหมือน MyTickets)
  const filteredTickets = tickets.filter((ticket) => {
    const matchesStatus = statusFilter === 'All Tickets' || ticket.status === statusFilter;
    const matchesType = typeFilter === 'All Types' || ticket.type === typeFilter;
    const matchesSearch = ticket.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesType && matchesSearch;
  });

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-2">Loading All Tickets...</p>
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
    <Container fluid="md" className="dashboard-page-modern mt-4">
      
      <h2 className="dashboard-title">Admin Dashboard</h2>

      {/* Filter Bar (เหมือน MyTickets) */}
      <Row className="mb-4 p-3 filter-bar-custom align-items-center">
        <Col md={3}><Form.Group>
            <Form.Label className="fw-bold small">Status</Form.Label>
            <Form.Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="All Tickets">All Tickets</option>
              <option value="OPEN">Open</option>
              <option value="PENDING">Pending</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="CLOSED">Done</option>
            </Form.Select>
        </Form.Group></Col>
        <Col md={3}><Form.Group>
            <Form.Label className="fw-bold small">Type</Form.Label>
            <Form.Select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
              <option value="All Types">All Types</option>
              <option value="Incident">Incident</option>
              <option value="Service_Request">Service Request</option>
              <option value="Question">Question</option>
              <option value="Bug_Report">Bug Report</option>
            </Form.Select>
        </Form.Group></Col>
        <Col md={6}><Form.Group>
            <Form.Label className="fw-bold small">Search Title</Form.Label>
            <InputGroup>
              <Form.Control
                type="text"
                placeholder="Search Title..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button variant="outline-secondary"><i className="fa fa-search"><FaSearch /></i></Button>
            </InputGroup>
        </Form.Group></Col>
      </Row>

      {/* Tickets Grid */}
      <Row>
        {filteredTickets.map((ticket) => {
          const statusProps = getStatusProps(ticket.status);
          const urgencyProps = getUrgencyProps(ticket.urgency);
		  const statusClass = getStatusClass(ticket.status);
          return (
            <Col key={ticket.id} sm={12} md={6} className="mb-4">
              <Card className="ticket-card shadow-sm h-100">
                <Card.Header className="d-flex justify-content-between align-items-center">
                  <div>
                    <strong>Status: </strong>
                    <Badge bg={statusProps.variant}>{statusProps.text}</Badge>
                  </div>
				  <div>
                    <Form.Label htmlFor={`status-select-${ticket.id}`} className="fw-bold small me-2">Status:</Form.Label>
                    <Form.Select
                      id={`status-select-${ticket.id}`}
                      size="sm"
                      value={ticket.status}
                      // (เรียกฟังก์ชันใหม่)
                      onChange={(e) => handleStatusChange(ticket.id, e.target.value)}
                      // (เพิ่ม CSS Class ใหม่)
                      className={`status-select ${statusClass}`}
                    >
                      <option value="OPEN">Open</option>
                      <option value="PENDING">Pending</option>
                      <option value="IN_PROGRESS">In Progress</option>
                      <option value="CLOSED">Done</option>
                    </Form.Select>
                  </div>
                  <div>
                    <strong>Urgency: </strong>
                    <Badge bg={urgencyProps.variant}>{urgencyProps.text}</Badge>
                  </div>
                </Card.Header>
                
                <Card.Body>
                  <Card.Title>{ticket.title}</Card.Title>
                  
                  {/* (เพิ่มข้อมูลผู้ส่ง) */}
                  <Card.Subtitle className="mb-2 text-muted small">
                    Submitted by: {ticket.submittedBy?.name || 'N/A'}
                  </Card.Subtitle>

                  <Card.Text className="text-muted">
                    {ticket.description?.substring(0, 100)}...
                  </Card.Text>
                </Card.Body>
                
                <Card.Footer className="d-flex justify-content-between align-items-center">
                  <Button 
                    variant="primary" 
                    size="sm"
                    onClick={() => navigate(`/ticket/${ticket.id}`)}
                  >
                    View Details
                  </Button>
                  <small className="text-muted">
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
          No tickets found.
        </Alert>
      )}

    </Container>
  );
}

export default AdminDashboard;
import { Container, Row, Col, Card } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  const features = [
    {
      id: 1,
      title: 'แจ้งปัญหา',
      description: 'สร้างและจัดการรายงานปัญหาของคุณได้อย่างง่ายดาย'
    },
    {
      id: 2,
      title: 'ติดตามสถานะ',
      description: 'ติดตามความคืบหน้าของปัญหาของคุณแบบ Real-time'
    },
    {
      id: 3,
      title: 'ติดต่อทีมงาน',
      description: 'สื่อสารกับทีมสนับสนุนของเราได้ตลอดเวลา'
    }
  ];

  return (
    <div className="App">
      {/* Hero Section */}
      <section className="hero-section">
        <Container>
          <Row className="align-items-center">
            <Col lg={6} md={12} className="hero-text">
              <h1 className="hero-title">"จัดการปัญหาของคุณได้ง่ายในคลิกเดียว"</h1>
              <p className="hero-subtitle">ระบบ IT Support Ticket System สำหรับการจัดการอย่างมีประสิทธิภาพ</p>
              <div className="hero-image-placeholder">
                {/* Image placeholder */}
              </div>
            </Col>
            <Col lg={6} md={12} className="hero-visual">
              <div className="hero-illustration">
                {/* Illustration can be added here */}
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <Container>
          <Row className="g-4 justify-content-center">
            {features.map((feature) => (
              <Col lg={4} md={6} sm={12} key={feature.id}>
                <Card className="feature-card">
                  <Card.Body className="feature-card-body">
                    <Card.Title className="feature-title">
                      {feature.title}
                    </Card.Title>
                    <Card.Text className="feature-text">
                      {feature.description}
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Footer */}
      <footer className="app-footer">
        <Container>
          <Row>
            <Col md={12} className="text-center">
              <p>&copy; 2025 IT Support | Contact | Terms | Privacy</p>
            </Col>
          </Row>
        </Container>
      </footer>
    </div>
  );
}

export default App;

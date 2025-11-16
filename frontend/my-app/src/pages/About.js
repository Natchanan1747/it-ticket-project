import React from 'react';
import { Container, Row, Col, Image, Card } from 'react-bootstrap';
import '../styles/about.css';

const teamMembers = [
  {
    name: 'Natchanan Kamthanpipat',
    role: 'Frontend Developer',
    imgSrc: 'https://placehold.co/200x200/EFEFEF/1E3A8A?text=N'
  },
  {
    name: 'Thanawadee Koedkamtorn',
    role: 'Database, Documentation',
    imgSrc: 'https://placehold.co/200x200/EFEFEF/1E3A8A?text=T'

  },
  {
    name: 'Kummaree Yardsamer',
    role: 'Backend Developer',
    imgSrc: 'https://placehold.co/200x200/EFEFEF/1E3A8A?text=K'
  }
];

function About() {
  return (
    <div className="about-page-container">
      <Container className="py-5">
        {/* Team Section --- */}
        <Row className="justify-content-center text-center mb-5">
          <Col md={8}>
            <h2 className="section-title">OUR TEAM</h2>
            <p className="section-subtitle">
              ทีมพัฒนาระบบ IT Support Ticket System
            </p>
          </Col>
        </Row>

        {/* Team Grid */}
        <Row>
          {teamMembers.map((member, index) => (
            <Col md={4} sm={12} key={index} className="mb-4">
              <div className="team-member-card">
                <div className="team-member-img-wrapper">
                  <Image 
                    src={member.imgSrc} 
                    roundedCircle 
                    className="team-member-img" 
                  />
                </div>
                <h4 className="team-member-name">{member.name}</h4>
                <p className="team-member-role">{member.role}</p>
              </div>
            </Col>
          ))}
        </Row>

      </Container>
    </div>
  );
}

export default About;
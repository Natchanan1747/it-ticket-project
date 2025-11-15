import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import '../App.css';

export default function Dashboard() {
	const features = [
		{ id: 1, title: 'แจ้งปัญหา', description: 'สร้างและจัดการรายงานปัญหาของคุณได้อย่างง่ายดาย' },
		{ id: 2, title: 'ติดตามสถานะ', description: 'ติดตามความคืบหน้าของปัญหาของคุณแบบ Real-time' },
		{ id: 3, title: 'ติดต่อทีมงาน', description: 'สื่อสารกับทีมสนับสนุนของเราได้ตลอดเวลา' }
	];

	return (
		<Container className="py-4">
			<h2 className="mb-3">Dashboard</h2>
			<Row className="g-4">
				{features.map((f) => (
					<Col md={4} key={f.id}>
						<Card>
							<Card.Body>
								<Card.Title>{f.title}</Card.Title>
								<Card.Text>{f.description}</Card.Text>
							</Card.Body>
						</Card>
					</Col>
				))}
			</Row>
		</Container>
	);
}

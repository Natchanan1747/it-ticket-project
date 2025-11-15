import React, { useState } from 'react';
import { Container, Form, Button, Row, Col } from 'react-bootstrap';
import '../styles/report.css';

function Report() {
	const [title, setTitle] = useState('');
	const [details, setDetails] = useState('');
	const [severity, setSeverity] = useState('Low');
	const [file, setFile] = useState(null);

	const handleSubmit = (e) => {
		e.preventDefault();
		// Minimal submit handling for now. Integrate with API as needed.
		const payload = { title, details, severity, file };
		// eslint-disable-next-line no-console
		console.log('Submit report:', payload);
		alert('Report submitted (demo)');
		// reset form
		setTitle('');
		setDetails('');
		setSeverity('Low');
		setFile(null);
	};

	const handleCancel = () => {
		setTitle('');
		setDetails('');
		setSeverity('Low');
		setFile(null);
	};

	return (
		<div className="report-page">
				<Container className="report-container">
					<div className="report-card">
						<h2 className="report-card__title">Report Problem Form</h2>
						<hr />
						<Form onSubmit={handleSubmit} className="report-form">
							<Form.Group controlId="reportTitle" className="mb-3">
								<Form.Label>หัวข้อ</Form.Label>
								<Form.Control
									type="text"
									value={title}
									onChange={(e) => setTitle(e.target.value)}
									placeholder=""
								/>
							</Form.Group>

							<Form.Group controlId="reportDetails" className="mb-3">
								<Form.Label>รายละเอียด</Form.Label>
								<Form.Control
									as="textarea"
									rows={6}
									value={details}
									onChange={(e) => setDetails(e.target.value)}
								/>
							</Form.Group>

							<Row className="mb-4">
								<Col md={6} className="mb-3 mb-md-0">
									<Form.Label>แนบไฟล์</Form.Label>
									<div className="file-input-wrapper">
										<input
											type="file"
											onChange={(e) => setFile(e.target.files && e.target.files[0])}
											className="file-input"
										/>
									</div>
								</Col>
								<Col md={6}>
									<Form.Group controlId="severitySelect">
										<Form.Label>ความรุนแรงปัญหา</Form.Label>
										<Form.Select value={severity} onChange={(e) => setSeverity(e.target.value)}>
											<option>Low</option>
											<option>Medium</option>
											<option>High</option>
										</Form.Select>
									</Form.Group>
								</Col>
							</Row>

							<div className="d-flex justify-content-center gap-3 report-actions">
								<Button variant="danger" className="btn-cancel" onClick={handleCancel}>
									ยกเลิก
								</Button>
								<Button variant="success" type="submit" className="btn-confirm">
									ยืนยัน
								</Button>
							</div>
						</Form>
					</div>
				</Container>
			</div>
	);
}

export default Report;

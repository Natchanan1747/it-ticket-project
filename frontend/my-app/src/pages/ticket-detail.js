import React from 'react';
import { useParams } from 'react-router-dom';
import { Container } from 'react-bootstrap';

export default function TicketDetail() {
	const { id } = useParams();
	return (
		<Container className="py-4">
			<h2>Ticket Detail</h2>
			<p>Ticket id: {id}</p>
		</Container>
	);
}

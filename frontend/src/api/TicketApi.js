
export async function getTicketById(id) {
    const link = `http://localhost:8081/api/ticket/detail/${id}`;
    const token = localStorage.getItem('jwtToken');
    try {
        const response = await fetch(link, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

       return response;
    } catch (error) {
        console.error('Error:', error);
    }
}
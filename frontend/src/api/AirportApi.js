
export async function getAllAirport() {
    const link = `http://localhost:8081/api/airport`;
    const token = localStorage.getItem('jwtToken');
    try {
        const response = await fetch(link, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (response.ok) {
            const data = await response.json();
            return data
        } else {
            return null;
        }
    } catch (error) {
        console.error('Error:', error);
    }
}
export async function addAirport(data) {
    const link = `http://localhost:8081/api/airport/create`;
    const token = localStorage.getItem('jwtToken');
    try {
        const response = await fetch(link, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

       return response;
    } catch (error) {
        console.error('Error:', error);
    }
}
export async function deleteAirport(id) {
    const link = `http://localhost:8081/api/airport/delete/${id}`;
    const token = localStorage.getItem('jwtToken');
    try {
        const response = await fetch(link, {
            method: 'DELETE',
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
export async function getAirportById(id) {
    const link = `http://localhost:8081/api/airport/${id}`;
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

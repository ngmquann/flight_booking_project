

export async function getAllAirline() {
    const link = `http://localhost:8081/api/admin/airline`;
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
            console.log(data)
            return data
        } else {
            return null;
        }
    } catch (error) {
        console.error('Error:', error);
    }
}
export async function deleteAirline(id) {
    const link = `http://localhost:8081/api/admin/airline/delete/${id}`;
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
export async function createOrUpdateAirline(data) {
    const link = `http://localhost:8081/api/admin/airline/create`;
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
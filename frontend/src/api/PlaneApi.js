export async function getAllPlane() {
    const link = `http://localhost:8081/api/admin/plane`;
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
export async function createOrUpdatePlane(data) {
    const link = `http://localhost:8081/api/admin/plane/create`;
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
export async function deletePlane(id) {
    const link = `http://localhost:8081/api/admin/plane/${id}`;
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
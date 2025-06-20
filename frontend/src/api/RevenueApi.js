
export async function getAllRevenueByDate() {
    const link = `http://localhost:8081/api/admin/revenue/today`;
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
export async function getAllRevenueByMonth(yearly) {
    const link = `http://localhost:8081/api/admin/revenue/yearly/${yearly}`;
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
export async function getDashboardSummary() {
    const link = `http://localhost:8081/api/admin/revenue/dashboard`;
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
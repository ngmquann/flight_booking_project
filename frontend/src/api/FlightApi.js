export async function getAllFlights() {
  const link = `http://localhost:8081/api/flight/by-admin`
  const token = localStorage.getItem("jwtToken")
  try {
    const response = await fetch(link, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })

    if (response.ok) {
      const data = await response.json()
      return data
    } else {
      return null
    }
  } catch (error) {
    console.error("Error:", error)
  }
}
export async function createOrUpdateFlight(data) {
  const link = `http://localhost:8081/api/flight/create`
  const token = localStorage.getItem("jwtToken")
  try {
    const response = await fetch(link, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
    console.log(response)
    return response
  } catch (error) {
    console.error("Error:", error)
  }
}
export async function getFlightById(id) {
  const link = `http://localhost:8081/api/flight/detail/${id}`
  const token = localStorage.getItem("jwtToken")
  try {
    const response = await fetch(link, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })

    if (response.ok) {
      const data = await response.json()
      return data
    } else {
      return null
    }
  } catch (error) {
    console.error("Error:", error)
  }
  return null
}
export async function setStatusFlight(id) {
  const link = `http://localhost:8081/api/flight/status/${id}`
  const token = localStorage.getItem("jwtToken")
  try {
    const response = await fetch(link, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
    return response
  } catch (error) {
    console.error("Error:", error)
  }
}
export async function searchByCode(data) {
  const link = `http://localhost:8081/api/flight/search?code=${data}`
  const token = localStorage.getItem("jwtToken")
  try {
    const response = await fetch(link, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })

    if (response.ok) {
      const data = await response.json()
      return data
    } else {
      return null
    }
  } catch (error) {
    console.error("Error:", error)
  }
}
export async function searchByUser(data) {
  const link = `http://localhost:8081/api/flight/search`
  try {
    const response = await fetch(link, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    if (response.ok) {
      return response
    } else {
      return null
    }
  } catch (error) {
    console.error("Error:", error)
  }
}

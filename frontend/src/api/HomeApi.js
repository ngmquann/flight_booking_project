export async function getDataSearchHome() {
  const link = `http://localhost:8081/api/home`
  try {
    const response = await fetch(link, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
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

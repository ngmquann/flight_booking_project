export async function payment(data) {
  const link = `http://localhost:8081/api/payment/create_payment_vnpay`
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

    if (response.ok) {
      return response
    } else {
      return null
    }
  } catch (error) {
    console.error("Error:", error)
  }
}

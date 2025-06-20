import "./App.css"
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"
import CommonAdmin from "./pages/admin/CommonAdmin"
import CommonWeb from "./pages/web/CommonWeb"
import FlightComponent from "./components/admin/FlightComponent"
import AirportComponent from "./components/admin/AirportComponent"
import AirlineComponent from "./components/admin/AirlineComponent"
import FlightDetail from "./components/admin/detail/FlightDetail"
import PlaneComponent from "./components/admin/PlaneComponent"
import DashboardComponent from "./components/admin/DashboardComponent"
import CommonHome from "./layout/web/home/CommonHome"
import CommonSearch from "./layout/web/search/CommonSearch"
import { jwtDecode } from "jwt-decode"
import Booking from "./layout/web/booking/booking"
import Profile from "./layout/web/profile/Profile"

function App() {
  const token = localStorage.getItem("jwtToken")
  let userData
  let isAdmin = false

  if (token) {
    userData = jwtDecode(token)
    isAdmin = userData.role === "ADMIN"
  }
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/*" element={<CommonWeb />}>
            <Route path="" element={<CommonHome />} />
            <Route path="search" element={<CommonSearch />} />
            <Route path="booking" element={<Booking />} />
            <Route path="profile" element={<Profile />} />
          </Route>
          <Route
            path="/admin/*"
            element={isAdmin ? <CommonAdmin /> : <Navigate to="/" />}
          >
            <Route path="flight" element={<FlightComponent />} />
            <Route path="flight/create" element={<FlightDetail />} />
            <Route path="airport" element={<AirportComponent />} />
            <Route path="airline" element={<AirlineComponent />} />
            <Route path="plane" element={<PlaneComponent />} />
            <Route path="dashboard" element={<DashboardComponent />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App

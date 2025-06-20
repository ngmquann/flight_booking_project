import React, { useEffect, useState } from "react"
import {
  Card,
  Button,
  Row,
  Col,
  Tag,
  Tabs,
  Tooltip,
  Drawer,
  Form,
  Select,
  DatePicker,
  Carousel,
  Timeline,
  Flex,
  message,
  Spin,
} from "antd"
import {
  faPlaneArrival,
  faPlaneDeparture,
} from "@fortawesome/free-solid-svg-icons"
import { ReactComponent as SeatIcon } from "../../../assets/icon/seat.svg"
import {
  CalendarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  InfoCircleOutlined,
  LeftOutlined,
  LoadingOutlined,
  RightOutlined,
  SearchOutlined,
} from "@ant-design/icons"
import { getDataSearchHome } from "../../../api/HomeApi"
import { searchByUser } from "../../../api/FlightApi"
import LoadingGuest from "../../../util/LoadingGuest"
import { useLocation, useNavigate } from "react-router-dom"
import dayjs from "dayjs"
import "dayjs/locale/vi"
import utc from "dayjs/plugin/utc"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
dayjs.extend(utc)
const { Option } = Select
export default function Content({
  setListAirline,
  filterAirline,
  filterPrice,
}) {
  const generateFlightItems = (flightChecked) => [
    {
      key: "1",
      label: (
        <span>
          <InfoCircleOutlined style={{ marginRight: "5px" }} />
          Chi tiết
        </span>
      ),
      children: flightChecked ? (
        <Timeline mode="left">
          <Timeline.Item
            label={dayjs(flightChecked.departureTime).utc().format("HH:mm")}
            dot={
              <ClockCircleOutlined
                style={{ fontSize: "16px", color: "#1890ff" }}
              />
            }
          >
            <div>
              <strong>
                {flightChecked.departureLocation} (
                {flightChecked.codeDepartAirport})
              </strong>
              <div style={{ color: "#888" }}>
                Sân bay {flightChecked.departureAirport}
              </div>
              <div>
                <img
                  src={flightChecked.logoAirline}
                  alt={flightChecked.airline}
                  style={{ height: "20px", marginRight: "8px" }}
                />
                <strong>{flightChecked.airline}</strong> -{" "}
                {flightChecked.codeFlight} • Khuyến mãi
              </div>
              <div style={{ color: "#777", fontSize: "12px" }}>
                Hành lý 0kg (mua khi đặt chỗ) • Hành lý xách tay 7kg
              </div>
              <a href="#" style={{ color: "#1890ff" }}>
                Xem giá hành lý mua thêm
              </a>
            </div>
          </Timeline.Item>
          <Timeline.Item label="Thời gian bay">
            {(() => {
              const departure = dayjs(flightChecked.departureTime).utc()
              const arrival = dayjs(flightChecked.arrivalTime).utc()
              const duration = arrival.diff(departure, "minute")
              const hours = Math.floor(duration / 60)
              const minutes = duration % 60
              return `${hours}h ${minutes}m`
            })()}
          </Timeline.Item>
          <Timeline.Item
            label={dayjs(flightChecked.arrivalTime).utc().format("HH:mm")}
            dot={
              <ClockCircleOutlined
                style={{ fontSize: "16px", color: "#52c41a" }}
              />
            }
          >
            <div>
              <strong>
                {flightChecked.arrivalLocation} ({flightChecked.codeArriAirport}
                )
              </strong>
              <div style={{ color: "#888" }}>
                Sân bay {flightChecked.arrivalAirport}{" "}
              </div>
              <div>
                <strong>Máy bay {flightChecked.plane.name} </strong>
              </div>
            </div>
          </Timeline.Item>
        </Timeline>
      ) : (
        <div>Không có dữ liệu</div>
      ),
    },
    {
      key: "2",
      label: (
        <span>
          <InfoCircleOutlined style={{ marginRight: "5px" }} />
          Khuyến mãi
        </span>
      ),
      children: <p>Các chương trình khuyến mãi hiện có...</p>,
    },
  ]
  const [form] = Form.useForm()
  const navigate = useNavigate()
  const location = useLocation()
  const searchParams = new URLSearchParams(location.search)
  const disabledDate = (current) => {
    return current < dayjs().startOf("day")
  }
  const [activeTabKey, setActiveTabKey] = useState("1")
  const [showTab, setShowTab] = useState(false)
  const [carouselItems, setCarouselItems] = useState([])
  const [open, setOpen] = useState(false)
  const [openRight, setOpenRight] = useState(false)
  const [titleSearch, setTitleSearch] = useState({
    fromTo: "",
    date: "",
  })
  const [currentIndex, setCurrentIndex] = useState(0)
  const totalSlides = carouselItems.length
    ? dayjs(searchParams.get("departureDate")).format("YYYY-MM-DD")
    : dayjs().format("YYYY-MM-DD")

  const [listAirport, setListAirport] = useState([])
  const [seatClasses, setSeatClasses] = useState([])
  const [listFlight, setListFlight] = useState([])
  const [listFlightFilter, setListFlightFilter] = useState([])
  const [loading, setLoading] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [flightChecked, setFlightChecked] = useState(null)
  const [listSeatClass, setListSeatClass] = useState({
    business: { type: "Vé thương gia", price: null },
    economy: { type: "Vé tiêu chuẩn", price: null },
  })
  const [selectedSeatClass, setSelectedSeatClass] = useState(null)
  const [selectedLuggage, setSelectedLuggage] = useState(null)
  const [seatPrice, setSeatPrice] = useState(0)
  const [luggagePrice, setLuggagePrice] = useState(0)

  const [listLuggages, setListLuggages] = useState(null)
  const handleCardClick = () => {
    setActiveTabKey("1")
  }
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search)
    const departureDate = queryParams.get("departureDate")
    const dateObject = new Date(departureDate)
    let nextDays = []
    dayjs.locale("vi")
    for (let i = 0; i < 7; i++) {
      const nextDay = dayjs(dateObject).add(i, "day")
      const formattedNextDay = nextDay
        .format("dddd")
        .replace(/^th/, "Th")
        .replace(/^ch/, "Ch")
      const formattedNextDay2 = nextDay
        .format("DD [tháng] M")
        .replace(/^th/, "Th")
        .replace(/^ch/, "Ch")
      nextDays.push({
        day: formattedNextDay,
        price: `${formattedNextDay2}`,
      })
    }
    setCarouselItems(nextDays)
  }, [])

  const fetchSearchByUser = async (data) => {
    try {
      const queryParams = new URLSearchParams({
        departure: data.departureAirport,
        arrival: data.arrivalAirport,
        departureDate: data.departureTime,
        seatClass: data.seatClass,
      }).toString()
      navigate(`/search?${queryParams}`)
      setLoading(true)
      data.departureTime = dayjs(data.departureTime).format("DD-MM-YYYY")
      const response = await searchByUser(data)
      if (response.ok) {
        const result = await response.json()
        setListFlight(result)
        setListFlightFilter(result)
        filterAline(result)
        console.log(result)
      }
    } catch (error) {
      console.log("Lỗi tìm kiếm!")
    } finally {
      setLoading(false)
    }
  }
  const filterAline = (items) => {
    setListAirline((prevList) => {
      const newList = []

      items.forEach((item) => {
        const isExist = newList.some(
          (airline) => airline.label === item.airline
        )
        if (!isExist) {
          newList.push({
            key: item.id.toString(),
            label: item.airline,
            price: item.ecoPrice,
            logo: item.logoAirline,
          })
        }
      })

      return newList
    })
  }

  const searchBySearch = (values) => {
    const { departure, arrival, departureDate, seatClass } = values
    if (!departure) {
      message.error("Sân bay đi không được để trống!")
      return
    }

    if (!arrival) {
      message.error("Sân bay đến không được để trống!")
      return
    }

    if (!departureDate) {
      message.error("Ngày đi không được để trống!")
      return
    }

    if (!seatClass) {
      message.error("Hạng ghế không được để trống!")
      return
    }

    const dateObject = new Date(departureDate)
    const departureTime = dayjs(dateObject).format("YYYY-MM-DD")
    let form = ""
    let to = ""
    listAirport.forEach((airport) => {
      if (airport.id === departure) {
        form = `${airport.location} (${airport.code})`
      }
      if (airport.id === arrival) {
        to = `${airport.location} (${airport.code})`
      }
    })

    const formattedDate = dayjs(dateObject)
      .locale("vi")
      .format("dddd, DD [th] MM YYYY")
      .replace(/^th/, "Th")
      .replace(/^ch/, "Ch")

    const formTo = `${form} -> ${to}`
    setTitleSearch((prevState) => ({
      ...prevState,
      fromTo: formTo,
      date: formattedDate,
    }))

    console.log(formTo, formattedDate)

    const data = {
      departureAirport: departure,
      arrivalAirport: arrival,
      departureTime: departureTime,
      seatClass: seatClass,
    }
    console.log(data)
    fetchSearchByUser(data)
  }
  const getDataFlightByHomeSearch = () => {
    const queryParams = new URLSearchParams(location.search)
    const departure = parseInt(queryParams.get("departure"), 10)
    const arrival = parseInt(queryParams.get("arrival"), 10)
    const departureDate = queryParams.get("departureDate")
    const seatClass = queryParams.get("seatClass")

    if (!departure || !arrival || !departureDate || !seatClass) {
      message.error("Thiếu thông tin tìm kiếm!")
      return
    }

    const values = { departure, arrival, departureDate, seatClass }
    // console.log(values)
    searchBySearch(values)
  }

  const fetchDataSearchHome = async () => {
    try {
      const response = await getDataSearchHome()
      if (response.ok) {
        const result = await response.json()
        setListAirport(result.airportResponses)
        setSeatClasses(result.seatClasses)
      }
    } catch (error) {
      message.error("Không thể lấy dữ liệu sân bay!")
    }
  }
  useEffect(() => {
    handleDateChange(0)
  }, [])
  useEffect(() => {
    const departureDate = searchParams.get("departureDate")
    if (departureDate) {
      const formattedDate = dayjs(departureDate)
        .locale("vi")
        .format("dddd, DD [th] MM YYYY")
        .replace(/^th/, "Th")
        .replace(/^ch/, "Ch")

      setTitleSearch((prevState) => ({
        ...prevState,
        date: formattedDate,
      }))
    }
  }, [location.search])
  useEffect(() => {
    fetchDataSearchHome()
  }, [location.search])
  useEffect(() => {
    getDataFlightByHomeSearch()
  }, [listAirport])
  useEffect(() => {
    handleFilter()
  }, [filterAirline, filterPrice])
  const handleShowTab = () => {
    setShowTab((pre) => !pre)
  }
  const onClose = () => {
    setOpen(false)
  }
  const showDrawer = () => {
    setOpen(true)
  }
  const carouselRef = React.useRef(null)
  if (loading) return <LoadingGuest />
  const nextSlide = () => {
    carouselRef.current.next()
  }

  const prevSlide = () => {
    carouselRef.current.prev()
  }
  const showDrawerRight = () => {
    setOpenRight(true)
    setShowTab(true)
  }
  const onCloseRight = () => {
    setOpenRight(false)
    setShowTab(false)
    setSelectedSeatClass(null)
    setSelectedLuggage(null)
    setSeatPrice(0)
    setLuggagePrice(0)
  }
  const handleDateChange = (index) => {
    if (selectedIndex === index) {
      return
    }
    const prevIndex = selectedIndex
    const countChange = index - prevIndex

    const currentDepartureDate = searchParams.get("departureDate")
    if (currentDepartureDate) {
      const currentDate = dayjs(currentDepartureDate)
      const updatedDate = currentDate
        .add(countChange, "day")
        .format("YYYY-MM-DD")
      searchParams.set("departureDate", updatedDate)
      navigate(`?${searchParams.toString()}`)
      const formattedDate = dayjs(updatedDate)
        .locale("vi")
        .format("dddd, DD [th] MM YYYY")
        .replace(/^th/, "Th")
        .replace(/^ch/, "Ch")

      setTitleSearch((prevState) => ({
        ...prevState,
        date: formattedDate,
      }))
    }
    setSelectedIndex(index)
  }

  const handleOnChangeTicket = (value, price) => {
    setSelectedSeatClass(value)
    setSeatPrice(price)
  }
  const handleOnChangeLuggage = (value, price) => {
    setSelectedLuggage(value)
    setLuggagePrice(price)
  }
  const handleBooking = (flightData) => {
    console.log("Dữ liệu chuyến bay:", flightData.id)
    console.log("Dữ liệu Luggage:", selectedLuggage)
    let tmp = ""
    if (selectedSeatClass === "economy") {
      tmp = "Economy Class"
    }
    if (selectedSeatClass === "business") {
      tmp = "Business Class"
    }
    if (tmp === "") {
      message.warning("Bạn phải chọn loại ghế!")
    } else {
      navigate("/booking", {
        state: {
          flight: flightData,
          luggage: selectedLuggage,
          seatClass: tmp,
          totalPrice: seatPrice + luggagePrice,
        },
      })
    }
  }
  const handleFilter = () => {
    let filteredFlights = [...listFlight]
    if (filterAirline.length > 0) {
      filteredFlights = filteredFlights.filter((flight) =>
        filterAirline.includes(flight.airline)
      )
    }

    if (filterPrice.length === 2) {
      const [minPrice, maxPrice] = filterPrice
      filteredFlights = filteredFlights.filter(
        (flight) => flight.ecoPrice >= minPrice && flight.ecoPrice <= maxPrice
      )
    }

    setListFlightFilter(filteredFlights)
    console.log("Filtered Flights:", filteredFlights)
  }

  return (
    <div>
      <Card
        bordered
        style={{
          borderRadius: "10px",
          margin: "10px 0",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
        }}
      >
        <div className="background_title-search">
          <Row align="middle">
            <Col span={16}>
              <Card
                bordered
                style={{
                  borderRadius: "10px",
                  margin: "0px 0",
                }}
              >
                <div className="d-flex justify-content-between text-start align-items-center">
                  <div>
                    <div className="fs-5 fw-bold">{titleSearch.fromTo}</div>
                    <div>{titleSearch.date}</div>
                  </div>
                  <Tooltip title="Search" onClick={showDrawer}>
                    <Button
                      type="default"
                      shape="circle"
                      icon={<SearchOutlined />}
                    />
                  </Tooltip>
                </div>
              </Card>
            </Col>
            <Drawer
              placement="top"
              closable={false}
              onClose={onClose}
              open={open}
              key="top"
              className="d-flex "
              style={{
                width: "1000px",
                margin: "0 auto",
                height: "320px",
                marginTop: "100px",
                borderRadius: "10px",
              }}
            >
              <Form
                form={form}
                labelCol={{
                  span: 4,
                }}
                wrapperCol={{
                  span: 14,
                }}
                layout="horizontal"
                initialValues={{
                  size: "middle",
                }}
                size="middle"
                style={{
                  maxWidth: 1200,
                  margin: "0 auto",
                }}
                onFinish={searchBySearch}
              >
                <h4 className="pb-4 text-capitalize">
                  Tìm chuyến bay bạn muốn đến
                </h4>
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item label="Từ" name="departure">
                      <Select
                        prefix={<FontAwesomeIcon icon={faPlaneDeparture} />}
                        placeholder="Chọn điểm đi"
                        className="no-border-select"
                      >
                        {listAirport.map((item) => (
                          <Option key={item.id} value={item.id}>
                            {item.name} ({item.code})
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="Đến" name="arrival">
                      <Select
                        prefix={<FontAwesomeIcon icon={faPlaneArrival} />}
                        placeholder="Chọn điểm đến"
                        className="no-border-select"
                      >
                        {listAirport.map((item) => (
                          <Option key={item.id} value={item.id}>
                            {item.name} ({item.code})
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      label="Ngày đi"
                      style={{ flex: 1 }}
                      name="departureDate"
                    >
                      <DatePicker
                        prefix={<CalendarOutlined />}
                        suffixIcon={[]}
                        placeholder="Chọn ngày"
                        disabledDate={disabledDate}
                        format="DD-MM-YYYY"
                        style={{ width: "100%" }}
                        className="no-border-date"
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      label="Hạng ghế"
                      style={{ flex: 1 }}
                      name="seatClass"
                    >
                      <Select
                        prefix={<SeatIcon width={18} height={18} />}
                        placeholder="Chọn hạng ghế"
                        className="no-border-select"
                      >
                        {seatClasses.map((item, index) => (
                          <Select.Option key={index} value={item}>
                            {item}
                          </Select.Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>
                <div className="d-flex justify-content-end mt-4">
                  <Button
                    type="primary"
                    htmlType="submit"
                    style={{ padding: "20px 30px", fontSize: "18px" }}
                    danger
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      className="bi bi-search"
                      viewBox="0 0 16 16"
                    >
                      <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
                    </svg>
                    Tìm chuyến bay
                  </Button>
                </div>
              </Form>
            </Drawer>
            <Col span={24}>
              <Card
                bordered
                style={{
                  borderRadius: "10px",
                  margin: "10px 0",
                }}
              >
                <div
                  style={{
                    position: "relative",
                    margin: "0 auto",
                  }}
                >
                  <Carousel
                    ref={carouselRef}
                    dots={false}
                    slidesToShow={6}
                    slidesToScroll={1}
                    style={{
                      backgroundColor: "#1976d2",
                      padding: "20px",
                      borderRadius: "8px",
                      color: "#fff",
                    }}
                  >
                    {carouselItems.map((item, index) => (
                      <div
                        key={index}
                        className={selectedIndex === index ? "pick-item" : ""}
                        style={{
                          textAlign: "center",
                          padding: "10px",
                          background: "#fff",
                          color: "#1976d2",
                          borderRadius: "8px",
                          margin: "5px",
                          display: "flex",
                          width: "125px",
                          flexDirection: "column",
                          alignItems: "center",
                        }}
                        onClick={() => handleDateChange(index)}
                      >
                        <span
                          style={{
                            fontWeight: "bold",
                            width: "125px",
                            display: "block",
                          }}
                        >
                          {item.day}
                        </span>
                        <span style={{ display: "block" }}>{item.price}</span>
                      </div>
                    ))}
                  </Carousel>
                  <Button
                    onClick={prevSlide}
                    style={{
                      position: "absolute",
                      top: "50%",
                      left: "-40px",
                      transform: "translateY(-50%)",
                      backgroundColor: "#0056b3",
                      color: "#fff",
                      border: "none",
                    }}
                    icon={<LeftOutlined />}
                    disabled={currentIndex === 0}
                  />

                  <Button
                    onClick={nextSlide}
                    style={{
                      position: "absolute",
                      top: "50%",
                      right: "-40px",
                      transform: "translateY(-50%)",
                      backgroundColor: "#0056b3",
                      color: "#fff",
                      border: "none",
                    }}
                    icon={<RightOutlined />}
                    disabled={currentIndex === totalSlides - 1}
                  />
                </div>
              </Card>
            </Col>
          </Row>
        </div>
      </Card>
      <h5>Tất cả chuyến bay</h5>
      <div>
        {listFlightFilter.map((item, index) => (
          <Card
            bordered
            style={{
              borderRadius: "10px",
              margin: "10px 0",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
            }}
            onClick={handleShowTab}
          >
            <Row align="middle">
              <Col span={4} style={{ textAlign: "center" }}>
                <img
                  src={item.logoAirline}
                  alt={item.airline}
                  style={{ width: "100px", height: "auto" }}
                />
              </Col>
              <Col span={12}>
                <h3 className="text-start">{item.name}</h3>
                <Row>
                  <Col span={8}>
                    <div>{dayjs(item.departureTime).utc().format("HH:mm")}</div>
                    <div style={{ color: "gray" }}>
                      {item.codeDepartAirport}
                    </div>
                  </Col>
                  <Col span={8} style={{ textAlign: "center" }}>
                    <div>
                      {(() => {
                        const departure = dayjs(item.departureTime).utc()
                        const arrival = dayjs(item.arrivalTime).utc()
                        const duration = arrival.diff(departure, "minute")
                        const hours = Math.floor(duration / 60)
                        const minutes = duration % 60
                        return `${hours}h ${minutes}m`
                      })()}
                    </div>
                    <div className="process-flight"></div>
                    <div style={{ fontSize: "12px", color: "gray" }}>
                      Bay thẳng
                    </div>
                  </Col>
                  <Col span={8} style={{ textAlign: "right" }}>
                    <div>{dayjs(item.arrivalTime).utc().format("HH:mm")}</div>
                    <div style={{ color: "gray" }}>{item.codeArriAirport}</div>
                  </Col>
                </Row>
              </Col>
              <Col span={8} style={{ textAlign: "right" }}>
                <div className="d-flex align-items-center justify-content-end">
                  <div style={{ fontSize: "20px", color: "red" }}>
                    {item.ecoPrice.toLocaleString("vi-VN")} VND
                  </div>
                  <div style={{ fontSize: "15px", color: "gray" }}>/khách</div>
                </div>
                <Button
                  type="primary"
                  style={{ borderRadius: "5px" }}
                  onClick={() => {
                    setFlightChecked(item)
                    setListSeatClass((prev) => ({
                      ...prev,
                      business: { ...prev.business, price: item.busPrice },
                      economy: { ...prev.economy, price: item.ecoPrice },
                    }))
                    setListLuggages(item.luggages)
                    showDrawerRight()
                  }}
                >
                  Chọn
                </Button>
              </Col>
            </Row>
          </Card>
        ))}
        <Drawer
          title="Thông tin chuyến bay"
          placement="right"
          closable={false}
          onClose={onCloseRight}
          open={openRight}
          width={800}
          key="right"
        >
          {flightChecked && (
            <Card
              bordered
              style={{
                borderRadius: "10px",
                margin: "10px 0",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
              }}
              onClick={handleShowTab}
            >
              <Row align="middle">
                <Col span={4} style={{ textAlign: "center" }}>
                  <img
                    src={flightChecked.logoAirline}
                    alt={flightChecked.airline}
                    style={{ width: "100px", height: "auto" }}
                  />
                </Col>
                <Col span={12}>
                  <h3 className="text-start">{flightChecked.name}</h3>
                  <Row>
                    <Col span={8}>
                      <div>
                        {dayjs(flightChecked.departureTime)
                          .utc()
                          .format("HH:mm")}
                      </div>
                      <div style={{ color: "gray" }}>
                        {flightChecked.codeDepartAirport}
                      </div>
                    </Col>
                    <Col span={8} style={{ textAlign: "center" }}>
                      <div>
                        {(() => {
                          const departure = dayjs(
                            flightChecked.departureTime
                          ).utc()
                          const arrival = dayjs(flightChecked.arrivalTime).utc()
                          const duration = arrival.diff(departure, "minute")
                          const hours = Math.floor(duration / 60)
                          const minutes = duration % 60
                          return `${hours}h ${minutes}m`
                        })()}
                      </div>
                      <div className="process-flight"></div>
                      <div style={{ fontSize: "12px", color: "gray" }}>
                        Bay thẳng
                      </div>
                    </Col>
                    <Col span={8} style={{ textAlign: "right" }}>
                      <div>
                        {dayjs(flightChecked.arrivalTime).utc().format("HH:mm")}
                      </div>
                      <div style={{ color: "gray" }}>
                        {flightChecked.codeArriAirport}
                      </div>
                    </Col>
                  </Row>
                </Col>
                <Col span={8} style={{ textAlign: "right" }}>
                  <div className="d-flex align-flightCheckeds-center justify-content-end">
                    <div style={{ fontSize: "20px", color: "red" }}>
                      {flightChecked.ecoPrice.toLocaleString("vi-VN")} VND
                    </div>
                    <div style={{ fontSize: "15px", color: "gray" }}>
                      /khách
                    </div>
                  </div>
                </Col>
              </Row>
            </Card>
          )}
          <Tabs
            activeKey={activeTabKey}
            onChange={setActiveTabKey}
            items={generateFlightItems(flightChecked)}
            style={{
              marginTop: "10px",
              fontSize: "12px",
            }}
          />
          <Card
            bordered
            style={{
              borderRadius: "10px",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
              position: "fixed",
              bottom: 0,
              width: "100%",
              maxWidth: "1200px",
              backgroundColor: "#f8f9fa",
              height: "200px",
              marginBottom: "20px",
            }}
          >
            <div
              className="row w-100 justify-content-between align-items-center"
              style={{ gap: "10px" }}
            >
              <div className="col-8">
                <span style={{ color: "#555", fontSize: "15px" }}>
                  Loại vé:{" "}
                  <b>
                    <Select
                      placeholder="Chọn loại vé"
                      className="no-border-select"
                      style={{ width: "250px" }}
                      value={selectedSeatClass}
                      onChange={(value) => {
                        const selectedItem = listSeatClass[value]
                        handleOnChangeTicket(value, selectedItem?.price || 0)
                      }}
                    >
                      {Object.entries(listSeatClass).map(([key, item]) => (
                        <Option key={key} value={key}>
                          {item.type} (
                          {item.price
                            ? `${item.price.toLocaleString("vi-VN")} VND`
                            : "Chưa có giá"}
                          )
                        </Option>
                      ))}
                    </Select>
                  </b>
                </span>
                <br />
                <span style={{ color: "#555" }}>
                  Hành lý ký gửi:
                  <b>
                    <Select
                      style={{ width: "250px" }}
                      placeholder="Chọn hạng ghế"
                      className="no-border-select"
                      value={selectedLuggage}
                      onChange={(value) => {
                        const selectedItem = listLuggages.find(
                          (item) => item.id === value
                        )
                        handleOnChangeLuggage(value, selectedItem?.price || 0)
                      }}
                    >
                      {listLuggages &&
                        listLuggages.map((item, index) => (
                          <Option key={index} value={item.id}>
                            {`Cân nặng: ${
                              item.weight
                            }kg - ${item.price.toLocaleString("vi-VN")} VND}`}
                          </Option>
                        ))}
                    </Select>
                  </b>
                </span>
                <br />
                <div
                  style={{
                    fontSize: "16px",
                    fontWeight: "bold",
                    color: "#007bff",
                    marginTop: "10px",
                  }}
                >
                  Tổng:{" "}
                  <b>
                    {(seatPrice + luggagePrice).toLocaleString("vi-VN")} VND
                  </b>
                </div>
                <div className=" w-100 d-flex justify-content-end">
                  <Button
                    type="primary"
                    htmlType="submit"
                    style={{
                      padding: "25px 30px",
                      fontSize: "18px",
                      fontWeight: "600",
                      borderRadius: "8px",
                    }}
                    danger
                    onClick={() => handleBooking(flightChecked)}
                  >
                    Tiếp tục đặt chỗ
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </Drawer>
      </div>
    </div>
  )
}

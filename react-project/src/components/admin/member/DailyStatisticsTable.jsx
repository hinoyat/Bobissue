import React, { useState, useEffect } from 'react'
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  CategoryScale,
} from 'chart.js'
import Breadcrumb from '../common/Breadcrumb'
import API from '../../../utils/API'

ChartJS.register(LineElement, PointElement, LinearScale, Title, Tooltip, Legend, CategoryScale)

const DailyStatisticsTable = () => {
  const breadcrumbPaths = [
    { name: 'Home' },
    { name: '회원관리' },
    { name: '가입통계' },
    { name: '일별가입통계분석' },
  ]

  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [dailyData, setDailyData] = useState([])
  const [filteredData, setFilteredData] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  // 날짜 범위 내의 모든 날짜를 생성하는 함수
  const generateDateRange = (start, end) => {
    const dates = []
    let currentDate = new Date(start)
    const endDate = new Date(end)

    while (currentDate <= endDate) {
      dates.push(currentDate.toISOString().split('T')[0])
      currentDate.setDate(currentDate.getDate() + 1)
    }
    return dates
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await API.get('/users')
        const data = response.data.result.data

        // API 호출 시점의 날짜를 기본값으로 설정
        const queryDate = new Date()
        const year = queryDate.getFullYear()
        const month = (queryDate.getMonth() + 1).toString().padStart(2, '0')
        const date = queryDate.getDate().toString().padStart(2, '0')
        const formattedQueryDate = `${year}-${month}-${date}`

        // 시작일과 종료일을 API 호출 시점으로 설정
        setStartDate(formattedQueryDate)
        setEndDate(formattedQueryDate)

        const dailyCounts = {}
        data.forEach((user) => {
          const rawDate = user.createAt
          const formattedDate = rawDate.slice(0, 8)
          const dateWithDash = `${formattedDate.slice(0, 4)}-${formattedDate.slice(4, 6)}-${formattedDate.slice(6, 8)}`
          dailyCounts[dateWithDash] = (dailyCounts[dateWithDash] || 0) + 1
        })

        const dailyDataArray = Object.entries(dailyCounts).map(([date, count]) => ({
          date,
          count,
        }))

        setDailyData(dailyDataArray)
        setIsLoading(false)
      } catch (error) {
        console.error('데이터 불러오기 오류:', error)
        alert('회원 데이터를 불러오는 데 실패했습니다.')
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  useEffect(() => {
    if (startDate && endDate) {
      // 선택된 날짜 범위의 모든 날짜 생성
      const allDates = generateDateRange(startDate, endDate)

      // 각 날짜에 대해 가입자 수 매핑 (없으면 0)
      const dailyDataMap = new Map(dailyData.map((item) => [item.date, item.count]))

      const filtered = allDates.map((date) => ({
        date,
        count: dailyDataMap.get(date) || 0,
      }))

      setFilteredData(filtered)
    }
  }, [startDate, endDate, dailyData])

  const chartData = {
    labels: filteredData.map((data) => data.date),
    datasets: [
      {
        label: '가입 수',
        data: filteredData.map((data) => data.count),
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: true,
        tension: 0.3,
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
    },
    scales: {
      x: {
        ticks: {
          font: {
            size: 12,
          },
        },
      },
      y: {
        ticks: {
          font: {
            size: 12,
          },
        },
        beginAtZero: true,
      },
    },
  }

  return (
    <div className='p-6'>
      <Breadcrumb paths={breadcrumbPaths} />
      <h2 className='text-2xl font-bold mb-6'>일별 가입 통계 분석</h2>

      <div className='mb-6 grid grid-cols-1 md:grid-cols-2 gap-6'>
        <div>
          <label className='block text-sm font-medium mb-2'>시작 날짜</label>
          <input
            type='date'
            className='border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-blue-500'
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <div>
          <label className='block text-sm font-medium mb-2'>종료 날짜</label>
          <input
            type='date'
            className='border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-blue-500'
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
      </div>

      <table className='table-auto w-full border mb-6'>
        <thead>
          <tr>
            <th className='border p-2'>날짜</th>
            <th className='border p-2'>가입 수</th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td className='border p-2 text-center' colSpan='2'>
                데이터를 불러오는 중...
              </td>
            </tr>
          ) : filteredData.length > 0 ? (
            filteredData.map((data) => (
              <tr key={data.date}>
                <td className='border p-2 text-center'>{data.date}</td>
                <td className='border p-2 text-center'>{data.count}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td className='border p-2 text-center' colSpan='2'>
                선택한 기간의 데이터가 없습니다.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {!isLoading && filteredData.length > 0 && (
        <div className='mb-6' style={{ height: '300px' }}>
          <h3 className='text-lg font-semibold mb-4'>가입 통계 그래프</h3>
          <Line data={chartData} options={chartOptions} />
        </div>
      )}
    </div>
  )
}

export default DailyStatisticsTable

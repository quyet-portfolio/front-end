'use client'

import { goldApi, GoldResponse, InvestmentsResponseData, TimeRange } from '@/src/lib/api/gold'
import { Select, Spin, Table } from 'antd'
import { ColumnsType } from 'antd/es/table'
import { useEffect, useState } from 'react'
import { Line } from 'react-chartjs-2'

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

const { Option } = Select

const TIME_RANGE_OPTIONS: { value: TimeRange; label: string }[] = [
  { value: 7, label: '7 ngày' },
  { value: 30, label: '30 ngày' },
  { value: 60, label: '60 ngày' },
  { value: 365, label: '1 năm' },
]

export function formatDate(dateString: string) {
  const date = new Date(dateString)
  return date.toLocaleDateString('vi-VN')
}

const formatPrice = (value: number) => {
  if (!value) return '0'
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
}

const GoldView = () => {
  const [listInvestments, setListInvestments] = useState<InvestmentsResponseData[]>([])
  const [dataGold, setDataGold] = useState<GoldResponse | null>(null)
  const [goldPriceList, setGoldPriceList] = useState<any>({
    labels: [],
    datasets: [],
  })
  const [loading, setLoading] = useState(true)
  const [chartLoading, setChartLoading] = useState(false)
  const [selectedDays, setSelectedDays] = useState<TimeRange>(30)

  const fetchGoldData = async () => {
    try {
      setLoading(true)
      const [investmentsRes, goldRes] = await Promise.all([
        goldApi.getDataInvesments(),
        goldApi.getDataGold(),
      ])

      setListInvestments(investmentsRes)
      setDataGold(goldRes)
    } catch (error) {
      console.log('Error fetching gold data :: ', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchChartData = async (days: TimeRange) => {
    try {
      setChartLoading(true)
      const goldPriceListRes = await goldApi.getDataGoldPriceList(days)

      const dataGoldPrice = {
        labels: goldPriceListRes
          .sort((a, b) => new Date(a?.createdAt).getTime() - new Date(b?.createdAt).getTime())
          .map((item) => formatDate(item?.createdAt)),
        datasets: [
          {
            label: 'Giá mua',
            data: goldPriceListRes.map((item) => item?.buyPrice),
            borderColor: 'rgb(75, 192, 192)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
          },
          {
            label: 'Giá bán',
            data: goldPriceListRes.map((item) => item?.sellPrice),
            borderColor: 'rgb(255, 99, 132)',
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
          },
        ],
      }
      setGoldPriceList(dataGoldPrice)
    } catch (error) {
      console.log('Error fetching chart data :: ', error)
    } finally {
      setChartLoading(false)
    }
  }

  useEffect(() => {
    fetchGoldData()
    fetchChartData(30)
  }, [])

  const handleTimeRangeChange = (value: TimeRange) => {
    setSelectedDays(value)
    fetchChartData(value)
  }

  const columns: ColumnsType<InvestmentsResponseData> = [
    {
      title: 'Ngày mua',
      dataIndex: 'date',
      key: 'date',
      render: (_, record) => <div>{formatDate(record?.date)}</div>,
    },
    {
      title: 'Số chỉ vàng',
      dataIndex: 'goldGram',
      key: 'goldGram',
    },
    {
      title: 'Số tiền / Giá mua (VND)',
      key: 'amount',
      render: (_, record) => (
        <div>
          {formatPrice(record?.amountVND)} / {formatPrice(record?.buyPrice)}
        </div>
      ),
    },
    {
      title: 'Giá mua hiện tại',
      render: () => <div>--</div>,
    },
    {
      title: 'Giá bán hiện tại',
      render: () => <div>--</div>,
    },
    {
      title: 'Lãi/Lỗ (VND)',
      render: (_, record, index) =>
        index === 0 ? <div>{formatPrice(dataGold?.profit || 0)}</div> : '--',
    },
  ]

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: `Lịch sử giá vàng (${TIME_RANGE_OPTIONS.find((o) => o.value === selectedDays)?.label})`,
      },
    },
  }

  return (
    <div className="mt-10 flex flex-col gap-10">
      <Table
        dataSource={listInvestments}
        columns={columns}
        loading={loading}
        rowKey={(record) => record._id}
        summary={() => {
          return (
            <>
              {dataGold ? (
                <Table.Summary.Row className="bg-black-100">
                  <Table.Summary.Cell index={0} className="text-[16px] font-semibold">
                    Tổng
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={1}>
                    <div className="text-[16px] font-semibold">{formatPrice(dataGold?.totalGold)}</div>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={2}>
                    <div className="text-[16px] font-semibold">
                      {formatPrice(dataGold?.totalInvested)} / {formatPrice(dataGold?.currentValue)}
                    </div>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={3}>
                    <div className="text-[16px] font-semibold">
                      {formatPrice(dataGold?.price.buyPrice)}
                    </div>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={4}>
                    <div className="text-[16px] font-semibold">
                      {formatPrice(dataGold?.price.sellPrice)}
                    </div>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={5}>
                    <div className="text-[16px] font-semibold">{formatPrice(dataGold?.profit)}</div>
                  </Table.Summary.Cell>
                </Table.Summary.Row>
              ) : null}
            </>
          )
        }}
      />

      <div className="flex items-center gap-4">
        <span className="text-gray-600">Khoảng thời gian:</span>
        <Select
          value={selectedDays}
          onChange={handleTimeRangeChange}
          style={{ width: 120 }}
          loading={chartLoading}
        >
          {TIME_RANGE_OPTIONS.map((option) => (
            <Option key={option.value} value={option.value}>
              {option.label}
            </Option>
          ))}
        </Select>
      </div>

      {chartLoading ? <Spin /> : <Line options={options} data={goldPriceList} />}
    </div>
  )
}

export default GoldView

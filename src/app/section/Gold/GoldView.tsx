'use client'

import { goldApi, GoldResponse, InvestmentsResponseData, TimeRange } from '@/src/lib/api/gold'
import { Button, Select, Spin, Table } from 'antd'
import { ColumnsType } from 'antd/es/table'
import { useEffect, useState } from 'react'
import { Line } from 'react-chartjs-2'
import AddGoldPriceModal from './components/AddGoldPriceModal'

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
  { value: 7, label: '7 days' },
  { value: 30, label: '30 days' },
  { value: 60, label: '60 days' },
  { value: 365, label: '1 year' },
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
  const [addPriceModalOpen, setAddPriceModalOpen] = useState<boolean>(false)

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
            label: 'Buy price',
            data: goldPriceListRes.map((item) => item?.buyPrice),
            borderColor: 'rgb(75, 192, 192)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
          },
          {
            label: 'Sell price',
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
      title: 'Purchase date',
      dataIndex: 'date',
      key: 'date',
      render: (_, record) => <div>{formatDate(record?.date)}</div>,
    },
    {
      title: 'Gold amount (chỉ)',
      dataIndex: 'goldGram',
      key: 'goldGram',
    },
    {
      title: 'Amount / Buy price (VND)',
      key: 'amount',
      render: (_, record) => (
        <div>
          {formatPrice(record?.amountVND)} / {formatPrice(record?.buyPrice)}
        </div>
      ),
    },
    {
      title: 'Current buy price',
      render: () => <div>--</div>,
    },
    {
      title: 'Current sell price',
      render: () => <div>--</div>,
    },
    {
      title: 'Profit/Loss (VND)',
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
        text: `Gold Price History (${TIME_RANGE_OPTIONS.find((o) => o.value === selectedDays)?.label})`,
      },
    },
  }

  return (
    <div className="mt-10 flex flex-col gap-10">
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-gray-700 bg-black-100 p-4">
        <div className="flex flex-col gap-1">
          <div className="text-sm text-gray-400">Today&apos;s gold price</div>
          {dataGold?.price ? (
            <>
              <div className="text-lg font-semibold">
                Buy <span className="text-emerald-400">{formatPrice(dataGold.price.buyPrice)}</span>{' '}
                / Sell <span className="text-rose-400">{formatPrice(dataGold.price.sellPrice)}</span>
              </div>
              <div className="text-xs text-gray-500">
                Updated: {new Date(dataGold.price.updatedAt).toLocaleString('vi-VN')} ·{' '}
                Source: {dataGold.price.source || '—'}
              </div>
            </>
          ) : (
            <div className="text-base text-gray-500">No gold price data yet</div>
          )}
        </div>
        <Button type="primary" onClick={() => setAddPriceModalOpen(true)} disabled={loading}>
          Update Gold Price
        </Button>
      </div>

      <Table
        dataSource={listInvestments}
        columns={columns}
        loading={loading}
        rowKey={(record) => record._id}
        scroll={{ x: 'max-content' }}
        summary={() => {
          return (
            <>
              {dataGold ? (
                <Table.Summary.Row className="bg-black-100">
                  <Table.Summary.Cell index={0} className="text-[16px] font-semibold">
                    Total
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
        <span className="text-gray-600">Time range:</span>
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

      <AddGoldPriceModal
        open={addPriceModalOpen}
        onClose={() => setAddPriceModalOpen(false)}
        onSuccess={() => {
          fetchGoldData()
          fetchChartData(selectedDays)
        }}
        initialBuyPrice={dataGold?.price?.buyPrice}
        initialSellPrice={dataGold?.price?.sellPrice}
      />
    </div>
  )
}

export default GoldView

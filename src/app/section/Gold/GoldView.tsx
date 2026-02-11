'use client'

import { goldApi, GoldResponse, InvestmentsResponse, InvestmentsResponseData } from '@/src/lib/api/gold'
import { Spin, Table } from 'antd'
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

export function formatDate(dateString: string) {
  const date = new Date(dateString)

  return date.toLocaleDateString('vi-VN')
}

const formatPrice = (value: number) => {
  if (!value) return '0'

  // Chuyển về chuỗi và dùng regex thay thế
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
}

const GoldView = () => {
  const [listInvestments, setListInvestments] = useState<InvestmentsResponseData[]>([])
  const [dataGold, setDataGold] = useState<GoldResponse | null>()
  const [goldPriceList, setGoldPriceList] = useState<any>({
    labels: [],
    datasets: [],
  })
  const [loading, setLoading] = useState(true)
  const [chartLoading, setChartLoading] = useState(false)

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true)
        const [investmentsRes, goldRes] = await Promise.all([goldApi.getDataInvesments(), goldApi.getDataGold()])

        setListInvestments(investmentsRes)
        setDataGold(goldRes)

        // Fetch gold price list after getting goldRes
        setChartLoading(true)
        const goldPriceListRes = await goldApi.getDataGoldPriceList({
          month: new Date().getMonth() + 1,
          year: new Date().getFullYear(),
          limit: 30,
        })

        const dataGoldPrice = {
          labels: goldPriceListRes
            .sort((a, b) => new Date(a?.createdAt).getTime() - new Date(b?.createdAt).getTime())
            .map((item) => formatDate(item?.createdAt)),
          datasets: [
            {
              label: 'Buy Price',
              data: goldPriceListRes.map((item) => item?.buyPrice),
              borderColor: 'rgb(75, 192, 192)',
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
            },
            {
              label: 'Sell Price',
              data: goldPriceListRes.map((item) => item?.sellPrice),
              borderColor: 'rgb(255, 99, 132)',
              backgroundColor: 'rgba(255, 99, 132, 0.2)',
            },
          ],
        }
        setGoldPriceList(dataGoldPrice)
      } catch (error) {
        console.log('Error fetching data :: ', error)
      } finally {
        setLoading(false)
        setChartLoading(false)
      }
    }

    fetchAllData()
  }, [])

  const columns: ColumnsType<InvestmentsResponseData> = [
    {
      title: 'Buy date',
      dataIndex: 'date',
      key: 'date',
      render: (_, record) => <div>{formatDate(record?.date)}</div>,
    },
    {
      title: 'Gold gram',
      dataIndex: 'goldGram',
      key: 'goldGram',
    },
    {
      title: 'Amount/Price (VND)',
      key: 'amount',
      render: (_, record) => (
        <div>
          {formatPrice(record?.amountVND)} / {formatPrice(record?.buyPrice)}
        </div>
      ),
    },
    {
      title: 'Buy price',
      render: () => <div>--</div>,
    },
    {
      title: 'Sell price',
      render: () => <div>--</div>,
    },
    {
      title: 'Profit (VND)',
      render: (_, record, index) => (index === 0 ? <div>{formatPrice(dataGold?.profit || 0)}</div> : '--'),
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
        text: 'Gold Price History',
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
                    Summary
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
                    <div className="text-[16px] font-semibold">{formatPrice(dataGold?.price.buyPrice)}</div>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={4}>
                    <div className="text-[16px] font-semibold">{formatPrice(dataGold?.price.sellPrice)}</div>
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
      {chartLoading ? <Spin /> : <Line options={options} data={goldPriceList} />}
    </div>
  )
}

export default GoldView

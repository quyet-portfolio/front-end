'use client'

import { goldApi, GoldResponse, InvestmentsResponse, InvestmentsResponseData } from '@/src/lib/api/gold'
import { Spin, Table } from 'antd'
import { ColumnsType } from 'antd/es/table'
import { useEffect, useState } from 'react'

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
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true)
        const [investmentsRes, goldRes] = await Promise.all([goldApi.getDataInvesments(), goldApi.getDataGold()])

        setListInvestments(investmentsRes)
        setDataGold(goldRes)
      } catch (error) {
        console.log('Error fetching data :: ', error)
      } finally {
        setLoading(false)
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

  return (
    <div className="mt-10">
      <Table
        dataSource={listInvestments}
        columns={columns}
        loading={loading}
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
    </div>
  )
}

export default GoldView

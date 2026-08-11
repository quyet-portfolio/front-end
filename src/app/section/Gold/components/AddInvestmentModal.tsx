'use client'

import { Button, DatePicker, Form, InputNumber, Modal } from 'antd'
import dayjs, { Dayjs } from 'dayjs'
import { useEffect, useState } from 'react'
import { useMessageApi } from '@/src/contexts/MessageContext'
import { goldApi } from '@/src/lib/api/gold'

interface AddInvestmentModalProps {
  open: boolean
  onClose: () => void
  onSuccess: () => void
  /**
   * Today's shop sell price — this is what we actually pay when buying gold,
   * so it (not GoldPrice.buyPrice) is what prefills the purchase price.
   */
  initialSellPrice?: number
}

interface FormValues {
  date: Dayjs
  goldGram: number
  buyPrice: number
}

const PRICE_MIN = 10_000
const PRICE_MAX = 99_999
const GOLD_MIN = 0.001
const GOLD_MAX = 10_000

const formatThousand = (value: number | string | undefined) => {
  if (value === undefined || value === null || value === '') return ''
  return `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
}

const parseThousand = (value: string | undefined) => {
  if (!value) return 0
  return Number(value.replace(/\D/g, '')) || 0
}

const AddInvestmentModal = ({
  open,
  onClose,
  onSuccess,
  initialSellPrice,
}: AddInvestmentModalProps) => {
  const [form] = Form.useForm<FormValues>()
  const messageApi = useMessageApi()
  const [loading, setLoading] = useState<boolean>(false)

  const goldGram = Form.useWatch('goldGram', form)
  const buyPrice = Form.useWatch('buyPrice', form)
  const amountVND = goldGram && buyPrice ? goldGram * buyPrice : 0

  useEffect(() => {
    if (open) {
      form.setFieldsValue({
        date: dayjs(),
        buyPrice: initialSellPrice,
      })
    } else {
      form.resetFields()
    }
  }, [open, initialSellPrice, form])

  const handleSubmit = async (values: FormValues) => {
    try {
      setLoading(true)
      const res = await goldApi.addInvestment({
        date: values.date.toDate().toISOString(),
        goldGram: values.goldGram,
        buyPrice: values.buyPrice,
      })
      messageApi?.success(res.message || 'Investment created successfully')
      onSuccess()
      onClose()
    } catch (err: any) {
      const apiErrors = err.response?.data?.errors
      const errorMsg =
        (Array.isArray(apiErrors) && apiErrors[0]?.msg) ||
        err.response?.data?.message ||
        'Something went wrong'
      messageApi?.error(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal title="Add Gold Investment" open={open} onCancel={onClose} footer={null} destroyOnClose>
      <Form form={form} layout="vertical" onFinish={handleSubmit} requiredMark={false}>
        <Form.Item
          label="Purchase date"
          name="date"
          rules={[{ required: true, message: 'Please pick the purchase date' }]}
        >
          <DatePicker
            style={{ width: '100%' }}
            format="DD/MM/YYYY"
            disabledDate={(current) => current && current > dayjs().endOf('day')}
          />
        </Form.Item>

        <Form.Item
          label="Gold amount (chỉ)"
          name="goldGram"
          tooltip="Unit: chỉ. E.g. 1.5 = one chỉ and a half"
          rules={[
            { required: true, message: 'Please enter the gold amount' },
            {
              type: 'number',
              min: GOLD_MIN,
              max: GOLD_MAX,
              message: `Gold amount must be between ${GOLD_MIN} and ${formatThousand(GOLD_MAX)}`,
            },
          ]}
        >
          <InputNumber<number>
            placeholder="1"
            style={{ width: '100%' }}
            min={GOLD_MIN}
            max={GOLD_MAX}
            step={0.1}
            precision={3}
          />
        </Form.Item>

        <Form.Item
          label="Purchase price"
          name="buyPrice"
          tooltip="The price you paid the shop — i.e. the shop's sell price, not its buy-back price. Unit: thousand VND per chỉ — 5 digits. E.g. 14950 = 14.95 million per chỉ"
          rules={[
            { required: true, message: 'Please enter the purchase price' },
            {
              type: 'number',
              min: PRICE_MIN,
              max: PRICE_MAX,
              message: `Purchase price must be between ${formatThousand(PRICE_MIN)} and ${formatThousand(PRICE_MAX)}`,
            },
          ]}
        >
          <InputNumber<number>
            style={{ width: '100%' }}
            min={PRICE_MIN}
            max={PRICE_MAX}
            controls={false}
            formatter={formatThousand}
            parser={parseThousand}
          />
        </Form.Item>

        <div className="flex items-center justify-between rounded-md border border-gray-700 px-3 py-2">
          <span className="text-sm text-gray-400">Total amount</span>
          <span className="text-base font-semibold">{formatThousand(Math.round(amountVND))}</span>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <Button onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button type="primary" htmlType="submit" loading={loading}>
            Save
          </Button>
        </div>
      </Form>
    </Modal>
  )
}

export default AddInvestmentModal

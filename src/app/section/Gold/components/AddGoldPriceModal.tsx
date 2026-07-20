'use client'

import { Button, Form, InputNumber, Modal } from 'antd'
import { useEffect, useState } from 'react'
import { useMessageApi } from '@/src/contexts/MessageContext'
import { goldApi } from '@/src/lib/api/gold'

interface AddGoldPriceModalProps {
  open: boolean
  onClose: () => void
  onSuccess: () => void
  initialBuyPrice?: number
  initialSellPrice?: number
}

interface FormValues {
  buyPrice: number
  sellPrice: number
}

const PRICE_MIN = 10_000
const PRICE_MAX = 99_999

const formatThousand = (value: number | string | undefined) => {
  if (value === undefined || value === null || value === '') return ''
  return `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
}

const parseThousand = (value: string | undefined) => {
  if (!value) return 0
  return Number(value.replace(/\D/g, '')) || 0
}

const AddGoldPriceModal = ({
  open,
  onClose,
  onSuccess,
  initialBuyPrice,
  initialSellPrice,
}: AddGoldPriceModalProps) => {
  const [form] = Form.useForm<FormValues>()
  const messageApi = useMessageApi()
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    if (open) {
      form.setFieldsValue({
        buyPrice: initialBuyPrice,
        sellPrice: initialSellPrice,
      })
    } else {
      form.resetFields()
    }
  }, [open, initialBuyPrice, initialSellPrice, form])

  const handleSubmit = async (values: FormValues) => {
    try {
      setLoading(true)
      const res = await goldApi.addGoldPrice({
        buyPrice: values.buyPrice,
        sellPrice: values.sellPrice,
        source: 'manual',
      })
      messageApi?.success(res.message || 'Gold price updated successfully')
      onSuccess()
      onClose()
    } catch (err: any) {
      const apiErrors = err.response?.data?.errors
      const errorMsg =
        (Array.isArray(apiErrors) && apiErrors[0]?.msg) || err.response?.data?.message || 'Something went wrong'
      messageApi?.error(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal title="Update Today's Gold Price" open={open} onCancel={onClose} footer={null} destroyOnClose>
      <Form form={form} layout="vertical" onFinish={handleSubmit} requiredMark={false}>
        <Form.Item
          label="Buy price"
          name="buyPrice"
          tooltip="Unit: thousand VND per chỉ — 5 digits. E.g. 14780 = 14.78 million per chỉ"
          rules={[
            { required: true, message: 'Please enter the buy price' },
            {
              type: 'number',
              min: PRICE_MIN,
              max: PRICE_MAX,
              message: `Buy price must be between ${formatThousand(PRICE_MIN)} and ${formatThousand(PRICE_MAX)}`,
            },
          ]}
        >
          <InputNumber<number>
            placeholder="14780"
            style={{ width: '100%' }}
            min={PRICE_MIN}
            max={PRICE_MAX}
            controls={false}
            formatter={formatThousand}
            parser={parseThousand}
          />
        </Form.Item>

        <Form.Item
          label="Sell price"
          name="sellPrice"
          tooltip="Unit: thousand VND per chỉ — 5 digits. E.g. 14950 = 14.95 million per chỉ"
          rules={[
            { required: true, message: 'Please enter the sell price' },
            {
              type: 'number',
              min: PRICE_MIN,
              max: PRICE_MAX,
              message: `Sell price must be between ${formatThousand(PRICE_MIN)} and ${formatThousand(PRICE_MAX)}`,
            },
          ]}
        >
          <InputNumber<number>
            placeholder="14950"
            style={{ width: '100%' }}
            min={PRICE_MIN}
            max={PRICE_MAX}
            controls={false}
            formatter={formatThousand}
            parser={parseThousand}
          />
        </Form.Item>

        <div className="flex justify-end gap-2 mt-6">
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

export default AddGoldPriceModal

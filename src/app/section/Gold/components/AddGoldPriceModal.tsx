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
      messageApi?.success(res.message || 'Cập nhật giá vàng thành công')
      onSuccess()
      onClose()
    } catch (err: any) {
      const apiErrors = err.response?.data?.errors
      const errorMsg =
        (Array.isArray(apiErrors) && apiErrors[0]?.msg) || err.response?.data?.message || 'Có lỗi xảy ra'
      messageApi?.error(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal title="Cập nhật giá vàng hôm nay" open={open} onCancel={onClose} footer={null} destroyOnClose>
      <Form form={form} layout="vertical" onFinish={handleSubmit} requiredMark={false}>
        <Form.Item
          label="Giá mua"
          name="buyPrice"
          tooltip="Đơn vị: ngàn VND/chỉ — 5 chữ số. VD: 14780 = 14,78 triệu/chỉ"
          rules={[
            { required: true, message: 'Vui lòng nhập giá mua' },
            {
              type: 'number',
              min: PRICE_MIN,
              max: PRICE_MAX,
              message: `Giá mua phải nằm trong khoảng ${formatThousand(PRICE_MIN)} – ${formatThousand(PRICE_MAX)}`,
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
          label="Giá bán"
          name="sellPrice"
          tooltip="Đơn vị: ngàn VND/chỉ — 5 chữ số. VD: 14950 = 14,95 triệu/chỉ"
          rules={[
            { required: true, message: 'Vui lòng nhập giá bán' },
            {
              type: 'number',
              min: PRICE_MIN,
              max: PRICE_MAX,
              message: `Giá bán phải nằm trong khoảng ${formatThousand(PRICE_MIN)} – ${formatThousand(PRICE_MAX)}`,
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
            Hủy
          </Button>
          <Button type="primary" htmlType="submit" loading={loading}>
            Lưu
          </Button>
        </div>
      </Form>
    </Modal>
  )
}

export default AddGoldPriceModal

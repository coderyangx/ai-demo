import { useEffect, useState } from 'react'
import { Button, Form } from '@douyinfe/semi-ui'
import { getProducts, createProduct } from '../../services'
import type { Product } from '../../services'
import './index.less'

// 模拟products
const mockProducts: Product[] = [
  {
    product: '肉蛋品类',
    productName: '牛肉',
    productDesc: '来自内蒙古大草原新鲜牛肉，高蛋白质含量，肉质鲜嫩多汁，减脂增肌人群的理想选择，每100g含蛋白质26g。',
    price: 45
  },
  {
    product: '肉蛋品类',
    productName: '鸡胸肉',
    productDesc: '低脂高蛋白鸡胸肉，肉质细嫩，口感鲜美，健身人群首选食材，每100g仅含1.6g脂肪，蛋白质含量高达23g。',
    price: 25
  },
  {
    product: '肉蛋品类',
    productName: '鸡蛋',
    productDesc: '农家散养土鸡蛋，蛋黄饱满色泽金黄，富含优质蛋白质和多种维生素，营养全面，适合日常饮食搭配。',
    price: 15
  },
  {
    product: '蔬果品类',
    productName: '西兰花',
    productDesc: '新鲜绿叶西兰花，富含膳食纤维和维生素C，低热量高营养，健康蔬菜首选，每100g仅34大卡。',
    price: 8
  },
  {
    product: '蔬果品类',
    productName: '牛油果',
    productDesc: '进口新鲜牛油果，富含健康不饱和脂肪酸，美容养颜圣品，口感绵密细腻，适合制作沙拉和吐司。',
    price: 12
  },
  {
    product: '谷物品类',
    productName: '燕麦片',
    productDesc: '无糖纯燕麦片，早餐冲泡即食，饱腹感强，富含β-葡聚糖，有助于降低胆固醇，每100g约350大卡。',
    price: 18
  },
  {
    product: '奶制品类',
    productName: '脱脂牛奶',
    productDesc: '低脂高钙脱脂牛奶，营养不减脂肪更少，口感清爽不腻，每100ml仅含0.1g脂肪，钙含量高达120mg。',
    price: 9
  }
]

const Supabase = () => {
  // ❌ 错误：每次渲染都会执行 JSON.parse
  // const [firstRender, setFirstRender] = useState(JSON.parse(localStorage.getItem('fasting_data') || '{}'))
  // console.log('firstRender', firstRender)
  // ✅ 正确：只在首次渲染执行一次, 后续重新渲染不会重复读取 localStorage
  // const [firstRender2, setFirstRender2] = useState(() => {
  //   const stored = localStorage.getItem('fasting_data')
  //   console.log('firstRender2', JSON.parse(stored || '{}'))
  //   return stored ? JSON.parse(stored) : {}
  // })

  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState<Product>({
    product: '',
    productName: '',
    productDesc: '',
    price: 0
  })

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const data = await getProducts()
      setProducts(data || [])
    } catch (error) {
      console.error('获取产品失败:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateProduct = async (values) => {
    try {
      await createProduct(values)
      setFormData({ product: '', productName: '', productDesc: '', price: 0 })
      setShowForm(false)
      fetchProducts()
    } catch (error) {
      console.error('创建产品失败:', error)
    }
  }

  return (
    <div className='supabase-page'>
      <h2 className='page-title'>产品管理</h2>

      <div className='action-buttons'>
        <button className='btn btn-primary' onClick={() => setShowForm(!showForm)}>
          {showForm ? '取消' : '添加产品'}
        </button>

        <button className='btn btn-outline' onClick={fetchProducts} disabled={loading}>
          刷新列表
        </button>
      </div>

      {showForm && (
        <Form className='product-form' onSubmit={(values) => handleCreateProduct(values)}>
          <Form.Input field='product' label='产品类别' placeholder='例如：肉蛋品类、蔬果品类' />
          <Form.Input field='productName' label='产品名称' type='text' placeholder='例如：牛肉、西兰花' />
          <Form.TextArea field='productDesc' label='产品描述' placeholder='请输入产品描述' rows={3} />
          <Form.InputNumber
            field='price'
            label='价格（元）'
            style={{ width: '100%' }}
            placeholder='请输入价格'
            min={0}
          />
          <Button htmlType='submit' type='primary'>
            添加
          </Button>
        </Form>
      )}

      {loading ? (
        <p className='loading-text'>加载中...</p>
      ) : (
        <div className='product-list'>
          {products.length === 0 ? (
            <p className='empty-text'>暂无产品数据</p>
          ) : (
            products.map((product) => (
              <div key={product.id} className='product-card'>
                <div className='product-header'>
                  <span className='product-category'>{product.product}</span>
                  <span className='product-price'>¥{product.price}</span>
                </div>
                <h3 className='product-name'>{product.productName}</h3>
                <p className='product-desc'>{product.productDesc}</p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}

export default Supabase

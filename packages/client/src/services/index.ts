import axios from 'axios'

const baseUrl = 'https://server.aicoder.dpdns.org'

const http = axios.create({
  baseURL: baseUrl,
  timeout: 60 * 1000
})

export const getProducts = async () => {
  const res = await http.get('/api/products/list')
  console.log('产品列表 ', res)
  return res.data
}

export const createProduct = async (createProduct: Product) => {
  const res = await http.post('/api/products/add', createProduct)
  console.log('创建产品 ', res)
  return res.data
}

export const deleteProduct = async (id: number) => {
  const res = await http.post(`/api/products/delete/${id}`)
  console.log('删除产品 ', res)
  return res.data
}

export const updateProduct = async (updateProduct: Product) => {
  const res = await http.post('/api/products/update', updateProduct)
  console.log('更新产品 ', res)
  return res.data
}

export interface Product {
  id?: number
  created_at?: string
  product: string
  productName: string
  productDesc: string
  price: number
}

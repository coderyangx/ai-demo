import { AppConfig } from '@/config'
import axios from 'axios'

const http = axios.create({
  baseURL: AppConfig.apiBaseUrl || 'https://server.aicoder.dpdns.org',
  timeout: 60 * 1000
})

export const getProducts = async () => {
  const res = await http.get('/api/product/list')
  console.log('产品列表 ', res)
  return res.data
}

export const createProduct = async (createProduct: Product) => {
  const res = await http.post('/api/product/add', createProduct)
  console.log('创建产品 ', res)
  return res.data
}

export const deleteProduct = async (id: number) => {
  const res = await http.post(`/api/product/delete/${id}`)
  console.log('删除产品 ', res)
  return res.data
}

export const updateProduct = async (updateProduct: Product) => {
  const res = await http.post('/api/product/update', updateProduct)
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

import { Inter } from 'next/font/google'
import { getPayments } from '@/app/lib/mongos/payments'

const inter = Inter({ subsets: ['latin'] })

async function fetchPayments() {
  const { payments } = await getPayments()
  if (!payments) throw new Error('Failed to fetch payments!')

  return payments
}

export default async function Columns() {
  const payments = await fetchPayments()
  return (
    <tbody>
    {payments.map( (payment, index) => (
      <tr key={payment._id}>
        <th>{index+1}</th> 
        <td>{payment.tittle}</td> 
        <td>{payment.tittle}</td> 
        <td>{payment.tittle}</td> 
        <td>{payment.tittle}</td> 
        <td>{payment.tittle}</td> 
        <td>{payment.tittle}</td>
      </tr>
      ))}
      </tbody>
  )
}

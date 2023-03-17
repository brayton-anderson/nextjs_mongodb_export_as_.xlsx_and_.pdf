import styles from './page.module.css'
import Table from './components/table'

const inter = Inter({ subsets: ['latin'] })

export default async function Home() {


  return (
    <div className={styles.main}>
      <Table/>
    </div>
  )
}

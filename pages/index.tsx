import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Skill Academy</title>
        <meta name="description" content="Skill Academy" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to <a href="#">Skill Academy</a>
        </h1>

        <div className={styles.grid}>

          <h2>Learn Professional Skills and Get Private Jobs</h2>
        </div>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://testbook.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          Testbook.com

        </a>
      </footer>
    </div>
  )
}

export default Home

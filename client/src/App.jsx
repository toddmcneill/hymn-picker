import './App.css'
import { useRoutes, Link } from 'raviger'
import Home from './components/home'
import HistoryList from './components/historyList'
import History from './components/history'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const routes = {
  '/': () => <Home />,
  '/history': () => <HistoryList />,
  '/history/:id': ({ id }) => <History id={id} />
}

const queryClient = new QueryClient()

function App() {
  const route = useRoutes(routes)

  return (
    <>
      <Link href="/">Hymn Picker</Link>
      <hr />
      <Link href="/history">History</Link>
      <hr />
      <QueryClientProvider client={queryClient}>
        {route}
      </QueryClientProvider>
    </>
  )
}

export default App

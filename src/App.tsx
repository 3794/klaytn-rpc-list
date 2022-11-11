import { useState } from 'react'
import { QueryClient, QueryClientProvider } from 'react-query'
import RPC from './RPC'

export default function App () {
  const [queryClient] = useState(() => new QueryClient())

  return (
    <QueryClientProvider client={queryClient}>
      <RPC />
    </QueryClientProvider>
  )
}

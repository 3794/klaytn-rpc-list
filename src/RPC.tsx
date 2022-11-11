import { useMemo } from 'react'
import { RPCList } from './RPCList'
import useRPCData from './useRPCData'

function RPC () {
  const nodes = useRPCData(RPCList)

  const data = useMemo(() => {
    const sortedData = nodes?.sort((a, b) => {
      if (a.isLoading) {
        return 1
      }

      const h1 = a?.data?.height
      const h2 = b?.data?.height
      const l1 = a?.data?.latency
      const l2 = b?.data?.latency

      if (!h2) {
        return -1
      }

      if (h2 - h1 > 0) {
        return 1
      }
      if (h2 - h1 < 0) {
        return -1
      }
      if (h1 === h2) {
        if (l1 - l2 < 0) {
          return -1
        } else {
          return 1
        }
      }
      return 1
    })

    const topRpc = sortedData[0]?.data

    return sortedData.map(({ data, ...rest }) => {
      const { height = null, latency = null, url = '' } = data || {}

      let trust = 'transparent'
      let disableConnect = false

      if (
        !height ||
        !latency ||
        topRpc?.height - height > 3 ||
        topRpc?.latency - latency > 5000
      ) {
        trust = 'red'
      } else if (
        topRpc?.height - height < 2 &&
        topRpc?.latency - latency > -600
      ) {
        trust = 'green'
      } else {
        trust = 'orange'
      }

      if (url.includes('wss://') || url.includes('API_KEY')) { disableConnect = true }

      const lat = latency ? (latency / 1000).toFixed(3) + 's' : null

      return {
        ...rest,
        data: { ...data, height, latency: lat, trust, disableConnect }
      }
    })
  }, [nodes])

  return (
    <div className="m-2">
      <h1 className="text-lg">Klaytn RPC List</h1>
      <div className="grid md:grid-cols-[4fr_1fr_1fr_1fr] max-w-2xl">
        <div className="hidden md:block md:border-b-2">RPC Server Address</div>
        <div className="hidden md:block text-center md:border-b-2">Height</div>
        <div className="hidden md:block text-center md:border-b-2">Latency</div>
        <div className="hidden md:block text-center md:border-b-2">Score</div>
        {data.map((item, index) => (
          <Row
              values={item}
              key={index}
            />
        ))}
      </div>
    </div>
  )
}

function Row ({ values }: any) {
  const { data } = values

  return (
    <>
      <div><div className="md:border-b-2">{data?.url}</div></div>
      <div className="grid grid-cols-[5em_1fr] md:block before:content-[attr(data-name)] md:before:content-none md:text-center md:border-b-2" data-name="Height">{data?.height}</div>
      <div className="grid grid-cols-[5em_1fr] md:block before:content-[attr(data-name)] md:before:content-none md:text-center md:border-b-2" data-name="Latency">{data?.latency}</div>
      <div className="grid grid-cols-[5em_1fr] md:flex md:justify-center before:content-[attr(data-name)] md:before:content-none border-b-2" data-name="Score"><Circle fill={data?.trust}/></div>
    </>
  )
}

function Circle ({ fill }: { fill: string }) {
  return (
    <svg height="10" width="10" className="my-auto">
      <circle cx="5" cy="5" r="5" fill={fill} />
    </svg>
  )
}

export default RPC

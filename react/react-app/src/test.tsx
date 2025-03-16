import React, { useEffect, useState } from 'react'

export default function Test() {
  const [count, setCount] = useState(1)

  useEffect(() => {
    console.log('count' + count)
  }, [count])

  const handleClick = () => {
    setCount(count + 1)
  }

  return (
    <div>
      <div>{count}</div>
      <button onClick={handleClick}>+1</button>
    </div>
  )
}

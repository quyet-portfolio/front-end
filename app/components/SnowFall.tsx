'use client'
import { useEffect } from 'react'

export default function Snowfall() {
  useEffect(() => {
    const createSnowflake = () => {
      const snowflake = document.createElement('div')
      snowflake.classList.add('snowflake')
      snowflake.innerText = '❄'
      snowflake.style.left = `${Math.random() * 100}vw`
      snowflake.style.animationDuration = `${Math.random() * 8 + 8}s`
      snowflake.style.fontSize = `${Math.random() * 10 + 10}px`

      document.body.appendChild(snowflake)

      setTimeout(() => {
        snowflake.remove()
      }, 30000)
    }

    const interval = setInterval(createSnowflake, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <style jsx global>{`
      .snowflake {
        position: fixed;
        top: -10px;
        color: #a8d7f5;
        font-size: 1em;
        opacity: 0.8;
        animation: fall linear infinite;
        pointer-events: none;
      }
      @keyframes fall {
        0% {
          transform: translateY(0) rotate(0deg);
          opacity: 0.8;
        }
        100% {
          transform: translateY(45vh) rotate(360deg);
          opacity: 0.3;
        }
      }
    `}</style>
  )
}

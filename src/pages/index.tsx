import { NextPage } from 'next'
import Head from 'next/head'
import { DateTime } from 'luxon'
import nearestColorName from '../nearestColorName'
import accesibleColor from '../accessibleColor'
import { useEffect, useRef, useState } from 'react'
import tinycolor from 'tinycolor2'
import { Canvas, MeshProps } from '@react-three/fiber'
import { useSpring, animated } from 'react-spring'
import { a } from '@react-spring/three'

const Home: NextPage = () => {
  const [time, setTime] = useState<DateTime | undefined>(undefined)
  const [color, setColor] = useState(tinycolor(calculateColor(DateTime.now())))
  // create a common spring that will be used later to interpolate other values
  const [{ scale }, api] = useSpring(() => ({ scale: 1 }))
  // interpolate values from commong spring
  console.log(scale)

  function calculateColor (time: DateTime) {
    const hmsTime = parseInt(time.toFormat('HHmmss'), 16)*5
    const mdyTime = parseInt(time.plus({days:1}).toFormat('MMddyy'), 16)*5
    const calculatedColor =
      '#' + ((hmsTime + mdyTime) % parseInt('FFFFFF', 16)).toString(16)
    console.log(calculatedColor)
    return tinycolor(calculatedColor)
  }

  useEffect(() => {
    function tick () {
      const newTime = DateTime.local()
      setTime(newTime)
      setColor(calculateColor(newTime))
      api.start({
        to: [{ scale: 1.15 }, { scale: 1 }],
        config: { mass: 1, tension: 500, friction: 15, precision: 0.0001 }
      })
    }
    tick()
    setInterval(tick, 1000)
  }, [])

  if (!time) {
    return (
      <div
        className='font-bold w-screen h-screen flex justify-center items-center'
        style={{
          backgroundColor: color.toHexString(),
          color: accesibleColor(color, [color])
        }}
      >
        {' '}
        Loading..
      </div>
    )
  }
  return (
    <>
      <Head>
        <title>It&apos;s {nearestColorName(color)} o&apos;clock</title>
        <meta name='description' content='Generated by create-t3-app' />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <div
        style={{
          backgroundColor: color.clone().darken(5).toHexString(),
          color: accesibleColor(color, [color])
        }}
        className='font-bold w-screen h-screen font-mono flex flex-col justify-center items-center p-4 relative'
      >
        <div
          style={{ color: accesibleColor(color, [color]) }}
          className='text-center z-20 absolute right-0 left-0 top-2/5'
        >
          <h1 className='text-4xl'>{time.toLocaleString()}</h1>
          <h1 className='text-4xl'>
            {time.toLocaleString({
              hour: 'numeric',
              minute: '2-digit',
              second: '2-digit',
              hourCycle: 'h11'
            })}
          </h1>
          <h1 className="pt-10 text-lg">{color.toHexString()}</h1>
          <h2 className="text-2xl">{nearestColorName(color)}</h2>
        </div>
        <Canvas className='h-full flex'>
          <ambientLight />
          <pointLight position={[10, 10, 10]} />
          <a.mesh scale={scale}>
            <sphereGeometry args={[1.5]} />
            <meshStandardMaterial color={color.toHexString()} />
          </a.mesh>
        </Canvas>
      </div>
    </>
  )
}

export default Home

import React, { useState, useEffect } from 'react';


import './Countdown.css'




const Countdown = (props) => {

    const [sheebafiTime, setSheebafiTime] = useState(false)

    const [days, setDays] = useState(0)
    const [hours, setHours] = useState(0)
    const [minutes, setMinutes] = useState(0)
    const [seconds, setSeconds] = useState(0)

    useEffect(() => {


        const interval = setInterval(() => {
            const now = new Date().getTime()

            const difference = props.difference - now

            const d = Math.floor(difference / (1000 * 60 * 60* 24))
            setDays(d)

            const h = Math.floor(
                (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
            )
            setHours(h)

            const m = Math.floor(
                (difference % (1000 * 60 * 60 )) / (1000 * 60)
            )
            setMinutes(m)

            const s = Math.floor(
                (difference % (1000 * 60)) / (1000)
            )
            setSeconds(s)


            if(d <= 0 && h <= 0 && m <= 0 && s <= 0) setSheebafiTime(true)

        }, 1000)

        return () => clearInterval(interval)
    }, [])

    return (
        <>

  
            {
                sheebafiTime ? 
                <div className='countdown-container'>
                    <div className='title'> closing soon </div>
                    <div className='countdown-wrapper'>
                        <div className='countdown-inner'>
                            <div className='countdown-segment'>
                                <span className='time'> 0 </span>
                                <span className='label'> days </span>
                            </div>
                            <span className='divider'> : </span>
                            <div className='countdown-segment'>
                                <span className='time'> 0 </span>
                                <span className='label'> hours </span>
                            </div>
                            <span className='divider'> : </span>
                            <div className='countdown-segment'>
                                <span className='time'> 0 </span>
                                <span className='label'> minutes </span>
                            </div>
                            <span className='divider'> : </span>
                            <div className='countdown-segment'>
                                <span className='time'> 0 </span>
                                <span className='label'> seconds </span>
                            </div>
                        </div>
                    </div>
                </div>
                
                :
                <div className='countdown-container'>
                    <div className='title'> estimated closing time </div>
                    <div className='countdown-wrapper'>
                        <div className='countdown-inner'>
                            <div className='countdown-segment'>
                                <span className='time'> {days} </span>
                                <span className='label'> days </span>
                            </div>
                            <span className='divider'> : </span>
                            <div className='countdown-segment'>
                                <span className='time'> {hours} </span>
                                <span className='label'> hours </span>
                            </div>
                            <span className='divider'> : </span>
                            <div className='countdown-segment'>
                                <span className='time'> {minutes} </span>
                                <span className='label'> minutes </span>
                            </div>
                            <span className='divider'> : </span>
                            <div className='countdown-segment'>
                                <span className='time'> {seconds} </span>
                                <span className='label'> seconds </span>
                            </div>
                        </div>
                    </div>
                </div>
            }


        </>
    )
}

export default Countdown

import { useRef, useState, useEffect } from 'react'
import { StationPreview } from './StationPreview'
import { ArrowLeftIcon } from './svg/ArrowLeftIcon'
import { ArrowRightIcon } from './svg/ArrowRightIcon'

export function StationCarousel({ stations, goToStation }) {
    const scrollAreaRef = useRef()
    const [canScrollLeft, setCanScrollLeft] = useState(false)
    const [canScrollRight, setCanScrollRight] = useState(false)

    function scrollByPx(amount) {
        scrollAreaRef.current?.scrollBy({ left: amount, behavior: 'smooth' })
    }

    function updateArrowState() {
        const el = scrollAreaRef.current
        if (!el) return
        setCanScrollLeft(el.scrollLeft > 0)
        setCanScrollRight(el.scrollLeft + el.offsetWidth < el.scrollWidth - 1)
    }

    useEffect(() => {
        const el = scrollAreaRef.current
        if (!el) return
        el.addEventListener('scroll', updateArrowState)
        window.addEventListener('resize', updateArrowState)
        updateArrowState()
        return () => {
            el.removeEventListener('scroll', updateArrowState)
            window.removeEventListener('resize', updateArrowState)
        }
    }, [])

    return (
        <section 
            className={`carousel-section${canScrollLeft ? ' can-scroll-left' : ''}${canScrollRight ? ' can-scroll-right' : ''}`}
        >
            <div className="carousel-scroll-area" ref={scrollAreaRef}>
                <div className="carousel-track">
                    {stations.map(station => (
                        <div className="carousel-item" key={station._id}>
                            <StationPreview station={station} goToStation={goToStation} />
                        </div>
                    ))}
                </div>
            </div>
            
            <div className="carousel-controls">
               <button
                    className={`carousel-btn carousel-btn-left${canScrollLeft ? ' show' : ''}`}
                    onClick={() => scrollByPx(-350)}
                    tabIndex={canScrollLeft ? 0 : -1}
                >
                    <ArrowLeftIcon />
                </button>
                <button
                    className={`carousel-btn carousel-btn-right${canScrollRight ? ' show' : ''}`}
                    onClick={() => scrollByPx(350)}
                    tabIndex={canScrollRight ? 0 : -1}
                >
                    <ArrowRightIcon />
                </button>
            </div>
        </section>
    )
}

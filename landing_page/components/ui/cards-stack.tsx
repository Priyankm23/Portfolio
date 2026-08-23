"use client"

import * as React from "react"
import { HTMLMotionProps, motion } from "motion/react"

import { cn } from "@/lib/utils"

interface CardStickyProps extends HTMLMotionProps<"div"> {
  index: number
  incrementY?: number
  incrementZ?: number
  topOffset?: number
}

const ContainerScroll = React.forwardRef<
  HTMLDivElement,
  React.HTMLProps<HTMLDivElement>
>(({ children, className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("relative w-full", className)}
      style={{ perspective: "1000px", ...props.style }}
      {...props}
    >
      {children}
    </div>
  )
})
ContainerScroll.displayName = "ContainerScroll"

const CardSticky = React.forwardRef<HTMLDivElement, CardStickyProps>(
  (
    {
      index,
      incrementY = 10,
      incrementZ = 10,
      topOffset = 0,
      children,
      className,
      style,
      ...props
    },
    forwardedRef
  ) => {
    const y = index * incrementY
    const zIndex = index + 1

    const localRef = React.useRef<HTMLDivElement>(null)
    const [opacity, setOpacity] = React.useState(1)

    // Merge forwarded ref
    React.useEffect(() => {
      if (!forwardedRef) return
      if (typeof forwardedRef === "function") {
        forwardedRef(localRef.current)
      } else {
        (forwardedRef as React.MutableRefObject<HTMLDivElement | null>).current = localRef.current
      }
    }, [forwardedRef])

    React.useEffect(() => {
      const handleScroll = () => {
        const el = localRef.current
        if (!el) return

        const parent = el.parentElement
        if (!parent) return

        const cards = Array.from(parent.children) as HTMLElement[]
        const myCardIndex = cards.indexOf(el)

        if (myCardIndex === -1 || myCardIndex === cards.length - 1) {
          setOpacity(1)
          return
        }

        const nextCard = cards[myCardIndex + 1]
        if (!nextCard) {
          setOpacity(1)
          return
        }

        const myRect = el.getBoundingClientRect()
        const nextRect = nextCard.getBoundingClientRect()

        const overlapStart = myRect.bottom
        const overlapEnd = myRect.top

        if (nextRect.top >= overlapStart) {
          setOpacity(1)
        } else if (nextRect.top <= overlapEnd) {
          setOpacity(0.08)
        } else {
          const totalDistance = overlapStart - overlapEnd
          const currentDistance = nextRect.top - overlapEnd
          const pct = currentDistance / totalDistance
          const minOpacity = 0.08
          const newOpacity = minOpacity + (1 - minOpacity) * pct
          setOpacity(newOpacity)
        }
      }

      window.addEventListener("scroll", handleScroll, { passive: true })
      handleScroll()

      return () => {
        window.removeEventListener("scroll", handleScroll)
      }
    }, [index])

    return (
      <motion.div
        ref={localRef}
        layout="position"
        style={{
          top: `${y + topOffset}px`,
          zIndex,
          transform: "translate3d(0, 0, 0)",
          backfaceVisibility: "hidden",
          opacity,
          ...style,
        }}
        className={cn("sticky", className)}
        {...props}
      >
        {children}
      </motion.div>
    )
  }
)

CardSticky.displayName = "CardSticky"

export { ContainerScroll, CardSticky }

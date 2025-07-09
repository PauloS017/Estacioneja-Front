"use client"

import { useEffect, useState } from "react"
import Image from "next/image"

interface SliderProps {
  images: {
    url: string
    alt: string
  }[]
}

export function HeroSlider({ images }: SliderProps) {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev === images.length - 1 ? 0 : prev + 1))
    }, 5000)
    return () => clearInterval(interval)
  }, [images.length])

  return (
    <div className="relative w-full hero-slider overflow-hidden rounded-xl">
      {images.map((image, index) => (
        <div key={index} className={`slide ${index === currentSlide ? "active" : ""}`}>
          <Image
            src={image.url || "/placeholder.svg"}
            alt={image.alt}
            fill
            priority={index === 0}
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <div className="text-center text-white p-4 max-w-3xl">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Estacionamento Inteligente para sua Universidade</h2>
              <p className="text-lg md:text-xl">
                Gerencie vagas, reserve com antecedência e tenha controle total do seu estacionamento
              </p>
            </div>
          </div>
        </div>
      ))}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full ${index === currentSlide ? "bg-white" : "bg-white/50"}`}
            aria-label={`Ir para slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}

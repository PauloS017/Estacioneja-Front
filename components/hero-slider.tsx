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
    }, 6000)
    return () => clearInterval(interval)
  }, [images.length])

  return (
    <div className="relative w-full h-[70vh] min-h-[600px] overflow-hidden rounded-3xl shadow-2xl">
      {images.map((image, index) => (
        <div 
          key={index} 
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        >
          <Image
            src={image.url || "/placeholder.svg"}
            alt={image.alt}
            fill
            priority={index === 0}
            className="object-cover"
          />
          {/* Overlay em Gradiente Elegante */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-center justify-center md:justify-start md:px-20">
            <div className="text-center md:text-left text-white p-6 max-w-4xl mt-20 transition-all transform duration-700 translate-y-0">
              <h2 className="text-3xl md:text-5xl font-semibold mb-4 tracking-tight leading-tight">
                Estacionamento Inteligente <br className="hidden md:block" /> para sua Instituição
              </h2>
              <p className="text-base md:text-xl text-gray-200 font-normal">
                Gerencie vagas, ofereça reservas antecipadas e tenha controle total em tempo real com nossa plataforma.
              </p>
            </div>
          </div>
        </div>
      ))}
      
      {/* Indicadores do Slider */}
      <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-3 z-20">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`transition-all duration-300 rounded-full ${
              index === currentSlide 
                ? "w-8 h-2.5 bg-white" 
                : "w-2.5 h-2.5 bg-white/50 hover:bg-white/80"
            }`}
            aria-label={`Ir para slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}

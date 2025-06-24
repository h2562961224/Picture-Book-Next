"use client"

import { useEffect, useState, useRef, useCallback } from "react"
import { motion, AnimatePresence, useAnimation, type PanInfo } from "framer-motion"
import NextImage from "next/image"
import { useRouter } from "next/router"
import { Button } from "@/components/ui/button"
import type { PictureBook } from "@/types/book"
import { ChevronLeft, ChevronRight, Play, Pause, Volume2, VolumeX, ArrowLeft, RotateCcw } from "lucide-react"

interface BookReaderProps {
  book: PictureBook
}

export function BookReader({ book }: BookReaderProps) {
  const [currentPage, setCurrentPage] = useState<number>(0)
  const [isPlaying, setIsPlaying] = useState<boolean>(false)
  const [isMuted, setIsMuted] = useState<boolean>(false)
  const controls = useAnimation()
  const audioMapRef = useRef<Record<number, HTMLAudioElement>>({})
  const currentAudioRef = useRef<HTMLAudioElement | null>(null)
  const router = useRouter()

  const handleEnd = useCallback((i: number) => {
    if (i < book.pages.length - 1) {
      setCurrentPage(i + 1)
    } else {
      setIsPlaying(false)
    }
  }, [book.pages.length])

  // 返回上一页面
  const handleGoBack = () => {
    router.back()
  }

  // 重新播放
  const handleReplay = () => {
    setCurrentPage(0)
    setIsPlaying(true)
    // 停止当前音频
    if (currentAudioRef.current) {
      currentAudioRef.current.pause()
      currentAudioRef.current.currentTime = 0
    }
  }



  // 预加载所有音频和图片文件
  useEffect(() => {
    const loadResources = async () => {
      const audioMap: Record<number, HTMLAudioElement> = {};
      const imageMap: Record<number, HTMLImageElement> = {};
      const imageLoadPromises: Promise<void>[] = [];

      for (let i = 0; i < book.pages.length; i++) {
        // 加载音频
        const audioUrl = book.pages[i].audio
        if (audioUrl) {
          const url = audioUrl
          const audio = new Audio(url)
          audioMap[i] = audio
        }

        // 加载图片
        const imageUrl = book.pages[i].image
        if (imageUrl) {
          const img = new Image()
          imageMap[i] = img
          imageLoadPromises.push(
            new Promise<void>((resolve) => {
              img.onload = () => resolve()
              img.src = imageUrl
            })
          )
        }
      }

      audioMapRef.current = audioMap

      // 等待所有图片加载完成
      await Promise.all(imageLoadPromises)
    }

    loadResources()
  }, [book.pages])

  // 处理音频播放
  useEffect(() => {
    if (currentPage < 0 || currentPage >= book.pages.length) {
      return
    }

    const audio = audioMapRef.current[currentPage]
    if (!audio) return

    if (currentAudioRef.current && currentAudioRef.current !== audio) {
      currentAudioRef.current.pause()
      currentAudioRef.current.currentTime = 0
    }

    currentAudioRef.current = audio
    audio.muted = isMuted

    if (isPlaying) {
      audio.play()
    } else {
      audio.pause()
      audio.currentTime = 0
    }
  }, [currentPage, isPlaying, isMuted, book.pages.length])

  useEffect(() => {
    if (isPlaying) {
      // 音频播放完毕后自动切换到下一页
      Object.keys(audioMapRef.current).forEach(i => {
        const index = Number(i)
        const audio = audioMapRef.current[index]
        if (audio) {
          audio.addEventListener('ended', () => handleEnd(index))
        }
      })
    } else {
      Object.keys(audioMapRef.current).forEach(i => {
        const index = Number(i)
        const audio = audioMapRef.current[index]
        if (audio) {
          audio.removeEventListener('ended', () => handleEnd(index))
        }
      })
    }
  }, [handleEnd, isPlaying])

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1)
    }
  }

  const handleNextPage = () => {
    if (currentPage < book.pages.length - 1) {
      setCurrentPage(currentPage + 1)
    }
  }

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset.x > 100 && currentPage > 0) {
      handlePrevPage()
    } else if (info.offset.x < -100 && currentPage < book.pages.length - 1) {
      handleNextPage()
    } else {
      controls.start({ x: 0 })
    }
  }

  return (
    <div className="relative w-full h-screen flex items-center justify-center bg-gray-100">
      {/* 左上角返回按钮 */}
      <Button
        variant="outline"
        size="icon"
        onClick={handleGoBack}
        className="absolute left-4 top-16 bg-white/80 hover:bg-white/90 z-10"
      >
        <ArrowLeft className="h-4 w-4" />
      </Button>

      <motion.div
        className="w-full h-full"
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        onDragEnd={handleDragEnd}
        animate={controls}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0"
          >
            <NextImage
              src={book.pages[currentPage].image || "/placeholder.svg"}
              alt={`Page ${currentPage + 1}`}
              fill
              className="object-contain"
              priority
            />
          </motion.div>
        </AnimatePresence>
      </motion.div>

      <Button
        variant="outline"
        size="icon"
        onClick={handlePrevPage}
        disabled={currentPage === 0}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white/90"
      >
        <ChevronLeft className="h-6 w-6" />
      </Button>

      <Button
        variant="outline"
        size="icon"
        onClick={handleNextPage}
        disabled={currentPage === book.pages.length - 1}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white/90"
      >
        <ChevronRight className="h-6 w-6" />
      </Button>

      <div className="absolute top-16 right-4 flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsPlaying(!isPlaying)}
          className="bg-white/80 hover:bg-white/90"
        >
          {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={handleReplay}
          className="bg-white/80 hover:bg-white/90"
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsMuted(!isMuted)}
          className="bg-white/80 hover:bg-white/90"
        >
          {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
        </Button>
      </div>

      <div className="absolute bottom-4 right-4 bg-white/80 px-2 py-1 rounded">
        <span className="text-sm font-medium">
          {currentPage + 1} / {book.pages.length}
        </span>
      </div>
    </div>
  )
}


"use client"

import { useEffect, useState, useRef, useCallback } from "react"
import { motion, AnimatePresence, useAnimation, type PanInfo } from "framer-motion"
import NextImage from "next/image"
import { useRouter } from "next/router"
import { Button } from "@/components/ui/button"
import type { PictureBook } from "@/types/book"
import { ChevronLeft, ChevronRight, Play, Pause, Volume2, VolumeX, ArrowLeft, RotateCcw, Maximize, Minimize, Ratio } from "lucide-react"
import { addToReadingHistory } from "@/lib/reading-history"

interface BookReaderProps {
  book: PictureBook
}

interface FullscreenDocument extends Document {
  mozFullScreenEnabled?: boolean;
  msFullscreenEnabled?: boolean;
  webkitSupportsFullscreen?: boolean;
  webkitFullscreenEnabled?: boolean;
  msExitFullscreen?: () => void;
  mozCancelFullScreen?: () => void;
  webkitExitFullscreen?: () => void;
  webkitCancelFullScreen?: () => void;
}

interface FullscreenElement extends HTMLDivElement {
    webkitRequestFullScreen?: () => void;
    webkitRequestFullscreen?: () => void;
    msRequestFullscreen?: () => void;
    mozRequestFullScreen?: () => void;
}

export function BookReader({ book }: BookReaderProps) {
  const [currentPage, setCurrentPage] = useState<number>(0)
  const [isPlaying, setIsPlaying] = useState<boolean>(false)
  const [isMuted, setIsMuted] = useState<boolean>(false)
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false)
  const [showControls, setShowControls] = useState<boolean>(true)
  const controls = useAnimation()
  const audioMapRef = useRef<Record<number, HTMLAudioElement>>({})
  const currentAudioRef = useRef<HTMLAudioElement | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const hideControlsTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const router = useRouter()

  // 记录阅读历史
  useEffect(() => {
    addToReadingHistory(book)
  }, [book])

  // 监听全屏状态变化
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange)
    }
  }, [])

  // 全屏模式下控制按钮自动隐藏逻辑
  useEffect(() => {
    if (isFullscreen) {
      // 重置控制按钮显示状态
      setShowControls(true)

      // 设置3秒后自动隐藏
      const resetHideTimer = () => {
        if (hideControlsTimeoutRef.current) {
          clearTimeout(hideControlsTimeoutRef.current)
        }
        hideControlsTimeoutRef.current = setTimeout(() => {
          setShowControls(false)
        }, 3000)
      }

      resetHideTimer()

      // 监听用户交互事件
      const handleUserInteraction = () => {
        setShowControls(true)
        resetHideTimer()
      }

      const events = ['mousedown', 'mousemove', 'touchstart', 'touchmove', 'keydown']
      events.forEach(event => {
        document.addEventListener(event, handleUserInteraction)
      })

      return () => {
        if (hideControlsTimeoutRef.current) {
          clearTimeout(hideControlsTimeoutRef.current)
        }
        events.forEach(event => {
          document.removeEventListener(event, handleUserInteraction)
        })
      }
    } else {
      // 非全屏模式下始终显示控制按钮
      setShowControls(true)
      if (hideControlsTimeoutRef.current) {
        clearTimeout(hideControlsTimeoutRef.current)
      }
    }
  }, [isFullscreen])

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

  // 切换全屏
  const toggleFullscreen = async () => {
    if (!containerRef.current) return

    try {
      if (!isFullscreen) {
        const target = containerRef.current as FullscreenElement
        if (target.requestFullscreen) {
          await target.requestFullscreen()
        } else if (target.webkitRequestFullscreen) {
          await target.webkitRequestFullscreen()
        } else if (target.msRequestFullscreen) {
          await target.msRequestFullscreen()
        }
      } else {
        const target = document as FullscreenDocument;
        if (target.exitFullscreen) {
          target.exitFullscreen();
        } else if (target.mozCancelFullScreen) {
          target.mozCancelFullScreen();
        } else if (target.webkitCancelFullScreen) {
          target.webkitCancelFullScreen();
        } else if (target.msExitFullscreen) {
          target.msExitFullscreen();
        }

        // 退出全屏时解锁屏幕方向
        if ('screen' in window && 'orientation' in window.screen && window.screen.orientation.unlock) {
          window.screen.orientation.unlock()
        }
      }
    } catch (error) {
      console.error('全屏切换失败:', error)
    }
  }

  // 手动旋转屏幕
  const rotateScreen = async () => {
    if (!isFullscreen || !('screen' in window) || !('orientation' in window.screen)) {
      return
    }

    try {
      const currentOrientation = window.screen.orientation.type
      let targetOrientation: 'landscape' | 'portrait'

      if (currentOrientation.includes('portrait')) {
        targetOrientation = 'landscape'
      } else {
        targetOrientation = 'portrait'
      }

      if (window.screen.orientation.lock) {
        await window.screen.orientation.lock(targetOrientation)
      }
    } catch (error) {
      console.error('屏幕旋转失败:', error)
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
    <div
      ref={containerRef}
      className={`relative w-full h-screen flex items-center justify-center bg-gray-100 ${isFullscreen ? 'bg-black' : ''
        }`}
    >
      {/* 左上角返回按钮 */}
      {!isFullscreen && (
        <Button
          variant="outline"
          size="icon"
          onClick={handleGoBack}
          className="absolute left-4 top-16 bg-white/80 z-10"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
      )}

      {/* 左下角手动旋转按钮 - 仅在全屏模式下显示 */}
      {isFullscreen && showControls && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="absolute left-4 bottom-4 z-10"
        >
          <Button
            variant="outline"
            size="icon"
            onClick={rotateScreen}
            className="bg-black/50 text-white border-white/30 hover:bg-black/70"
          >
            <Ratio className="h-4 w-4" />
          </Button>
        </motion.div>
      )}

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

      {/* 左右翻页按钮 */}
      {(!isFullscreen || showControls) && (
        <>
          <motion.div
            initial={isFullscreen ? { opacity: 0 } : { opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute left-4 top-1/2 -translate-y-1/2"
          >
            <Button
              variant="outline"
              size="icon"
              onClick={handlePrevPage}
              disabled={currentPage === 0}
              className={`${isFullscreen ? 'bg-black/50 text-white border-white/30 hover:bg-black/70' : 'bg-white/80'
                }`}
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
          </motion.div>

          <motion.div
            initial={isFullscreen ? { opacity: 0 } : { opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute right-4 top-1/2 -translate-y-1/2"
          >
            <Button
              variant="outline"
              size="icon"
              onClick={handleNextPage}
              disabled={currentPage === book.pages.length - 1}
              className={`${isFullscreen ? 'bg-black/50 text-white border-white/30 hover:bg-black/70' : 'bg-white/80'
                }`}
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
          </motion.div>
        </>
      )}

      {/* 右上角控制按钮组 */}
      {(!isFullscreen || showControls) && (
        <motion.div
          initial={isFullscreen ? { opacity: 0 } : { opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className={`absolute top-16 right-4 flex items-center gap-2 ${isFullscreen ? 'top-4' : ''
            }`}
        >
          <Button
            variant="outline"
            size="icon"
            onClick={() => setIsPlaying(!isPlaying)}
            className={`${isFullscreen ? 'bg-black/50 text-white border-white/30 hover:bg-black/70' : 'bg-white/80'}`}
          >
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={handleReplay}
            className={`${isFullscreen ? 'bg-black/50 text-white border-white/30 hover:bg-black/70' : 'bg-white/80'}`}
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setIsMuted(!isMuted)}
            className={`${isFullscreen ? 'bg-black/50 text-white border-white/30 hover:bg-black/70' : 'bg-white/80'}`}
          >
            {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={toggleFullscreen}
            className={`${isFullscreen ? 'bg-black/50 text-white border-white/30 hover:bg-black/70' : 'bg-white/80'}`}
          >
            {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
          </Button>
        </motion.div>
      )}

      {/* 页码显示 */}
      {(!isFullscreen || showControls) && (
        <motion.div
          initial={isFullscreen ? { opacity: 0 } : { opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className={`absolute bottom-4 right-4 px-2 py-1 rounded ${isFullscreen ? 'bg-black/50 text-white' : 'bg-white/80'
            }`}
        >
          <span className="text-sm font-medium">
            {currentPage + 1} / {book.pages.length}
          </span>
        </motion.div>
      )}
    </div>
  )
}


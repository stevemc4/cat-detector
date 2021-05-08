import '@tensorflow/tfjs-backend-cpu'
import '@tensorflow/tfjs-backend-webgl'

import React, { useEffect, useState, useRef } from 'react'
import styled, { css } from 'styled-components'
import * as cocoSsd from '@tensorflow-models/coco-ssd'

const Container = styled.div`
  max-width: 960px;
  margin: 0px auto;
  box-sizing: border-box;
  min-height: 100vh;
`

const FeedContainer = styled.div`
  width: 100vw;
  height: 100vh;
  max-width: 960px;
  background: #2d2d2d
  position: relative;

  video {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`

const CatStatus = styled.div`
  position: fixed;
  bottom: 0px;
  left: 0px;
  padding: 24px;
  box-sizing: border-box;
  display: flex;
`

const CatLabel = styled.span`
  display: block;
  padding: 16px 24px;
  border-radius: 4px;
  font-weight: bold;
  background: #fff;
  color: #2d2d2d;
  font-size: 18px;
  margin-left: 8px;

  &:first-child {
    margin-left: 0px;
  }
`

interface CatConfirmationProps {
  isOK: boolean
}

const CatConfirmation = styled(CatLabel)<CatConfirmationProps>`
  background-color: #ff5555;
  color: #fff;

  ${(props) => props.isOK && css`
    background-color: #25bb37;
  `}
`

const Index = (): React.ReactElement => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [currentDetected, setCurrentDetected] = useState('none')
  const animationRef = useRef(0)
  let model: cocoSsd.ObjectDetection | null = null

  const initTensorflow = async () => {
    model = await cocoSsd.load()
  }

  const recognizeObject = async () => {
    if (videoRef.current && model) {
      const prediction = await model.detect(videoRef.current)
      if (prediction.length > 0) {
        setCurrentDetected(prediction[0].class)
      }
    }
    animationRef.current = requestAnimationFrame(recognizeObject)
  }

  const handleVideoInit = async () => {
    const video = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: {
          exact: 'environment'
        }
      }
    })

    if (videoRef.current) {
      videoRef.current.srcObject = video
      videoRef.current.addEventListener('loadeddata', event => {
        (event.target as HTMLVideoElement).play()
        animationRef.current = requestAnimationFrame(recognizeObject)
      })
    }
  }

  useEffect(() => {
    handleVideoInit()
    initTensorflow()

    return (): void => {
      cancelAnimationFrame(animationRef.current)
    }
  }, [])

  return (
    <Container>
      <FeedContainer>
        <video ref={videoRef} />
      </FeedContainer>
      <CatStatus>
        <CatLabel>Cat?</CatLabel>
        <CatConfirmation isOK={currentDetected === 'cat' ?? false}>{currentDetected === 'cat' ? 'Yes!' : 'No'}</CatConfirmation>
      </CatStatus>
    </Container>
  )
}

export default Index

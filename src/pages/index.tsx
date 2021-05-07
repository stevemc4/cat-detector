import '@tensorflow/tfjs-backend-cpu'
import '@tensorflow/tfjs-backend-webgl'

import React, { useEffect, useState, createRef } from 'react'
import styled from 'styled-components'
import * as cocoSsd from '@tensorflow-models/coco-ssd'

const Container = styled.div`
  max-width: 960px;
  margin: 0px auto;
  padding: 16px;
  box-sizing: border-box;
  min-height: 100vh;
`

const FeedContainer = styled.div`
  width: 100%;
  height: 0px;
  padding-top: 177%;
  background: #2d2d2d;
  border-radius: 4px;
  position: relative;

  video {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0px;
    left: 0px;
    border-radius: 4px;
    object-fit: cover;
  }
`
let model: cocoSsd.ObjectDetection | null = null

const Index = (): React.ReactElement => {
  const videoRef = createRef<HTMLVideoElement>()
  const [currentDetected, setCurrentDetected] = useState<cocoSsd.DetectedObject>()

  const initTensorflow = async () => {
    model = await cocoSsd.load()
  }

  const recognizeObject = async () => {
    if (videoRef.current && model) {
      const prediction = await model.detect(videoRef.current)
      if (prediction.length > 0) {
        setCurrentDetected(prediction[0])
      }
    }
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
      videoRef.current.addEventListener('loadedmetadata', event => {
        (event.target as HTMLVideoElement).play()
      })
    }
  }

  useEffect(() => {
    handleVideoInit()
    initTensorflow()
  }, [videoRef.current])

  return (
    <Container>
      <FeedContainer>
        <video ref={videoRef} />
      </FeedContainer>
      <h1>Detected: { currentDetected?.class ?? 'None'}</h1>
      <button onClick={recognizeObject}>Check</button>
    </Container>
  )
}

export default Index

import React, { useEffect, createRef } from 'react'
import styled from 'styled-components'

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

const Index = (): React.ReactElement => {
  const videoRef = createRef<HTMLVideoElement>()

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
  }, [videoRef.current])

  return (
    <Container>
      <FeedContainer>
        <video ref={videoRef} />
      </FeedContainer>
      <p>Hello World</p>
    </Container>
  )
}

export default Index

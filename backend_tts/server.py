import asyncio

import websockets

import speechtotext
import settings

max_frames = int(settings.RATE / settings.CHUNK * settings.RECORD_SECONDS)


def response(trasncription, error=None):
    return {'transcription': trasncription, 'error': error}


async def listen(websocket, _):
    frame_data = []

    stt = speechtotext.SpeechToText()

    while True:
        chunk = await websocket.recv()
        frame_data.append(chunk)

        if len(frame_data) == max_frames:
            audio_data = stt.process_audio(frame_data)

            try:
                transcription = stt.recognize(audio_data)
                await websocket.send(transcription)
            except speechtotext.RecognitionException as e:
                print('Error recognizing: {}'.format(e))
                return response(None, error=e)
            frame_data = []


asyncio.get_event_loop().run_until_complete(
    websockets.serve(listen, settings.HOST, settings.PORT))

asyncio.get_event_loop().run_forever()

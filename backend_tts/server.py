import asyncio
import json
import websockets

import speechtotext
import settings

max_frames = int(settings.RATE / settings.CHUNK * settings.RECORD_SECONDS)


def response(trasncription, error=None):
    return json.dumps({'transcription': trasncription, 'error': error})


async def listen(websocket, _):
    await websocket.send('connected')
    frame_data = []
    stt = speechtotext.SpeechToText()
    while True:
        chunk = await websocket.recv()
        if chunk == 'transcribe':
            audio_data = stt.process_audio(frame_data)

            try:
                transcription = stt.recognize(audio_data)
                r = response(transcription)
            except speechtotext.RecognitionException as e:
                print('Error recognizing: {}'.format(str(e)))
                r = response(None, error=str(e))
            frame_data = []
            await websocket.send(r)
        else:
            frame_data.append(chunk)

start_server = websockets.serve(listen, settings.HOST, settings.PORT)
asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()

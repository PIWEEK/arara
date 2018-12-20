import asyncio
import json
import uuid
import wave
import websockets
import pyaudio
import speechtotext
import settings

max_frames = int(settings.RATE / settings.CHUNK * settings.RECORD_SECONDS)


def response(trasncription, error=None):
    return json.dumps({'transcription': trasncription, 'error': error})


async def listen(websocket, _):
    print('Connected..')
    if settings.DEBUG:
        print('Debug activated')
    frame_data = []
    stt = speechtotext.SpeechToText()
    while True:
        chunk = await websocket.recv()
        if chunk == 'transcribe' and frame_data:
            audio_data = stt.process_audio(frame_data)

            if settings.AUDIO_STORAGE and frame_data:
                filename = f'{settings.AUDIO_FOLDER_PATH}/{uuid.uuid4()}.wav'
                with wave.open(filename, 'wb') as f:
                    f.setnchannels(settings.CHANNELS)
                    f.setsampwidth(pyaudio.get_sample_size(settings.FORMAT))
                    f.setframerate(settings.RATE)
                    f.writeframes(audio_data.frame_data)

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

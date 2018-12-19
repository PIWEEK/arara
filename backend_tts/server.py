import asyncio
import io
import websockets
import pyaudio
import wave
import recognizer as recog
import speech_recognition as sr

HOST = 'localhost'
PORT = 8080

CHUNK = 1024
FORMAT = pyaudio.paInt16
CHANNELS = 2
RATE = 44100
RECORD_SECONDS = 2
WAVE_OUTPUT_FILENAME = "output.wav"

# p = pyaudio.PyAudio()

async def listen(websocket, _):
    frame_data = []
    max_frames = int(RATE / CHUNK * RECORD_SECONDS)
    recognizer = recog.Recognizer()

    while True:
        chunk = await websocket.recv()
        frame_data.append(chunk)

        if len(frame_data) == max_frames:
            print('Procesando stream!')
            audio = sr.AudioData(b''.join(frame_data), RATE, 2)
            frame_data = []
            transcription = recognizer.recognizer.recognize_sphinx(audio,
                                                   language='es-ES')
            print(transcription)
            await websocket.send(transcription)

asyncio.get_event_loop().run_until_complete(
    websockets.serve(listen, HOST, PORT))
asyncio.get_event_loop().run_forever()


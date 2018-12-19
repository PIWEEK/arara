import asyncio
import io
import websockets

import recognizer as recog

HOST = 'localhost'
PORT = 8080


async def listen(websocket, _):
    while True:
        chunk = await websocket.recv()
        print(chunk)
        recognizer = recog.Recognizer()
        transcription = recognizer.recognize(chunk)
        print(transcription)


asyncio.get_event_loop().run_until_complete(
    websockets.serve(listen, HOST, PORT))
asyncio.get_event_loop().run_forever()


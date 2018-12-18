import asyncio
import websockets

HOST = 'localhost'
PORT = 8080

async def listen(websocket, _):
    while True:
        chunk = await websocket.recv()
        print(chunk)
        if not chunk:
            break

asyncio.get_event_loop().run_until_complete(
    websockets.serve(listen, HOST, PORT))
asyncio.get_event_loop().run_forever()


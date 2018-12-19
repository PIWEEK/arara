import os
import pyaudio

DEBUG = os.environ.get('DEBUG', 'False').lower() in ['true', 'yes']

HOST = os.environ.get('TTS_HOST', 'localhost')
PORT = os.environ.get('TTS_PORT', 8765)
LANG = os.environ.get('TTS_LANG', 'es-ES')

CHUNK = os.environ.get('AUDIO_CHUNK', 1024)
FORMAT = os.environ.get('AUDIO_FORMAT', 8)
CHANNELS = os.environ.get('AUDIO_CHANNELS', 1)
RATE = os.environ.get('AUDIO_RATE', 44100)
RECORD_SECONDS = os.environ.get('AUDIO_RECORD_SECONDS', 2)

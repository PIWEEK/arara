import os

DEBUG = os.environ.get('DEBUG', 'True').lower() in ['true', 'yes']

HOST = os.environ.get('TTS_HOST', 'localhost')
PORT = os.environ.get('TTS_PORT', 8765)
LANG = os.environ.get('TTS_LANG', 'es-ES')
PROVIDER = os.environ.get('TTS_PROVIDER', 'sphinx')

CHUNK = os.environ.get('AUDIO_CHUNK', 1024)
FORMAT = os.environ.get('AUDIO_FORMAT', 8)
CHANNELS = os.environ.get('AUDIO_CHANNELS', 1)
RATE = os.environ.get('AUDIO_RATE', 44100)
RECORD_SECONDS = os.environ.get('AUDIO_RECORD_SECONDS', 2)
AUDIO_STORAGE = os.environ.get('AUDIO_STORAGE', 'False').lower() in ['true', 'yes']

AUDIO_FOLDER_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'audios')

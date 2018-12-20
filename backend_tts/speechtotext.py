import random
import time

import speech_recognition as sr

import settings


class RecognitionException(Exception):
    pass


def get_recognition_sample():
    options = ['arararara', 'tarara', 'para', 'hada', 'cada', None]
    time.sleep(1)
    return random.choice(options)


class SpeechToText:
    def __init__(self):
        self.recognizer = sr.Recognizer()

    def recognize(self, audio_data):
        if settings.DEBUG:
            return get_recognition_sample()

        if settings.PROVIDER == 'google':
            method = self.recognizer.recognize_google
        else:
            raise LookupError(f'`{settings.PROVIDER}` is not a known provider. '\
                               ' Choose sphinx or google')

        try:
            transcription = method(audio_data, language=settings.LANG)
        except sr.UnknownValueError:
            raise RecognitionException("Could not understand audio")
        except sr.RequestError as e:
            raise RecognitionException("Error; {0}".format(e))

        return transcription

    def process_audio(self, frame_data):
        return sr.AudioData(b''.join(frame_data), settings.RATE, 2)

import settings

import speech_recognition as sr


class RecognitionException(Exception):
    pass


class SpeechToText:
    def __init__(self):
        self.recognizer = sr.Recognizer()

    def recognize(self, audio_data):
        try:
            transcription = self.recognizer.recognize_sphinx(audio_data,
                                                             language='es-ES')
        except sr.UnknownValueError:
            raise RecognitionException("Could not understand audio")
        except sr.RequestError as e:
            raise RecognitionException("Error; {0}".format(e))

        return transcription

    def process_audio(self, frame_data):
        return sr.AudioData(b''.join(frame_data), settings.RATE, 2)

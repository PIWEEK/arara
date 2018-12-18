import speech_recognition as sr


class RecognitionException(Exception):
    pass


class Recognizer:
    def __init__(self):
        self.recognizer = sr.Recognizer()

    def recognize(self, audio):
        self.recognizer.adjust_for_ambient_noise(audio)
        clean_audio = self.recognizer.listen(audio, phrase_time_limit=3)

        try:
            transcription = self.recognizer.recognize_google(clean_audio,
                                                             language='es-ES')
        except sr.UnknownValueError:
            raise RecognitionException("Could not understand audio")
        except sr.RequestError as e:
            raise RecognitionException("Error; {0}".format(e))

        return transcription

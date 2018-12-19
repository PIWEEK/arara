import collections

import pyaudio
import speech_recognition as sr


class RecognitionException(Exception):
    pass


class Recognizer:
    def __init__(self):
        self.recognizer = sr.Recognizer()

    def recognize(self, audio):
        try:

            audio_data = self.process_audio(audio) # 1 second chunk
            print('audio data: ', type(audio_data))

            transcription = self.recognizer.recognize_sphinx(audio_data,
                                                             language='es-ES')
        except sr.UnknownValueError:
            raise RecognitionException("Could not understand audio")
        except sr.RequestError as e:
            raise RecognitionException("Error; {0}".format(e))

        return transcription


    def process_audio(self, audio):
        elapsed_time = 0  # number of seconds of audio read
        buffer = b""  # an empty buffer means that the stream has ended and there is no data left to read
        while True:
            frames = collections.deque()
            buffer = audio.read(4096)
            if len(buffer) == 0: break  # reached end of the stream
            frames.append(buffer)


        frame_data = b"".join(frames)

        return sr.AudioData(frame_data,sample_rate=48000, sample_width=4)

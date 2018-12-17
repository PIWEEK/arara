import argparse
import speech_recognition as sr


class RecognitionException(Exception):
    pass


def recognize_sphinx(recognizer, audio):
    # recognize speech using Sphinx
    try:
        transcription = recognizer.recognize_sphinx(audio, language='es-ES')
    except sr.UnknownValueError:
        raise RecognitionException("Sphinx could not understand audio")
    except sr.RequestError as e:
        raise RecognitionException("Sphinx error; {0}".format(e))

    return transcription


def recognize_speech_from_mic(recognizer, microphone):
    """Transcribe speech from recorded from `microphone`.

    Returns a dictionary with three keys:
    "success": a boolean indicating whether or not the API request was
               successful
    "error":   `None` if no error occured, otherwise a string containing
               an error message if the API could not be reached or
               speech was unrecognizable
    "transcription": `None` if speech could not be transcribed,
               otherwise a string containing the transcribed text
    """
    # check that recognizer and microphone arguments are appropriate type
    if not isinstance(recognizer, sr.Recognizer):
        raise TypeError("`recognizer` must be `Recognizer` instance")

    if not isinstance(microphone, sr.Microphone):
        raise TypeError("`microphone` must be `Microphone` instance")

    # adjust the recognizer sensitivity to ambient noise and record audio
    # from the microphone
    with microphone as source:
        print('Wait a second...')
        recognizer.adjust_for_ambient_noise(source)

        print('Speak!')
        audio = recognizer.listen(source, phrase_time_limit=3)

    # set up the response object
    response = {
        "success": True,
        "errors": [],
        "transcription": None
    }

    try:
        response["transcription"] = recognize_sphinx(recognizer, audio)
    except RecognitionException as e:
        response['errors'].append(e)

    return response


def main():
    recognizer = sr.Recognizer()
    microphone = sr.Microphone(sample_rate=16000)

    print("Tell me something..")

    if arg_options.sphinx:
        guess = recognize_speech_from_mic(recognizer, microphone)
    #
    # if arg_options.google:
    #     guess = recognize_speech_from_mic(recognizer, microphone)

    if guess["errors"]:
        print("ERROR: {}".format(guess["errors"]))

    print("You said according to: {}".format(
        guess["transcription"]))


def get_parser():
    parser = argparse.ArgumentParser(
        description='Command line to test recognize speech')
    parser.add_argument("--sphinx", action='store_true', help="Use pocketsphinx")
    parser.add_argument("--google", action='store_true', help="Use google")

    return parser


if __name__ == "__main__":
    parser = get_parser()
    arg_options = parser.parse_args()

    main()

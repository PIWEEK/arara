import speech_recognition as sr


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
        recognizer.adjust_for_ambient_noise(source)
        audio = recognizer.listen(source)

    # set up the response object
    response = {
        "success": True,
        "errors": [],
        "transcription_google": None,
        "transcription_sphinx": None
    }


    try:
        response["transcription_google"] = recognizer.recognize_google(audio)
        print("Google thinks you said {}".format(response["transcription_google"]))
    except sr.RequestError:
        print("Google RequestError")
        response["success"] = False
        response["errors"].append("API unavailable")
    except sr.UnknownValueError:
        print("Google Unable to recognize speech")
        response["errors"].append("Unable to recognize speech")


    # recognize speech using Sphinx
    try:
        response["transcription_sphinx"] = recognizer.recognize_sphinx(audio)
        print("Sphinx thinks you said " + recognizer.recognize_sphinx(audio))
    except sr.UnknownValueError:
        print("Sphinx could not understand audio")
        response["success"] = False
        response["errors"].append("Sphinx could not understand audio")
    except sr.RequestError as e:
        print("Sphinx error; {0}".format(e))
        response["errors"].append("Sphinx error; {0}".format(e))

    return response


if __name__ == "__main__":
    recognizer = sr.Recognizer()
    microphone = sr.Microphone()

    instructions = "Tell me something.."

    # show instructions and wait 3 seconds before starting the game
    print(instructions)

    while True:
        print('Speak!')
        guess = recognize_speech_from_mic(recognizer, microphone)

        if not guess["success"]:
            break
        print("I didn't catch that. What did you say?\n")

        # if there was an error, stop the game
        if guess["errors"]:
            print("ERROR: {}".format(guess["errors"]))
            break

        # show the user the transcription
        print("You said according Google: {}".format(guess["transcription_google"]))
        print("You said according Sphinx: {}".format(guess["transcription_sphinx"]))

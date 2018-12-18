

Backend “Speech To Text” which process received audio.


## Requirements MAC OS X

```
  $ brew install portaudio
```

## Requirements

```
 $ git clone --recursive https://github.com/bambocher/pocketsphinx-python
```

## Installation


 ```
  $ pipenv sync
  $ pipenv shell
```


## Test commands

Execute the following command with virtualenv activated:

```
  $ python process_audio.py --provider google
  $ python process_audio.py --provider sphinx
```


## Install spanish models to pocketsphinx-python

- Download files from https://sourceforge.net/projects/cmusphinx/files/Acoustic%20and%20Language%20Models/Spanish/
- cd .venv/lib/python3.7/site-packages/speech_recognition/pocketsphinx-data/
- mkdir es-ES && cd es-ES
- cp cmusphinx-es-5.2/model_parameters/voxforge_es_sphinx.cd_ptm_4000 acoustic-model
  - Rename that folder to acoustic-model
- cp es.dict pronounciation-dictionary.dict
- gzip -d es-20k.lm.gz
- cp es-20k.lm language-model.lm.bin

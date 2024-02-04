# # transcribe.py
# import whisper

# model = whisper.load_model("tiny")
# result = model.transcribe("scripts/audio.mp3")
# print(result["text"])

import sys
import whisper

# Check if the correct number of command-line arguments is provided
if len(sys.argv) != 2:
    print("Usage: python transcribe.py <file_path>")
    sys.exit(1)

# Get the file path from the command-line argument
file_path = sys.argv[1]

# Load the model and transcribe the audio file
model = whisper.load_model("tiny.en")
result = model.transcribe(file_path)
print(result["text"])


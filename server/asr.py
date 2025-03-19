import os
from openai import OpenAI

# Initialize OpenAI client
client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))

def transcribe_audio(audio_file_path):
    """
    Transcribe audio using OpenAI's Whisper model
    
    Args:
        audio_file_path (str): Path to the audio file
        
    Returns:
        str: Transcribed text
    """
    try:
        with open(audio_file_path, "rb") as audio_file:
            transcription = client.audio.transcriptions.create(
                model="whisper-1",
                file=audio_file
            )
        
        return transcription.text
    
    except Exception as e:
        print(f"Error transcribing audio: {e}")
        return ""

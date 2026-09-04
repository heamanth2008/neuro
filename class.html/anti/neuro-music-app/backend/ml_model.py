import torch
import torchaudio

def setup_encodec():
    """
    Phase 1: Neural Audio Tokenizer Setup
    Sets up the EnCodec model for audio tokenization.
    """
    try:
        from encodec import EncodecModel
        from encodec.utils import convert_audio
        
        # Instantiate a pretrained EnCodec model
        model = EncodecModel.encodec_model_24khz()
        # The number of codebooks used will be determined by the bandwidth selected.
        # E.g. for a bandwidth of 6 kbps, `n_q = 8` codebooks are used.
        model.set_target_bandwidth(6.0)
        return model, convert_audio
    except ImportError:
        print("Encodec not installed. Run: pip install encodec")
        return None, None

def extract_audio_tokens(wav_path: str):
    """
    Phase 1: Extract Audio Tokens
    """
    model, convert_audio = setup_encodec()
    if not model:
        return None
        
    # Load audio, resample, and encode
    wav, sr = torchaudio.load(wav_path)
    wav = convert_audio(wav, sr, model.sample_rate, model.channels)

    with torch.no_grad():
        encoded_frames = model.encode(wav.unsqueeze(0))
        # Matrix of integer codebook IDs representing audio
        audio_tokens = torch.cat([encoded[0] for encoded in encoded_frames], dim=-1)
        
    return audio_tokens

def generate_audio_from_text(prompt: str, duration_seconds: int = 10, guidance_scale: float = 3.0):
    """
    Phase 2: Generative Model & Conditioning Architecture
    Connect a text model to an Autoregressive Transformer.
    Here we use a HuggingFace pipeline for demonstration (MusicGen).
    """
    try:
        from transformers import AutoProcessor, MusicgenForConditionalGeneration
        import scipy.io.wavfile
        
        processor = AutoProcessor.from_pretrained("facebook/musicgen-small")
        model = MusicgenForConditionalGeneration.from_pretrained("facebook/musicgen-small")
        
        inputs = processor(
            text=[prompt],
            padding=True,
            return_tensors="pt",
        )
        
        # Calculate max_new_tokens based on duration
        # MusicGen generates 50 tokens per second of audio
        max_tokens = int(duration_seconds * 50)
        
        audio_values = model.generate(
            **inputs, 
            do_sample=True, 
            guidance_scale=guidance_scale, 
            max_new_tokens=max_tokens
        )
        
        # Return the waveform, sample rate
        return audio_values[0, 0].numpy(), model.config.audio_encoder.sampling_rate
        
    except ImportError:
        print("Transformers not installed. Run: pip install transformers scipy")
        return None, None

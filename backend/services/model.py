import asyncio
from typing import List
from transformers import AutoModelForCausalLM, AutoTokenizer
import torch

# Global variables to store the loaded model and tokenizer
_model = None
_tokenizer = None

def load_model():
    global _model, _tokenizer
    if _model is None:
        print("Loading model Xen0pp/SmolLM-ML-Planner-500-V3...")
        _tokenizer = AutoTokenizer.from_pretrained("HuggingFaceTB/SmolLM-135M-Instruct")
        _model = AutoModelForCausalLM.from_pretrained(
            "Xen0pp/SmolLM-ML-Planner-500-V3",
            torch_dtype=torch.bfloat16,
            device_map="auto"
        )
        print("Model loaded successfully.")

class ModelService:
    @staticmethod
    async def generate_response(history: List[dict]) -> str:
        # Load model lazily on the first request to avoid blocking startup
        if _model is None:
            await asyncio.to_thread(load_model)
            
        # Format messages according to chat template
        messages = [{"role": "system", "content": "You are an expert ML project planning advisor. You must thoroughly format your responses using Markdown. Use bold text, headings (##), bullet points, and code blocks to make your advice beautiful, structured, and extremely easy to read."}]
        for msg in history:
            messages.append({"role": msg["role"], "content": msg["content"]})
        
        # Run inference in a separate thread to prevent blocking the async event loop
        def _generate():
            inputs = _tokenizer.apply_chat_template(
                messages, 
                return_tensors="pt", 
                add_generation_prompt=True
            ).to(_model.device)
            
            try:
                outputs = _model.generate(
                    inputs, 
                    max_new_tokens=800, 
                    temperature=0.7, 
                    top_p=0.9,
                    do_sample=True,
                    pad_token_id=_tokenizer.eos_token_id
                )
            except Exception as e:
                import traceback
                traceback.print_exc()
                raise e
            
            # Extract only the newly generated tokens
            input_length = inputs.shape[1]
            generated_tokens = outputs[0][input_length:]
            response = _tokenizer.decode(generated_tokens, skip_special_tokens=True)
            return response
            
        return await asyncio.to_thread(_generate)

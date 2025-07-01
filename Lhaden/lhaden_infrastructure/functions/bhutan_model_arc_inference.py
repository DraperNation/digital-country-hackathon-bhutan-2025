import os
import torch
from transformers import (
    AutoModelForCausalLM,
    AutoTokenizer,
    BitsAndBytesConfig,
)
from peft import PeftModel

# ────────────────────────────── 0. PATHS ──────────────────────────────
# (edit these!)
BASE_MODEL = "microsoft/Phi-4-mini-instruct"  # same as training
LORA_ADAPTER = f"Lhaden511/phi4-lora-unstructured-agriculture-health"
MERGED_MODEL = f"{LORA_ADAPTER}-merged"  # if you pushed it

# Select load mode: "adapter" or "merged"
LOAD_MODE = os.getenv("LOAD_MODE", "adapter").lower()

# ────────────────────────────── 1. TOKENIZER ─────────────────────────
print("🔤 Loading tokenizer …")
tokenizer = AutoTokenizer.from_pretrained(BASE_MODEL)
EOS = tokenizer.eos_token or tokenizer.pad_token or "</s>"

# ────────────────────────────── 2. MODEL ─────────────────────────────
print(f"🧠 Loading model in {LOAD_MODE.upper()} mode …")

bnb_cfg = BitsAndBytesConfig(
    load_in_8bit=True,  # set False for full fp16
    llm_int8_has_fp16_weight=False  # lower VRAM
)

if LOAD_MODE == "merged":
    model = AutoModelForCausalLM.from_pretrained(
        MERGED_MODEL,
        torch_dtype=torch.float16,
        device_map="auto",
        trust_remote_code=True,
        quantization_config=bnb_cfg,
    )
else:  # base + adapter (default)
    base = AutoModelForCausalLM.from_pretrained(
        BASE_MODEL,
        torch_dtype=torch.float16,
        device_map="auto",
        trust_remote_code=True,
        quantization_config=bnb_cfg,
    )
    model = PeftModel.from_pretrained(base, LORA_ADAPTER)

model.eval()
print("✅ Model ready!")

# ────────────────────────────── 3. PROMPT HELPER ─────────────────────
SYSTEM_PROMPT = """
Note to the model:
Text enclosed in ((double‑parentheses)) is internal chain‑of‑thought.
Never reveal or quote anything inside (( ... )) to the user.
Return only the final answer or a concise refusal that cites the relevant policy clause.

[… full system prompt from training, truncated for brevity …]
"""


def wrap_with_system_prompt(user_text: str) -> str:
    """Match the chat format used during fine‑tuning."""
    return (
            "<|system|>\n" + SYSTEM_PROMPT.strip() + "\n"
                                                     "<|user|>\n" + user_text.strip() + "\n"
                                                                                        "<|assistant|>\n"
    )


# ────────────────────────────── 4. GENERATE ──────────────────────────
@torch.inference_mode()
def generate(
        user_text: str,
        max_new_tokens: int = 512,
        temperature: float = 0.7,
        top_p: float = 0.9,
        **gen_kwargs,
) -> str:
    """Run inference and return the assistant’s reply (string)."""
    prompt = wrap_with_system_prompt(user_text) + EOS
    inputs = tokenizer(prompt, return_tensors="pt").to(model.device)

    outputs = model.generate(
        **inputs,
        max_new_tokens=max_new_tokens,
        do_sample=True,
        temperature=temperature,
        top_p=top_p,
        pad_token_id=tokenizer.eos_token_id,
        **gen_kwargs,
    )

    full_text = tokenizer.decode(outputs[0], skip_special_tokens=True)
    # Keep everything after the last <|assistant|> tag
    return full_text.split("<|assistant|>")[-1].strip()


def bhutan_model_arc_inference():
    print("\n🎙️  Talk to DrukGPT! (Ctrl‑C to exit)\n")
    try:
        while True:
            usr = input("YOU  : ")
            if not usr.strip():
                continue
            rsp = generate(usr)
            print("BOT 🏔️:", rsp, "\n")
            return rsp
    except KeyboardInterrupt:
        print("\n👋 Bye! Happy hacking, Doctor!")

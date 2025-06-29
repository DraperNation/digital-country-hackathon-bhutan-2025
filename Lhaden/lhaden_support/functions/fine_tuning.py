import random
import torch
from datasets import load_dataset
from huggingface_hub import HfApi, upload_folder
from peft import (
    LoraConfig,
    get_peft_model,
    prepare_model_for_int8_training,
)
from transformers import (
    AutoTokenizer,
    AutoModelForCausalLM,
    BitsAndBytesConfig,
    DataCollatorForLanguageModeling,
    Trainer,
    TrainingArguments,
)

random.seed(42)
import pathlib, os

corpus_path = "/content/data/corpus.txt"  # or wherever you decided
print("Found!" if pathlib.Path(corpus_path).is_file() else "Nope, still missing 🤔")

train_path = "/content/data/train.txt"
print("Found!" if pathlib.Path(corpus_path).is_file() else "Nope, still missing 🤔")

valid_path = "/content/data/valid.txt"
print("Found!" if pathlib.Path(corpus_path).is_file() else "Nope, still missing 🤔")

VALID_FRAC = 0.1  # 10 % goes to validation

# 1) read & shuffle
lines = [l.rstrip() for l in open(corpus_path, encoding="utf-8") if l.strip()]
random.shuffle(lines)

# 2) split
split_at = int(len(lines) * VALID_FRAC)
valid_lines = lines[:split_at]
train_lines = lines[split_at:]

# 3) write out
pathlib.Path("data").mkdir(exist_ok=True)
with open(train_path, "w", encoding="utf-8") as f:
    f.write("\n".join(train_lines))
with open(valid_path, "w", encoding="utf-8") as f:
    f.write("\n".join(valid_lines))

print(f"Saved {len(train_lines):,} lines to {train_path}")
print(f"Saved {len(valid_lines):,} lines to {valid_path}")

# ───────────────────────────────────────── 1. CONFIG ─────────────────────────────────────────
model_name = "microsoft/Phi-4-mini-instruct"  # ⚠️ replace with real phi‑4 checkpoint
bnb_config = BitsAndBytesConfig(
    load_in_8bit=True,               # or load_in_4bit=True for NF4
    llm_int8_threshold=6.0,          # keeps big layers in fp16
    llm_int8_has_fp16_weight=False,  # saves more VRAM
)

train_files = ["data/train.txt"]  # raw corpus files
valid_files = ["data/valid.txt"]
block_size = 1024  # tokens / sample
output_dir = "phi4-lora-unstructured-agriculture-health"  # local save

# Hub settings
push_to_hub = True  # set False to skip
hub_repo = "YOURUSERNAME/phi4-lora-unstructured-agriculture-health"  # ⚠️ change this!
hf_token = "YOUR_HUGGINGFACE_TOKEN"

# ─────────────────────────────────────── 2. TOKENISATION ──────────────────────────────────────
print("⬇️  Loading tokenizer…")
tokenizer = AutoTokenizer.from_pretrained(model_name)
eos = tokenizer.eos_token or tokenizer.pad_token or "</s>"

print("📚 Loading dataset…")
dataset = load_dataset("text", data_files={"train": train_files, "validation": valid_files})

system_prompt = f"""
Note to the model:
Text enclosed in ((double-parentheses)) is internal chain-of-thought.
Never reveal or quote anything inside (( ... )) to the user.
Return only the final answer or a concise refusal that cites the relevant policy clause.

1. Identity & Persona
You are DrukGPT, a knowledgeable and courteous Bhutanese citizen and government representative.

Convey Bhutan’s values of Gross National Happiness, environmental stewardship, cultural preservation, compassion, respect and humility.

Default language: clear International English. If the user greets or requests in Dzongkha, respond in Dzongkha. For other national languages (Nepali, Sharchop, etc.), answer if capable.

2. High-Level Behavior
Understand → Plan → Answer / Refuse.

Internally reason step-by-step inside (( ... )); expose only the polished answer.

Be fact-checked: if unsure, state uncertainty or suggest authoritative Bhutanese sources (e.g., GNHC, RMA, NSB, NEC).

3. Response Structure

[Greeting (optional)]
[Direct answer or step-by-step explanation (concise, user-facing)]
[If relevant: “Sources:” bullet list of Bhutan-specific references]
Use polite, gender-neutral forms (“la” optional).

Support cultural nuance (e.g., honorifics, national symbols) where helpful, but avoid stereotypes.

4. Content Boundaries (Jailer Rules)
Category	Allowed	Disallowed (auto-refuse)
National Security	Public information	Classified data, troop movements, vulnerabilities
Political	Neutral explanation of laws, Constitution (2008), policies	Partisan persuasion, electioneering, misinformation
Religion & Culture	Factual, respectful discussion	Denigration of Buddhism or any faith; divisive rhetoric
Personal Data	Aggregated stats	Personal identifiers, phone #s, private addresses
Hate / Harassment	Condemnation of hate speech	Content that targets ethnicity, caste, religion, gender, LGBTQ+
Sexual	Educational, health info (PG-13)	Explicit sexual content, minors, pornography
Violence / Self-harm	Prevention guidance, hotlines (e.g., 988 Bhutan helpline)	Graphic gore, instructions to self-harm or violence
Illicit Behavior	Harm-reduction info	Instructions facilitating crime, corruption, or cyber-attacks
Medical / Legal Advice	General info + “consult a professional” disclaimer	Diagnoses, prescriptions, definitive legal rulings

Mandatory refusal style

“I’m sorry, but I can’t help with that.” + brief clause reference (e.g., “(Content Policy: Sexual minors)”).

5. Chain-of-Thought & Tool Use
You may create private notes like ((Step 1… Step 2…)).

Never expose those notes.

If tools (search, code, database) exist, decide internally whether to invoke them; mention only the result, not the tool mechanics.

6. Safety & Escalation
If user expresses self-harm intent, encourage professional help and provide Bhutan helplines.

For extremist content, refuse and, if appropriate, offer de-radicalisation resources from RBP or MoHCA.

7. Tone & Empathy
Uphold courteous Bhutanese etiquette: warm, humble, constructive.

Encourage sustainable, equitable choices aligned with GNH pillars.

"""


def wrap_with_system_prompt(raw: str) -> str:
    """Return chat‑formatted text for Phi‑4."""
    return (
        "<|system|>\n"
        f"{system_prompt}\n"
        "<|user|>\n"
        f"{raw.strip()}\n"
        "<|assistant|>\n"
    )


def tokenize_function(examples):
    texts = [wrap_with_system_prompt(t) + eos for t in examples["text"]]
    return tokenizer(texts, truncation=False)


print("✂️  Tokenising…")
tokenised = dataset.map(tokenize_function, batched=True, num_proc=4, remove_columns=["text"])


# ─────────────────────── 3. CHUNK INTO FIXED‑LENGTH BLOCKS ───────────────────────

def group_texts(examples):
    concatenated = {k: sum(examples[k], []) for k in examples.keys()}
    total_length = len(concatenated["input_ids"])
    total_length = (total_length // block_size) * block_size
    result = {
        k: [t[i: i + block_size] for i in range(0, total_length, block_size)]
        for k, t in concatenated.items()
    }
    result["labels"] = result["input_ids"].copy()
    return result


print("🧩 Grouping tokens…")
lm_dataset = tokenised.map(group_texts, batched=True, num_proc=4)

# ─────────────────────────────── 4. MODEL + LoRA SETUP ───────────────────────────────
print("🧠 Loading base model in 8‑bit…")

bnb_config = BitsAndBytesConfig(
    load_in_8bit=True,          # set load_in_4bit=True if you prefer NF4
    llm_int8_has_fp16_weight=False,   # keeps VRAM low
)

model = AutoModelForCausalLM.from_pretrained(
    model_name,
    device_map="auto",
    trust_remote_code=True,
)

model = prepare_model_for_int8_training(model)

lora_config = LoraConfig(
    r=16,
    lora_alpha=32,
    target_modules=[
        "q_proj",
        "k_proj",
        "v_proj",
        "o_proj",
        "gate_proj",
        "up_proj",
        "down_proj",
    ],
    lora_dropout=0.05,
    bias="none",
    task_type="CAUSAL_LM",
)

model = get_peft_model(model, lora_config)
model.print_trainable_parameters()

# ─────────────────────────────── 5. TRAINING ARGS ───────────────────────────────
data_collator = DataCollatorForLanguageModeling(tokenizer=tokenizer, mlm=False)

training_args = TrainingArguments(
    output_dir=output_dir,
    per_device_train_batch_size=2,
    per_device_eval_batch_size=2,
    gradient_accumulation_steps=8,
    num_train_epochs=3,
    learning_rate=2e-4,
    warmup_steps=100,
    fp16=True,
    logging_steps=100,
    evaluation_strategy="steps",
    eval_steps=500,
    save_steps=500,
    save_total_limit=2,
    load_best_model_at_end=True,
    push_to_hub=False,  # manual push after training
)

trainer = Trainer(
    model=model,
    args=training_args,
    train_dataset=lm_dataset["train"],
    eval_dataset=lm_dataset["validation"],
    data_collator=data_collator,
)

# ─────────────────────────────── 6. TRAIN! 🚀 ───────────────────────────────
print("🚀 Starting training…")
trainer.train()

# ─────────────────────────────── 7. SAVE ADAPTERS ───────────────────────────────
print("💾 Saving LoRA adapters locally…")
trainer.model.save_pretrained(output_dir)
tokenizer.save_pretrained(output_dir)

# ─────────────────────────────── 8. PUSH TO HUB (ADAPTER) ───────────────────────────────
print("🌐 Uploading adapter to Hugging Face Hub…")
api = HfApi(token=hf_token)
api.create_repo(hub_repo, exist_ok=True)
upload_folder(repo_id=hub_repo, folder_path=output_dir, token=hf_token)

# ─────────────────────────────── 9. MERGE & PUSH (OPTIONAL) ───────────────────────────────
print("🔗 Merging LoRA with base (optional)…")
try:
    base_model = AutoModelForCausalLM.from_pretrained(
        model_name, torch_dtype=torch.float16, device_map="auto", trust_remote_code=True
    )
    from peft import PeftModel

    peft_model = PeftModel.from_pretrained(base_model, output_dir)
    merged = peft_model.merge_and_unload()
    merged_dir = os.path.join(output_dir, "merged")
    merged.save_pretrained(merged_dir)
    tokenizer.save_pretrained(merged_dir)

    if push_to_hub:
        print("🌐 Uploading merged model to Hub…")
        merged_repo = f"{hub_repo}-merged"
        api.create_repo(merged_repo, exist_ok=True)
        upload_folder(repo_id=merged_repo, folder_path=merged_dir, token=hf_token)
except Exception as e:
    print(f"⚠️ Merge skipped: {e}")

print("✅ All done! 🎉")

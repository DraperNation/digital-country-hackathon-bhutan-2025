from transformers import pipeline as hf_pipeline

# Load sentiment pipeline
sentiment_pipeline = hf_pipeline("sentiment-analysis")

def analyze_sentiment(text):
    result = sentiment_pipeline(text)[0]
    label = result["label"]
    score = result["score"]

    # Map to happiness scale (1-10)
    if label == "POSITIVE":
        happiness_score = min(int(score * 10), 10)
    else:
        happiness_score = max(10 - int(score * 10), 1)

    return happiness_score

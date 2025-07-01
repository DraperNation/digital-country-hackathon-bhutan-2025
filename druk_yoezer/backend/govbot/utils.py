"""
Utility functions for GovBot Bhutan
"""

import logging
import uuid
import re
from typing import List, Dict, Any
from datetime import datetime

def setup_logging():
    """Setup logging configuration"""
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
        handlers=[
            logging.FileHandler('govbot.log'),
            logging.StreamHandler()
        ]
    )

def get_session_id() -> str:
    """Generate a unique session ID"""
    return str(uuid.uuid4())

def calculate_confidence(factors: List[float]) -> float:
    """Calculate overall confidence from multiple factors"""
    if not factors:
        return 0.5
    return sum(factors) / len(factors)

def extract_keywords(text: str) -> List[str]:
    """Extract keywords from text"""
    # Remove common stop words
    stop_words = {
        'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
        'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'have',
        'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should',
        'may', 'might', 'can', 'i', 'you', 'he', 'she', 'it', 'we', 'they',
        'this', 'that', 'these', 'those', 'what', 'where', 'when', 'why', 'how'
    }
    
    # Extract words and filter
    words = re.findall(r'\b[a-zA-Z]+\b', text.lower())
    keywords = [word for word in words if word not in stop_words and len(word) > 2]
    
    return list(set(keywords))  # Remove duplicates

def format_currency(amount: float, currency: str = "BTN") -> str:
    """Format currency amounts"""
    if currency == "BTN":
        return f"BTN {amount:,.0f}"
    elif currency == "USD":
        return f"USD {amount:,.2f}"
    else:
        return f"{currency} {amount:,.2f}"

def validate_email(email: str) -> bool:
    """Validate email format"""
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None

def sanitize_input(text: str) -> str:
    """Sanitize user input"""
    # Remove potentially harmful characters
    sanitized = re.sub(r'[<>"\']', '', text)
    return sanitized.strip()

def parse_date(date_string: str) -> datetime:
    """Parse date string to datetime object"""
    formats = [
        '%Y-%m-%d',
        '%d/%m/%Y',
        '%m/%d/%Y',
        '%Y-%m-%d %H:%M:%S'
    ]
    
    for fmt in formats:
        try:
            return datetime.strptime(date_string, fmt)
        except ValueError:
            continue
    
    raise ValueError(f"Unable to parse date: {date_string}")

def truncate_text(text: str, max_length: int = 100) -> str:
    """Truncate text to specified length"""
    if len(text) <= max_length:
        return text
    return text[:max_length-3] + "..."

def is_business_hours() -> bool:
    """Check if current time is within business hours (9 AM - 5 PM, Mon-Fri)"""
    now = datetime.now()
    return (now.weekday() < 5 and  # Monday = 0, Friday = 4
            9 <= now.hour < 17)

def calculate_processing_time(start_time: datetime) -> float:
    """Calculate processing time in seconds"""
    return (datetime.utcnow() - start_time).total_seconds()

def generate_reference_number() -> str:
    """Generate a reference number for tracking"""
    timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
    random_suffix = str(uuid.uuid4())[:8].upper()
    return f"GB-{timestamp}-{random_suffix}"

def mask_sensitive_data(text: str) -> str:
    """Mask sensitive data in text"""
    # Mask email addresses
    text = re.sub(r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b', 
                  '***@***.***', text)
    
    # Mask phone numbers
    text = re.sub(r'\b\d{3}-\d{3}-\d{4}\b', '***-***-****', text)
    text = re.sub(r'\b\+\d{1,3}\s?\d{1,14}\b', '+***-***-****', text)
    
    return text

def convert_currency(amount: float, from_currency: str, to_currency: str) -> float:
    """Convert currency amounts (simplified rates)"""
    # Simplified exchange rates (in production, use real-time rates)
    rates = {
        "USD_to_BTN": 83.0,
        "EUR_to_BTN": 90.0,
        "INR_to_BTN": 1.0,
        "BTN_to_USD": 1/83.0,
        "BTN_to_EUR": 1/90.0,
        "BTN_to_INR": 1.0
    }
    
    rate_key = f"{from_currency}_to_{to_currency}"
    if rate_key in rates:
        return amount * rates[rate_key]
    
    # If direct conversion not available, convert through BTN
    if from_currency != "BTN" and to_currency != "BTN":
        btn_amount = convert_currency(amount, from_currency, "BTN")
        return convert_currency(btn_amount, "BTN", to_currency)
    
    return amount  # Fallback: no conversion

def validate_phone_number(phone: str) -> bool:
    """Validate Bhutanese phone number format"""
    # Bhutanese mobile numbers: +975-17/77-XXXXXX or +975-2-XXXXXX (landline)
    patterns = [
        r'^\+975-[17]-\d{6}$',  # Mobile
        r'^\+975-77-\d{6}$',    # Mobile (B-Mobile)
        r'^\+975-2-\d{6}$',     # Landline (Thimphu)
        r'^\+975-[3-8]-\d{6}$'  # Other dzongkhags
    ]
    
    return any(re.match(pattern, phone) for pattern in patterns)

def get_dzongkhag_code(dzongkhag_name: str) -> str:
    """Get dzongkhag code from name"""
    dzongkhag_codes = {
        "thimphu": "11",
        "paro": "12", 
        "punakha": "13",
        "wangdue": "14",
        "bumthang": "15",
        "trongsa": "16",
        "mongar": "17",
        "lhuentse": "18",
        "trashigang": "19",
        "samdrup_jongkhar": "20",
        "pemagatshel": "21",
        "zhemgang": "22",
        "sarpang": "23",
        "chhukha": "24",
        "samtse": "25",
        "haa": "26",
        "dagana": "27",
        "gasa": "28",
        "trashiyangtse": "29",
        "tsirang": "30"
    }
    
    return dzongkhag_codes.get(dzongkhag_name.lower(), "00")

def format_bhutanese_address(address_components: Dict[str, str]) -> str:
    """Format address in Bhutanese style"""
    components = []
    
    # Add components in order: House/Building, Gewog, Dzongkhag
    if address_components.get("house"):
        components.append(address_components["house"])
    
    if address_components.get("gewog"):
        components.append(f"{address_components['gewog']} Gewog")
    
    if address_components.get("dzongkhag"):
        components.append(f"{address_components['dzongkhag']} Dzongkhag")
    
    if address_components.get("country"):
        components.append(address_components["country"])
    else:
        components.append("Kingdom of Bhutan")
    
    return ", ".join(components)

def calculate_gnh_score(business_metrics: Dict[str, float]) -> float:
    """Calculate GNH alignment score for a business"""
    # GNH scoring based on four pillars (0-1 scale each)
    pillars = {
        "sustainable_development": business_metrics.get("sustainability_score", 0.5),
        "environmental_conservation": business_metrics.get("environmental_score", 0.5),
        "cultural_preservation": business_metrics.get("cultural_score", 0.5),
        "good_governance": business_metrics.get("governance_score", 0.5)
    }
    
    # Weighted average (equal weights for simplicity)
    weights = {"sustainable_development": 0.25, "environmental_conservation": 0.25,
               "cultural_preservation": 0.25, "good_governance": 0.25}
    
    gnh_score = sum(pillars[pillar] * weights[pillar] for pillar in pillars)
    return min(max(gnh_score, 0.0), 1.0)  # Ensure 0-1 range

def estimate_processing_days(process_type: str, complexity: str = "normal") -> int:
    """Estimate processing days for different government processes"""
    base_days = {
        "passport_renewal": 7,
        "passport_new": 21,
        "business_registration": 14,
        "eresidency": 21,
        "tourism_license": 30,
        "tax_registration": 3,
        "work_permit": 14,
        "visa_application": 10
    }
    
    complexity_multipliers = {
        "simple": 0.7,
        "normal": 1.0,
        "complex": 1.5,
        "very_complex": 2.0
    }
    
    base = base_days.get(process_type, 14)  # Default 14 days
    multiplier = complexity_multipliers.get(complexity, 1.0)
    
    return int(base * multiplier)

def generate_qr_code_data(reference_number: str, service_type: str) -> str:
    """Generate QR code data for tracking"""
    return f"GOVBOT-BT|{reference_number}|{service_type}|{datetime.now().isoformat()}"

def validate_citizenship_id(cid: str) -> bool:
    """Validate Bhutanese Citizenship ID format"""
    # Bhutanese CID format: YYYYMMDD-XXXXX-X (birth date + sequence + check digit)
    pattern = r'^\d{8}-\d{5}-\d{1}$'
    
    if not re.match(pattern, cid):
        return False
    
    # Additional validation: check if birth date is valid
    try:
        birth_date = cid[:8]
        datetime.strptime(birth_date, '%Y%m%d')
        return True
    except ValueError:
        return False

def get_business_category(business_type: str) -> str:
    """Categorize business type for regulatory purposes"""
    categories = {
        "manufacturing": ["factory", "production", "manufacturing", "industrial"],
        "services": ["consulting", "service", "professional", "advisory"],
        "technology": ["software", "tech", "digital", "it", "computer"],
        "tourism": ["hotel", "tourism", "travel", "hospitality", "accommodation"],
        "agriculture": ["farming", "agriculture", "organic", "crop"],
        "retail": ["shop", "store", "retail", "sales"],
        "education": ["school", "education", "training", "learning"],
        "healthcare": ["clinic", "medical", "health", "hospital"]
    }
    
    business_lower = business_type.lower()
    
    for category, keywords in categories.items():
        if any(keyword in business_lower for keyword in keywords):
            return category
    
    return "general"

def format_legal_reference(act_name: str, section: str = None, year: str = None) -> str:
    """Format legal reference in standard format"""
    reference = act_name
    
    if section:
        reference += f", Section {section}"
    
    if year:
        reference += f" ({year})"
    
    return reference

def calculate_tax_year(date: datetime = None) -> str:
    """Calculate Bhutanese tax year (July 1 - June 30)"""
    if date is None:
        date = datetime.now()
    
    if date.month >= 7:  # July onwards
        start_year = date.year
        end_year = date.year + 1
    else:  # January to June
        start_year = date.year - 1
        end_year = date.year
    
    return f"{start_year}-{end_year}"

def is_public_holiday(date: datetime) -> bool:
    """Check if date is a Bhutanese public holiday (simplified)"""
    # This is a simplified version - in production, use a proper holiday calendar
    public_holidays_2024 = [
        "2024-01-01",  # New Year
        "2024-02-21",  # King's Birthday
        "2024-05-02",  # Third King's Birthday
        "2024-07-21",  # First Sermon of Buddha
        "2024-12-17",  # National Day
    ]
    
    date_str = date.strftime("%Y-%m-%d")
    return date_str in public_holidays_2024

def get_next_working_day(date: datetime) -> datetime:
    """Get next working day (excluding weekends and holidays)"""
    next_day = date
    
    while True:
        next_day = next_day.replace(day=next_day.day + 1)
        
        # Check if it's a weekend (Saturday = 5, Sunday = 6)
        if next_day.weekday() >= 5:
            continue
        
        # Check if it's a public holiday
        if is_public_holiday(next_day):
            continue
        
        return next_day

def anonymize_user_data(data: Dict[str, Any]) -> Dict[str, Any]:
    """Anonymize user data for logging/analytics"""
    anonymized = data.copy()
    
    # Remove or mask sensitive fields
    sensitive_fields = ["email", "phone", "citizenship_id", "passport_number"]
    
    for field in sensitive_fields:
        if field in anonymized:
            if field == "email":
                anonymized[field] = "***@***.***"
            elif field == "phone":
                anonymized[field] = "+975-**-******"
            else:
                anonymized[field] = "***MASKED***"
    
    return anonymized

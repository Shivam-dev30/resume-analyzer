# resume_analyzer.py
import os
import io
import json
import re
from typing import List, Dict, Any, Tuple
from PyPDF2 import PdfReader
import docx
from rapidfuzz import fuzz, process
from groq import Groq
from dotenv import load_dotenv
load_dotenv()

GROQ_API_KEY = os.environ.get("GROQ_API_KEY")
if not GROQ_API_KEY:
    raise EnvironmentError("Set GROQ_API_KEY in your environment.")
client = Groq(api_key=GROQ_API_KEY)

# ---------- Automatic Model Selection ----------
def get_best_model() -> str:
    """
    Dynamically fetches available models from Groq and selects the best one 
    based on custom priority (preferring 70B+ versatile models).
    """
    try:
        models = client.models.list()
        # Custom priority list (Production-grade models)
        priority = [
            "llama-3.3-70b-versatile",
            "llama-3.1-70b-versatile",
            "llama3-70b-8192",
            "llama-3.1-8b-instant",
            "llama-guard-3-8b"
        ]
        available_ids = [m.id for m in models.data]
        
        # Check priority list
        for model_id in priority:
            if model_id in available_ids:
                return model_id
        
        # If no priority model found, pick the first available one that isn't a whisper model
        for m in available_ids:
            if "whisper" not in m:
                return m
                
        return "llama-3.3-70b-versatile" # Absolute fallback
    except Exception as e:
        print(f"Warning: Model detection failed ({e}). Using fallback.")
        return "llama-3.3-70b-versatile"

# Cache the selected model to avoid redundant API calls
ACTIVE_MODEL = get_best_model()
print(f"Active AI Engine: {ACTIVE_MODEL}")



# ---------- Text extraction ----------
def extract_text_from_pdf(file_bytes: bytes) -> str:
    reader = PdfReader(io.BytesIO(file_bytes))
    text_parts = []
    for page in reader.pages:
        page_text = page.extract_text()
        if page_text:
            text_parts.append(page_text)
    return "\n".join(text_parts)

def extract_text_from_docx(file_bytes: bytes) -> str:
    # write bytes to memory and read with python-docx
    tmp = io.BytesIO(file_bytes)
    doc = docx.Document(tmp)
    paragraphs = [p.text for p in doc.paragraphs if p.text and p.text.strip() != ""]
    return "\n".join(paragraphs)

def extract_text_from_file(filename: str, file_bytes: bytes) -> Tuple[str, str]:
    """
    Returns (text, filetype)
    filetype in {"pdf", "docx", "txt", "unknown"}
    """
    fname = filename.lower()
    if fname.endswith(".pdf"):
        return extract_text_from_pdf(file_bytes), "pdf"
    if fname.endswith(".docx"):
        return extract_text_from_docx(file_bytes), "docx"
    if fname.endswith(".txt"):
        return file_bytes.decode("utf-8", errors="ignore"), "txt"
    # fallback: try pdf then docx
    try:
        return extract_text_from_pdf(file_bytes), "pdf"
    except Exception:
        try:
            return extract_text_from_docx(file_bytes), "docx"
        except Exception:
            return file_bytes.decode("utf-8", errors="ignore"), "txt"

# ---------- OpenAI/Groq helpers ----------
def groq_chat(messages: List[Dict[str, str]], model: str = None, temperature: float = 0.2):
    target_model = model if model else ACTIVE_MODEL
    response = client.chat.completions.create(
        model=target_model,
        messages=messages,
        temperature=temperature,
        max_tokens=2048
    )
    return response.choices[0].message.content.strip()


# ---------- Role keyword generation ----------
def generate_role_keywords(role: str, top_k: int = 25) -> List[str]:
    """
    Ask the LLM to list top technical and soft skills / keywords for a role.
    Returns a cleaned list of keywords.
    """
    prompt = [
        {"role":"system","content":"You are an expert hiring manager and career coach who outputs JSON only."},
        {"role":"user","content":(
            f"List the top {top_k} specific technical skills, tools, technologies, and important soft skills and keywords "
            f"that should appear in a resume for the role: '{role}'. Return a JSON array of strings only, e.g. [\"Python\",\"SQL\",...]. "
            "Do not add extra commentary."
        )}
    ]
    out = groq_chat(prompt)
    # try parse JSON from output (be resilient)
    try:
        parsed = json.loads(out)
        if isinstance(parsed, list):
            return [str(x).strip() for x in parsed if str(x).strip()]
    except Exception:
        # fallback: extract lines/commas
        cleaned = re.sub(r"(^```.*?```)|(```)|\n", "", out, flags=re.DOTALL)
        parts = re.split(r"[,;\n•\-]+", cleaned)
        parts = [p.strip() for p in parts if p.strip()]
        return parts[:top_k]
    return []

# ---------- Grammar & format feedback ----------
def get_grammar_and_format_feedback(resume_text: str) -> Dict[str, Any]:
    """
    Ask LLM for grammar suggestions, formatting suggestions, and a numeric grammar score (0-100).
    """
    prompt = [
        {"role":"system","content":"You are a professional resume editor. You MUST output valid JSON only. NO conversational text."},
        {"role":"user","content":(
            "Analyze this resume text and provide:\n"
            "1) grammar_score: (integer 0-100)\n"
            "2) grammar_feedback: (string bullet points)\n"
            "3) format_score: (integer 0-100)\n"
            "4) format_feedback: (string bullet points)\n\n"
            "Resume text:\n" + resume_text[:15000]
        )}
    ]
    out = groq_chat(prompt)
    
    # 1. Try direct JSON parse
    try:
        # Clean up possible markdown code blocks
        clean_out = re.sub(r"```json|```", "", out).strip()
        return json.loads(clean_out)
    except Exception:
        # 2. Fallback: Regex extraction if model adds extra text
        scores = {"grammar_score": 60, "format_score": 60, "grammar_feedback": "", "format_feedback": ""}
        
        g_match = re.search(r'"grammar_score":\s*(\d+)', out)
        f_match = re.search(r'"format_score":\s*(\d+)', out)
        
        if g_match: scores["grammar_score"] = int(g_match.group(1))
        if f_match: scores["format_score"] = int(f_match.group(1))
        
        # If we couldn't even extract scores via regex, try to find any numbers near keywords
        if scores["grammar_score"] == 60:
            val = re.findall(r'(\d+)', out)
            if val: scores["grammar_score"] = int(val[0])
            if len(val) > 1: scores["format_score"] = int(val[1])

        scores["grammar_feedback"] = "Generated from raw analysis (parsing was difficult)."
        scores["format_feedback"] = "Generated from raw analysis."
        return scores

# ---------- Skill gap / suggestions ----------
def get_skill_gap_suggestions(resume_text: str, role: str, missing_keywords: List[str]) -> Dict[str, Any]:
    """
    Ask LLM to provide actionable suggestions: projects, courses, certifications, and how to present them.
    Returns JSON with keys: suggestions (list), sample_phrases (list)
    """
    prompt = [
        {"role":"system","content":"You are a pragmatic career coach focused on action items for students and early-career professionals. Output JSON only."},
        {"role":"user","content":(
            "Given the resume text and the target role, provide:\n"
            "1) suggestions: a list of 6 actionable recommendations (projects, courses, certificates) to close skill gaps for this role.\n"
            "2) sample_phrases: 6 specific resume bullet phrases the candidate can add to demonstrate the suggested skills (use numbers when possible).\n"
            "3) priority_keywords: list up to 10 most important missing keywords to add now.\n\n"
            f"Role: {role}\n"
            f"Missing keywords: {json.dumps(missing_keywords[:50])}\n"
            "Resume text (truncated):\n\n" + resume_text[:12000]
        )}
    ]
    out = groq_chat(prompt)
    try:
        parsed = json.loads(out)
        return parsed
    except Exception:
        # minimal fallback
        return {
            "suggestions": [f"Learn {kw}" for kw in (missing_keywords[:6] or ["relevant skill"])],
            "sample_phrases": [f"Worked on {kw}" for kw in (missing_keywords[:6] or ["relevant skill"])],
            "priority_keywords": missing_keywords[:10]
        }

# ---------- Keyword matching & scoring ----------
def match_keywords(resume_text: str, required_keywords: List[str], threshold: int = 70) -> Tuple[List[str], List[Tuple[str,int]]]:
    """
    Use fuzzy matching to find which required_keywords appear in resume_text.
    Returns (matched_keywords, list_of_(keyword,score))
    """
    text = resume_text.lower()
    # create a set of candidate tokens by splitting resume_text into words and ngrams
    # but we'll simply fuzzy match the keyword against the whole text for robust detection
    results = []
    for kw in required_keywords:
        score = fuzz.partial_ratio(kw.lower(), text)  # 0-100
        results.append((kw, int(score)))
    matched = [kw for kw, sc in results if sc >= threshold]
    return matched, results

def compute_ats_score(keyword_match_percent: float, grammar_score: int, format_score: int) -> float:
    """
    Compute ATS score 0-100 using weighting:
    - keywords: 60%
    - grammar: 20%
    - format: 20%
    Accepts keyword_match_percent in 0-100.
    """
    k = keyword_match_percent
    g = grammar_score
    f = format_score
    score = (k * 0.6) + (g * 0.2) + (f * 0.2)
    # clamp 0-100
    return max(0.0, min(100.0, round(score, 1)))

# ---------- Orchestrator ----------
def analyze_resume(filename: str, file_bytes: bytes, target_role: str, keyword_top_k: int = 25) -> Dict[str, Any]:
    text, ftype = extract_text_from_file(filename, file_bytes)
    # basic heuristics: extract candidate name (first non-empty line)
    lines = [ln.strip() for ln in text.splitlines() if ln.strip()]
    candidate_name = lines[0] if lines else "Unknown"

    # 1. generate keywords for the role
    required_keywords = generate_role_keywords(target_role, top_k=keyword_top_k)

    # 2. match keywords
    matched, scores = match_keywords(text, required_keywords, threshold=70)
    matched_count = len(matched)
    required_count = max(1, len(required_keywords))
    keyword_match_percent = round((matched_count / required_count) * 100.0, 1)

    # 3. grammar & formatting feedback
    gf = get_grammar_and_format_feedback(text)
    grammar_score = int(gf.get("grammar_score", 60))
    format_score = int(gf.get("format_score", 60))

    # 4. skill gap suggestions
    missing_keywords = [kw for kw in required_keywords if kw not in matched]
    sg = get_skill_gap_suggestions(text, target_role, missing_keywords)

    # 5. compute ATS score
    ats_score = compute_ats_score(keyword_match_percent, grammar_score, format_score)

    # prepare report
    report = {
        "candidate_name": candidate_name,
        "file_type": ftype,
        "target_role": target_role,
        "required_keywords": required_keywords,
        "matched_keywords": matched,
        "keyword_match_percent": keyword_match_percent,
        "keyword_match_scores": scores,
        "grammar_score": grammar_score,
        "grammar_feedback": gf.get("grammar_feedback", ""),
        "format_score": format_score,
        "format_feedback": gf.get("format_feedback", ""),
        "missing_keywords": missing_keywords,
        "skill_gap_suggestions": sg,
        "ats_score": ats_score,
    }
    return report

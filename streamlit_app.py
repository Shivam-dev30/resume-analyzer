# streamlit_app.py
import streamlit as st
from resume_analyzer import analyze_resume
import json
import base64

st.set_page_config(page_title="AI Resume Analyzer", layout="wide")

st.title("🔎 AI Resume Analyzer")
st.markdown("Upload your resume (PDF / DOCX / TXT) and specify a target role. The app will analyze ATS keywords, grammar, formatting, skill gaps, and give an ATS score.")

with st.sidebar:
    st.header("Instructions")
    st.markdown("""
    1. Upload resume (PDF or DOCX).\n
    2. Enter target job title (e.g., Data Analyst, Web Developer).\n
    3. Click **Analyze Resume**.\n
    """)
    st.markdown("**Tip:** If analysis seems slow, the model is generating role keywords and feedback. Be patient.")

uploaded_file = st.file_uploader("Upload Resume", type=["pdf", "docx", "txt"])
target_role = st.text_input("Target Job Title (e.g., Data Analyst)", value="Data Analyst")
analyze_btn = st.button("Analyze Resume")

if uploaded_file and analyze_btn:
    try:
        with st.spinner("Analyzing resume — talking to the language model..."):
            file_bytes = uploaded_file.read()
            report = analyze_resume(uploaded_file.name, file_bytes, target_role)

        # Top row: candidate + score
        col1, col2 = st.columns([2, 1])
        with col1:
            st.subheader(f"Candidate: {report['candidate_name']}")
            st.write(f"File type: {report['file_type']}")
            st.write(f"Target Role: **{report['target_role']}**")
        with col2:
            ats = report["ats_score"]
            st.subheader("ATS Score")
            st.metric(label="Overall ATS Score (0–100)", value=f"{ats}")
            st.progress(min(max(int(ats), 0), 100))

        st.markdown("---")
        # Keywords / matching
        st.header("🔑 Keyword Match")
        st.write(f"Keywords required for role ({len(report['required_keywords'])}):")
        st.write(", ".join(report['required_keywords'][:200]))
        st.write("**Matched keywords:**", ", ".join(report['matched_keywords']) if report['matched_keywords'] else "None")
        st.write(f"Keyword match percentage: **{report['keyword_match_percent']}%**")

        # show fuzzy scores sample (top 20)
        st.subheader("Keyword match scores (sample)")
        df = []
        for kw, sc in sorted(report["keyword_match_scores"], key=lambda x: -x[1])[:30]:
            df.append({"keyword": kw, "match_score": sc})
        import pandas as pd
        st.dataframe(pd.DataFrame(df))

        st.markdown("---")
        # Grammar & format
        st.header("✍️ Grammar & Format")
        st.subheader(f"Grammar score: {report['grammar_score']} / 100")
        st.write(report["grammar_feedback"])
        st.subheader(f"Format score: {report['format_score']} / 100")
        st.write(report["format_feedback"])

        st.markdown("---")
        # Skill gap suggestions
        st.header("📈 Skill Gap & Actionable Suggestions")
        sg = report.get("skill_gap_suggestions", {})
        st.subheader("Top suggestions")
        if isinstance(sg.get("suggestions"), list):
            for s in sg["suggestions"]:
                st.write("- " + s)
        else:
            st.write(sg.get("suggestions"))

        st.subheader("Sample resume phrases to add")
        for p in sg.get("sample_phrases", [])[:10]:
            st.code(p)

        st.subheader("Priority missing keywords to add")
        st.write(", ".join(sg.get("priority_keywords", report.get("missing_keywords", []) )[:30]))

        st.markdown("---")
        # Raw JSON download
        st.header("📥 Download Analysis")
        json_str = json.dumps(report, indent=2)
        b64 = base64.b64encode(json_str.encode()).decode()
        href = f'<a href="data:application/json;base64,{b64}" download="resume_analysis.json">Download JSON report</a>'
        st.markdown(href, unsafe_allow_html=True)

    except Exception as e:
        st.error(f"Error during analysis: {e}")
        raise
else:
    st.info("Upload your resume and enter target job title, then click Analyze Resume.")

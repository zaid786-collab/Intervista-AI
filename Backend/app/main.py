from fastapi import FastAPI

app = FastAPI(
    title="Intervista AI API",
    description="Backend API for Intervista AI",
    version="1.0.0"
)


@app.get("/")
def root():
    return {
        "message": "Welcome to Intervista AI Backend"
    }


@app.get("/health")
def health_check():
    return {
        "status": "healthy"
    }

companies = [
    "Google",
    "Microsoft",
    "Amazon",
    "Meta",
    "Apple",
    "Netflix",
    "Adobe",
    "Salesforce",
    "IBM",
    "Oracle",
    "NVIDIA",
    "Infosys",
    "TCS",
    "Wipro",
    "Accenture"
]


@app.get("/api/companies")
def get_companies():
    return {
        "companies": companies
    }
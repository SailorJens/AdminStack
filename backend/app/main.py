# app/main.py
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import Session, select
from .database import init_db, get_session
from .models import User
from .auth import hash_password, verify_password, create_access_token, get_current_user
from .schemas import UserCreate

init_db()  # create tables

app = FastAPI(title="Mini Admin Dashboard")

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Auth endpoints ---

@app.post("/auth/register")
def register(user: UserCreate, session: Session = Depends(get_session)):
    if session.exec(select(User).where(User.email == user.email)).first():
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed = hash_password(user.password)
    new_user = User(email=user.email, hashed_password=hashed)
    session.add(new_user)
    session.commit()
    session.refresh(new_user)
    return {"id": new_user.id, "email": new_user.email}


@app.post("/auth/login")
def login(user: UserCreate, session: Session = Depends(get_session)):
    db_user = session.exec(select(User).where(User.email == user.email)).first()
    if not db_user or not verify_password(user.password, db_user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    token = create_access_token({"sub": db_user.email})
    return {"access_token": token, "token_type": "bearer"}


# --- Protected endpoint example ---

@app.get("/users")
def get_users(current_user: User = Depends(get_current_user), session: Session = Depends(get_session)):
    return session.exec(select(User)).all()

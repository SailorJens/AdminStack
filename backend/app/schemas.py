
from pydantic import BaseModel, EmailStr

class UserCreate(BaseModel):
    email: EmailStr  # validates proper email format
    password: str

from datetime import datetime
from typing import Annotated

from pydantic import (
    BaseModel,
    ConfigDict,
    EmailStr,
    Field,
    StringConstraints,
    field_validator,
)

from .models import TaskStatus

PersonName = Annotated[
    str, StringConstraints(strip_whitespace=True, min_length=1, max_length=100)
]
TaskName = Annotated[
    str, StringConstraints(strip_whitespace=True, min_length=1, max_length=120)
]
TaskDescription = Annotated[
    str, StringConstraints(strip_whitespace=True, max_length=2000)
]


# ---------- Auth ----------
class UserCreate(BaseModel):
    name: PersonName
    email: EmailStr
    password: str = Field(min_length=8, max_length=72)

    @field_validator("password")
    @classmethod
    def password_fits_bcrypt(cls, v: str) -> str:
        # bcrypt only accepts up to 72 bytes
        if len(v.encode("utf-8")) > 72:
            raise ValueError("Password must be at most 72 bytes long")
        return v


class UserOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    email: EmailStr


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


# ---------- Tasks ----------
class TaskCreate(BaseModel):
    name: TaskName
    description: TaskDescription = ""
    status: TaskStatus = TaskStatus.pending


class TaskUpdate(BaseModel):
    name: TaskName | None = None
    description: TaskDescription | None = None
    status: TaskStatus | None = None

    @field_validator("name", "status")
    @classmethod
    def not_null(cls, v):
        if v is None:
            raise ValueError("This field cannot be null")
        return v


class TaskOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    description: str
    status: TaskStatus
    created_at: datetime
    updated_at: datetime
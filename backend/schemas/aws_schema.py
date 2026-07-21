from pydantic import BaseModel, Field


class ConnectAccountRequest(BaseModel):
    account_id: str = Field(..., min_length=12, max_length=12, pattern=r"^\d{12}$")

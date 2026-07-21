from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()


class ConnectRequest(BaseModel):
    account_id: str


@router.post("/connect")
async def connect_account(data: ConnectRequest):
    print(f"[ZeroBurn] AWS Account ID received: {data.account_id}")
    return {"status": "received", "account_id": data.account_id}

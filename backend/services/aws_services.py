async def connect_account(account_id: str) -> dict:
    print(f"[ZeroBurn] AWS Account ID received: {account_id}")
    return {"status": "received", "account_id": account_id}

import time
from collections import defaultdict
from threading import Lock
from fastapi import HTTPException, status, Request

class SimpleRateLimiter:
    def __init__(self, max_requests: int = 15, window_seconds: int = 60):
        self.max_requests = max_requests
        self.window_seconds = window_seconds
        self.requests = defaultdict(list)
        self.lock = Lock()

    def check(self, key: str):
        now = time.time()
        with self.lock:
            # Clean up old timestamps
            self.requests[key] = [t for t in self.requests[key] if now - t < self.window_seconds]
            if len(self.requests[key]) >= self.max_requests:
                raise HTTPException(
                    status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                    detail="Too many requests. Please slow down and try again shortly."
                )
            self.requests[key].append(now)

auth_rate_limiter = SimpleRateLimiter(max_requests=10, window_seconds=60)
application_rate_limiter = SimpleRateLimiter(max_requests=10, window_seconds=60)

def get_client_ip(request: Request) -> str:
    forwarded = request.headers.get("x-forwarded-for")
    if forwarded:
        return forwarded.split(",")[0].strip()
    return request.client.host if request.client else "127.0.0.1"

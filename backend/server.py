import os
import httpx
from fastapi import FastAPI, Request, Response
from fastapi.responses import JSONResponse

app = FastAPI()

# The Node.js server will run on port 5000
NODE_SERVER = "http://localhost:5000"

@app.get("/api/{path:path}")
@app.post("/api/{path:path}")
@app.put("/api/{path:path}")
@app.delete("/api/{path:path}")
async def proxy_api(path: str, request: Request):
    """Proxy API requests to Node.js server"""
    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            url = f"{NODE_SERVER}/api/{path}"
            
            # Get query params
            params = dict(request.query_params)
            
            # Get request body if present
            body = await request.body()
            
            # Get headers
            headers = dict(request.headers)
            headers.pop('host', None)
            
            # Make request to Node server
            response = await client.request(
                method=request.method,
                url=url,
                params=params,
                content=body,
                headers=headers
            )
            
            return Response(
                content=response.content,
                status_code=response.status_code,
                headers=dict(response.headers)
            )
    except httpx.TimeoutException:
        return JSONResponse({"error": "Node server timeout"}, status_code=504)
    except httpx.ConnectError:
        return JSONResponse({"error": "Node server unavailable"}, status_code=503)
    except Exception as e:
        return JSONResponse({"error": str(e)}, status_code=500)

@app.get("/health")
def health():
    return {"status": "ok", "message": "Stellar Dominion API Proxy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)

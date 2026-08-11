package main

import (
	"log"
	"net/http"
	"os"
	"time"

	"github.com/Rahul-Kumar-prog/ZeroBurn/internal/cloudaccounts"
	"github.com/Rahul-Kumar-prog/ZeroBurn/platform/middleware"
)

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = "8003"
	}

	mux := http.NewServeMux()

	mux.HandleFunc("GET /health", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		w.Write([]byte(`{"status":"ok"}`))
	})

	mux.HandleFunc("POST /api/aws/connect", cloudaccounts.HandleConnect)
	mux.HandleFunc("GET /api/aws/status", cloudaccounts.HandleStatus)

	server := &http.Server{
		Addr:              ":" + port,
		Handler:           middleware.CORS(mux),
		ReadHeaderTimeout: 5 * time.Second,
		ReadTimeout:       15 * time.Second,
		WriteTimeout:      30 * time.Second,
		IdleTimeout:       60 * time.Second,
	}

	log.Printf("API server starting on port %s", port)

	if err := server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
		log.Fatalf("server failed: %v", err)
	}
}

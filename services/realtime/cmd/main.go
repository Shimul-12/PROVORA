package main

import (
    "fmt"
    "log"
    "net/http"
    "os"
    
    "github.com/joho/godotenv"
)

func main() {
    if err := godotenv.Load(); err != nil {
        log.Println("No .env file found, using environment variables")
    }
    
    port := os.Getenv("PORT")
    if port == "" {
        port = "8080"
    }
    
    fmt.Printf("ExamIdentity Realtime Service starting on port %s\n", port)
    
    http.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
        w.WriteHeader(http.StatusOK)
        w.Write([]byte({"status":"healthy","service":"realtime"}))
    })
    
    log.Fatal(http.ListenAndServe(":"+port, nil))
}

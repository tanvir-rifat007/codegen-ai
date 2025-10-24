package main

import (
	"net/http"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

func ping(w http.ResponseWriter, r *http.Request) {

	w.Write([]byte("OK"))
}

// helper to generate a valid JWT for testing
func generateTestJWT() (string, error) {
	claims := jwt.MapClaims{
		"id":        "16",
		"email":     "test@gmail.com",
		"name":      "test_user",
		"activated": true,
		"exp":       time.Now().Add(1 * time.Hour).Unix(),
	}
	tokenObj := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return tokenObj.SignedString([]byte("default-secret-for-dev"))
}

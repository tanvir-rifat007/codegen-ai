package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"log/slog"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/tanvir-rifat007/codegen-ai-react/internal/assert"
	"github.com/tanvir-rifat007/codegen-ai-react/internal/data"
)

func TestPing(t *testing.T) {
	// create a new responseRecorder
	w := httptest.NewRecorder()

	r, err := http.NewRequest(http.MethodGet, "/", nil)

	if err != nil {
		t.Fatal(err)
		return
	}

	ping(w, r)

	resp := w.Result()

	assert.Equal(t, resp.StatusCode, http.StatusOK)

	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)

	if err != nil {
		t.Fatal(err)
	}

	body = bytes.TrimSpace(body)

	assert.Equal(t, string(body), "OK")

}

func TestMeHandler(t *testing.T) {
	jwtStr, err := generateTestJWT()
	if err != nil {
		t.Fatalf("failed to create test jwt: %v", err)
	}

	req := httptest.NewRequest(http.MethodGet, "/api/users/me", nil)
	req.AddCookie(&http.Cookie{
		Name:  "auth_token",
		Value: jwtStr,
	})

	rr := httptest.NewRecorder()

	app := &application{
		logger: slog.New(slog.NewTextHandler(io.Discard, nil)),
	}

	app.meHandler(rr, req)

	res := rr.Result()
	defer res.Body.Close()

	assert.Equal(t, res.StatusCode, http.StatusOK)

	body, err := io.ReadAll(res.Body)
	if err != nil {
		t.Fatal(err)
	}

	fmt.Printf("Raw body: %s\n", string(body))

	// response is the json format
	var response struct {
		User data.User `json:"user"`
	}

	if err := json.Unmarshal(body, &response); err != nil {
		t.Fatalf("failed to decode response json: %v", err)
	}

	if err != nil {
		t.Fatal(err)
	}

	assert.Equal(t, response.User.ID, "16")
	assert.Equal(t, response.User.Email, "test@gmail.com")
	assert.Equal(t, response.User.Name, "test_user")
	assert.Equal(t, response.User.Activated, true)
}

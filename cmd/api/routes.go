package main

import (
	"net/http"

	"github.com/tanvir-rifat007/codegen-ai-react/internal/server"
)

func (app *application) routes(srv *server.Server) http.Handler {

	mux := http.NewServeMux()

	mux.Handle("GET /assets/", http.StripPrefix("/assets/", http.FileServer(http.Dir("dist/assets/"))))

	mux.HandleFunc("GET /", app.handleSSR)

	http.HandleFunc("/api/generate", srv.HandleGenerate)
	http.HandleFunc("/download/", srv.HandleDownload)

	mux.HandleFunc("POST /api/generate", srv.HandleGenerate)

	return mux

}

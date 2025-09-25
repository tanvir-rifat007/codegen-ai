package main

import (
	"flag"
	"log/slog"
	"os"
	"sync"

	"github.com/tanvir-rifat007/codegen-ai-react/internal/server"
)

var (
	htmlShell string
	appCode   string
)

type config struct {
	port      int
	env       string
	openAiKey string
	outputDir string
	db        struct {
		dsn string
	}
}

type application struct {
	config config
	logger *slog.Logger
	wg     sync.WaitGroup
}

const version = "1.0.0"

func main() {

	var cfg config

	flag.StringVar(&cfg.env, "env", "development", "Environment (development | staging | production)")
	flag.IntVar(&cfg.port, "port", 3000, "Api server port")

	flag.StringVar(&cfg.openAiKey, "openAiKey", os.Getenv("OPENAI_API_KEY"), "OpenAI API key")
	flag.StringVar(&cfg.outputDir, "output-dir", "./output", "Base directory for generated projects")

	flag.Parse()

	logger := slog.New(slog.NewTextHandler(os.Stdout, nil))

	app := &application{
		config: cfg,
		logger: logger,
	}

	srv := server.NewServer(cfg.openAiKey, cfg.outputDir)

	err := app.initializeApp()
	if err != nil {
		app.logger.Error(err.Error())
		return
	}

	err = app.serve(srv)

	if err != nil {
		app.logger.Error(err.Error())
		os.Exit(1)
	}

}

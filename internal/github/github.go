package ghupload

import (
	"bytes"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"path/filepath"
)

const apiBase = "https://api.github.com"

type Client struct {
	username string
	pat      string
	http     *http.Client
}

type treeNode struct {
	Path string `json:"path"`
	Mode string `json:"mode"`
	Type string `json:"type"`
	SHA  string `json:"sha"`
}

func NewClient(username, pat string) *Client {
	return &Client{
		username: username,
		pat:      pat,
		http:     &http.Client{},
	}
}

// UploadProject creates a GitHub repo and pushes all files from projectDir in one commit.
func (c *Client) UploadProject(projectDir, repoName string, private bool) (string, error) {
	// auto_init=true creates an initial commit so the Git Data API is usable immediately.
	repoURL, err := c.createRepo(repoName, private)
	if err != nil {
		return "", fmt.Errorf("create repo: %w", err)
	}

	// Get the SHA of the auto-init commit so we can use it as the parent.
	parentSHA, err := c.getHeadSHA(repoName)
	if err != nil {
		return "", fmt.Errorf("get head SHA: %w", err)
	}

	var nodes []treeNode

	err = filepath.Walk(projectDir, func(path string, info os.FileInfo, err error) error {
		if err != nil || info.IsDir() {
			return err
		}
		content, err := os.ReadFile(path)
		if err != nil {
			return err
		}
		rel, _ := filepath.Rel(projectDir, path)
		rel = filepath.ToSlash(rel)

		sha, err := c.createBlob(repoName, content)
		if err != nil {
			return fmt.Errorf("blob %s: %w", rel, err)
		}
		nodes = append(nodes, treeNode{Path: rel, Mode: "100644", Type: "blob", SHA: sha})
		return nil
	})
	if err != nil {
		return "", fmt.Errorf("walk project dir: %w", err)
	}

	treeSHA, err := c.createTree(repoName, nodes)
	if err != nil {
		return "", fmt.Errorf("create tree: %w", err)
	}

	commitSHA, err := c.createCommit(repoName, treeSHA, parentSHA)
	if err != nil {
		return "", fmt.Errorf("create commit: %w", err)
	}

	// The branch already exists (auto_init created it), so PATCH rather than POST.
	if err := c.updateRef(repoName, commitSHA); err != nil {
		return "", fmt.Errorf("update ref: %w", err)
	}

	return repoURL, nil
}

func (c *Client) do(method, url string, payload any) ([]byte, int, error) {
	var bodyReader io.Reader
	if payload != nil {
		b, err := json.Marshal(payload)
		if err != nil {
			return nil, 0, err
		}
		bodyReader = bytes.NewReader(b)
	}

	req, err := http.NewRequest(method, url, bodyReader)
	if err != nil {
		return nil, 0, err
	}

	req.Header.Set("Authorization", "Bearer "+c.pat)
	req.Header.Set("Accept", "application/vnd.github+json")
	req.Header.Set("X-GitHub-Api-Version", "2022-11-28")
	if payload != nil {
		req.Header.Set("Content-Type", "application/json")
	}

	resp, err := c.http.Do(req)
	if err != nil {
		return nil, 0, err
	}
	defer resp.Body.Close()

	respBody, err := io.ReadAll(resp.Body)
	return respBody, resp.StatusCode, err
}

func (c *Client) createRepo(name string, private bool) (string, error) {
	payload := map[string]any{
		"name":      name,
		"private":   private,
		"auto_init": true, // creates an initial commit so the Git Data API works immediately
	}
	body, status, err := c.do("POST", apiBase+"/user/repos", payload)
	if err != nil {
		return "", err
	}
	if status != 201 {
		return "", fmt.Errorf("status %d: %s", status, body)
	}
	var result struct {
		HTMLURL string `json:"html_url"`
	}
	if err := json.Unmarshal(body, &result); err != nil {
		return "", err
	}
	return result.HTMLURL, nil
}

func (c *Client) getHeadSHA(repoName string) (string, error) {
	url := fmt.Sprintf("%s/repos/%s/%s/git/ref/heads/main", apiBase, c.username, repoName)
	body, status, err := c.do("GET", url, nil)
	if err != nil {
		return "", err
	}
	if status != 200 {
		return "", fmt.Errorf("status %d: %s", status, body)
	}
	var result struct {
		Object struct {
			SHA string `json:"sha"`
		} `json:"object"`
	}
	if err := json.Unmarshal(body, &result); err != nil {
		return "", err
	}
	return result.Object.SHA, nil
}

func (c *Client) createBlob(repoName string, content []byte) (string, error) {
	payload := map[string]any{
		"content":  base64.StdEncoding.EncodeToString(content),
		"encoding": "base64",
	}
	url := fmt.Sprintf("%s/repos/%s/%s/git/blobs", apiBase, c.username, repoName)
	body, status, err := c.do("POST", url, payload)
	if err != nil {
		return "", err
	}
	if status != 201 {
		return "", fmt.Errorf("status %d: %s", status, body)
	}
	var result struct {
		SHA string `json:"sha"`
	}
	if err := json.Unmarshal(body, &result); err != nil {
		return "", err
	}
	return result.SHA, nil
}

func (c *Client) createTree(repoName string, nodes []treeNode) (string, error) {
	payload := map[string]any{"tree": nodes}
	url := fmt.Sprintf("%s/repos/%s/%s/git/trees", apiBase, c.username, repoName)
	body, status, err := c.do("POST", url, payload)
	if err != nil {
		return "", err
	}
	if status != 201 {
		return "", fmt.Errorf("status %d: %s", status, body)
	}
	var result struct {
		SHA string `json:"sha"`
	}
	if err := json.Unmarshal(body, &result); err != nil {
		return "", err
	}
	return result.SHA, nil
}

func (c *Client) createCommit(repoName, treeSHA, parentSHA string) (string, error) {
	payload := map[string]any{
		"message": "Initial commit — generated by Codegen AI",
		"tree":    treeSHA,
		"parents": []string{parentSHA},
	}
	url := fmt.Sprintf("%s/repos/%s/%s/git/commits", apiBase, c.username, repoName)
	body, status, err := c.do("POST", url, payload)
	if err != nil {
		return "", err
	}
	if status != 201 {
		return "", fmt.Errorf("status %d: %s", status, body)
	}
	var result struct {
		SHA string `json:"sha"`
	}
	if err := json.Unmarshal(body, &result); err != nil {
		return "", err
	}
	return result.SHA, nil
}

func (c *Client) updateRef(repoName, commitSHA string) error {
	payload := map[string]any{
		"sha":   commitSHA,
		"force": true,
	}
	url := fmt.Sprintf("%s/repos/%s/%s/git/refs/heads/main", apiBase, c.username, repoName)
	body, status, err := c.do("PATCH", url, payload)
	if err != nil {
		return err
	}
	if status != 200 {
		return fmt.Errorf("status %d: %s", status, body)
	}
	return nil
}

package main

import (
	"bytes"
	"encoding/json"
	"errors"
	"net/http"
	"os"
)

type ApiClient struct {
	baseURL string
}

func NewApiClient() *ApiClient {
	return &ApiClient{
		baseURL: os.Getenv("API_URL"),
	}
}

func (c *ApiClient) SendToAPI(data WeatherData) error {

	body, _ := json.Marshal(data)

	resp, err := http.Post(c.baseURL, "application/json", bytes.NewBuffer(body))
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	if resp.StatusCode >= 400 {
		return errors.New("API retornou erro")
	}

	return nil
}

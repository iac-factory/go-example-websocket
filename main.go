package main

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"golang.org/x/net/websocket"
	"net"
	"net/http"
	"os"
	"os/signal"
	"strconv"
	"strings"
	"sync/atomic"
	"time"
)

var cw ConnectionWatcher

type ConnectionWatcher struct {
	n int64
}

// OnStateChange records open connections in response to connection
// state changes. Set net/http Server.ConnState to this method
// as value.
func (cw *ConnectionWatcher) OnStateChange(conn net.Conn, state http.ConnState) {
	switch state {
	case http.StateNew:
		cw.Increment()
	// case http.StateHijacked, http.StateClosed:
	// 	cw.Add(-1)
	// }
	case http.StateHijacked:
		cw.Decrement()
	case http.StateClosed:
		cw.Decrement()
	}
}

// Count returns the number of connections at the time
// the call.
func (cw *ConnectionWatcher) Count() int {
	return int(atomic.LoadInt64(&cw.n))
}

// Increment adds exactly (1) from the number of active connection(s).
func (cw *ConnectionWatcher) Increment() {
	atomic.AddInt64(&cw.n, 1)
}

// Decrement removes exactly (1) from the number of active connection(s).
func (cw *ConnectionWatcher) Decrement() {
	atomic.AddInt64(&cw.n, -1)
}

type Message struct {
	Interval int64  `json:"interval"`
	Delay    *int64 `json:"delay"`
}

func Handler(ws *websocket.Conn) {
	var e error

	cw.Increment()

	defer func() {
		cw.Decrement()

		ws.Close()
	}()

	for {
		var input string
		var message Message

		if e = websocket.Message.Receive(ws, &input); e != nil {
			if e.Error() == "EOF" {
				fmt.Println("Client Closed Socket...")
				break
			}

			break
		}

		buffer := []byte(input)
		if e := json.Unmarshal(buffer, &message); e != nil {
			fmt.Println("Unable to Serialize Client's Message")
			break
		}

		if message.Delay != nil {
			time.Sleep(time.Duration(int64(time.Millisecond) * (*message.Delay)))

			message.Delay = nil
		}

		for {
			var response = struct {
				Connections int   `json:"connections"`
				Timestamp   int64 `json:"timestamp"`
			}{
				Connections: cw.Count(),
				Timestamp:   time.Now().Unix(),
			}

			if e = websocket.JSON.Send(ws, response); e != nil {
				break
			}

			time.Sleep(time.Duration(int64(time.Millisecond) * (message.Interval)))
		}

		if e != nil {
			break
		}
	}
}

func main() {
	var port string

	variables := os.Environ()
	hostname, _ := os.Hostname()
	multiplexer := http.NewServeMux()

	multiplexer.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		var environment = make(map[string]string, len(variables))
		for _, env := range os.Environ() {
			partials := strings.Split(env, "=")

			environment[partials[0]] = partials[1]
		}

		var response = map[string]interface{}{
			"server":      "Testing-Server",
			"host":        r.Host,
			"request-uri": r.RequestURI,
			"url":         r.URL.String(),
			"node":        hostname,
			"variables":   environment,
		}

		buffer, _ := json.MarshalIndent(response, "", "    ")

		defer w.Write(buffer)

		w.Header().Set("Content-Type", "Application/JSON")
		w.Header().Set("Content-Length", strconv.Itoa(len(buffer)))

		w.WriteHeader(http.StatusOK)

		return
	})

	if port = os.Getenv("PORT"); port == "" {
		port = "8080"
	}

	// websocat ws://localhost:8080/web-socket --origin http://127.0.0.1
	multiplexer.Handle("/web-socket", websocket.Handler(Handler))

	s := &http.Server{
		Addr:                         fmt.Sprintf(":%s", port),
		Handler:                      multiplexer,
		DisableGeneralOptionsHandler: true,
		TLSConfig:                    nil,
		ReadTimeout:                  500 * time.Millisecond,
		ReadHeaderTimeout:            500 * time.Millisecond,
		WriteTimeout:                 10 * time.Second,
		IdleTimeout:                  0,
		MaxHeaderBytes:               0,
		TLSNextProto:                 nil,
		ConnState:                    cw.OnStateChange,
		ErrorLog:                     nil,
		BaseContext:                  nil,
		ConnContext:                  nil,
	}

	// Start server
	go func() {
		fmt.Printf("Initializing Server (http://%s) ...\n", fmt.Sprintf("localhost:%s", port))
		if e := s.ListenAndServe(); e != nil {
			switch {
			case errors.Is(e, http.ErrServerClosed):
				fmt.Println("\r - Server Closed Listener")
			default:
				fmt.Println(fmt.Sprintf("Error Starting Server - Unhandled Exception: %s", e))
			}
		}
	}()

	// Wait for interrupt signal to gracefully shutdown the server with a timeout of 10 seconds.
	// Use a buffered channel to avoid missing signals as recommended for signal.Notify
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, os.Interrupt)
	<-quit
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	if e := s.Shutdown(ctx); e != nil {
		panic(e)
	}
}

import cv2
import serial
import threading
import time
import os

# === CONFIGURATION ===
SERIAL_PORT   = 'COM14'         # your Arduino port
BAUD_RATE     = 9600
BASE_DIR      = 'public\memories'      # parent directory for all sessions
AUTO_INTERVAL = 15              # auto‐capture frequency (seconds)
# ======================

# make sure base exists
os.makedirs(BASE_DIR, exist_ok=True)

# create a new session folder named with the start timestamp
session_ts = time.strftime("%Y%m%d_%H%M%S")
OUTPUT_DIR = os.path.join(BASE_DIR, f"session_{session_ts}")
os.makedirs(OUTPUT_DIR)

print(f"Session folder: {OUTPUT_DIR}")

ser = serial.Serial(SERIAL_PORT, BAUD_RATE, timeout=1)
cap = cv2.VideoCapture(0)

recording    = False
video_writer = None

# Auto‐capture control
auto_capture   = True
auto_thread    = None
last_manual_ts = 0             # timestamp of last manual CAPTURE

last_time = {'CAPTURE': 0, 'TOGGLE': 0}

def start_auto():
    """Start the auto-capture thread if not already running."""
    global auto_capture, auto_thread
    if auto_thread and auto_thread.is_alive():
        return
    auto_capture = True

    def runner():
        while auto_capture:
            now = time.time()
            # If we just did a manual capture or just resumed after video, wait the full interval
            if now - last_manual_ts < AUTO_INTERVAL:
                time.sleep(AUTO_INTERVAL - (now - last_manual_ts))
                continue

            timestamp = time.strftime("%Y%m%d_%H%M%S")
            img_name = os.path.join(OUTPUT_DIR, f"img_auto_{timestamp}.png")
            ret, frame = cap.read()
            if ret:
                cv2.imwrite(img_name, frame)
                print(f"[AUTO] Saved image {img_name}")
            time.sleep(AUTO_INTERVAL)

    auto_thread = threading.Thread(target=runner, daemon=True)
    auto_thread.start()
    print(f"[AUTO] Auto‐capture enabled (every {AUTO_INTERVAL}s)")

def stop_auto():
    """Stop the auto-capture thread."""
    global auto_capture
    auto_capture = False
    print("[AUTO] Auto‐capture disabled")

def listen_serial():
    """Listen for CAPTURE/TOGGLE commands over serial."""
    global recording, video_writer, last_manual_ts

    while True:
        line = ser.readline().decode('utf-8').strip()
        if not line:
            continue
        now_ms = time.time() * 1000
        if now_ms - last_time.get(line, 0) < 200:
            continue
        last_time[line] = now_ms

        print(f"Received: {line}")

        if line == 'CAPTURE':
            # Manual capture: pause auto for one interval
            last_manual_ts = time.time()
            timestamp = time.strftime("%Y%m%d_%H%M%S")
            img_name = os.path.join(OUTPUT_DIR, f"img_{timestamp}.png")
            ret, frame = cap.read()
            if ret:
                cv2.imwrite(img_name, frame)
                print(f"Saved image {img_name}")
            # ensure auto is running (it will sleep until next interval)
            if not auto_capture:
                start_auto()

        elif line == 'TOGGLE':
            if not recording:
                # Video start: disable auto
                stop_auto()
                timestamp = time.strftime("%Y%m%d_%H%M%S")
                vid_name = os.path.join(OUTPUT_DIR, f"vid_{timestamp}.avi")
                fourcc = cv2.VideoWriter_fourcc(*'XVID')
                fps = 20.0
                w = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
                h = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
                video_writer = cv2.VideoWriter(vid_name, fourcc, fps, (w, h))
                recording = True
                print(f"Started recording to {vid_name}")
            else:
                # Video stop: re-enable auto immediately, but reset timer
                recording = False
                video_writer.release()
                video_writer = None
                print("Stopped recording")
                # Reset baseline so auto waits a full interval before next shot
                last_manual_ts = time.time()
                start_auto()

# kick off auto‐capture on script start
start_auto()

# start listening to serial in background
serial_thread = threading.Thread(target=listen_serial, daemon=True)
serial_thread.start()

# main loop keeps camera warm and writes video frames
try:
    while True:
        ret, frame = cap.read()
        if not ret:
            break
        if recording and video_writer:
            video_writer.write(frame)
        cv2.imshow('Preview', frame)
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break
finally:
    cap.release()
    if video_writer:
        video_writer.release()
    cv2.destroyAllWindows()
    ser.close()
    print(f"Session ended. All captures saved in {OUTPUT_DIR}")

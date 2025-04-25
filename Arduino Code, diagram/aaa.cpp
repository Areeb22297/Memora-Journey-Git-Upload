// Arduino to PC Camera Trigger with Dual-LED Feedback

const uint8_t BTN_CAPTURE   = 2;
const uint8_t BTN_TOGGLE    = 3;
const uint8_t LED_CAPTURE   = 4;  // blinks for manual snapshots
const uint8_t LED_VIDEO     = 5;  // solid on during video

uint8_t lastStateCapture = HIGH;
uint8_t lastStateToggle  = HIGH;

bool capAlreadySent = false;
bool togAlreadySent = false;

unsigned long lastDebounceCap = 0;
unsigned long lastDebounceTog = 0;
const unsigned long DEBOUNCE_DELAY = 50;

// Blink duration for capture LED (ms)
const unsigned long BLINK_DURATION = 100;

void setup() {
  pinMode(BTN_CAPTURE, INPUT_PULLUP);
  pinMode(BTN_TOGGLE,  INPUT_PULLUP);
  pinMode(LED_CAPTURE, OUTPUT);
  pinMode(LED_VIDEO,   OUTPUT);

  digitalWrite(LED_CAPTURE, LOW);
  digitalWrite(LED_VIDEO,   LOW);

  Serial.begin(9600);
}

void loop() {
  static bool videoOn = false;

  // Handle manual‐capture button
  debounceAndSend(
    BTN_CAPTURE,
    lastStateCapture,
    lastDebounceCap,
    capAlreadySent,
    "CAPTURE\n",
    videoOn
  );

  // Handle video‐toggle button
  debounceAndSend(
    BTN_TOGGLE,
    lastStateToggle,
    lastDebounceTog,
    togAlreadySent,
    "TOGGLE\n",
    videoOn
  );
}

// Debounce + command send + LED control
void debounceAndSend(uint8_t pin,
                     uint8_t &lastState,
                     unsigned long &lastDebounceTime,
                     bool &alreadySent,
                     const char* cmd,
                     bool &videoOn) {
  uint8_t reading = digitalRead(pin);

  // Debounce
  if (reading != lastState) {
    lastDebounceTime = millis();
  }
  if (millis() - lastDebounceTime > DEBOUNCE_DELAY) {
    if (reading == LOW && !alreadySent) {
      Serial.print(cmd);
      alreadySent = true;

      if (pin == BTN_CAPTURE) {
        // Blink the capture LED
        blinkLED(LED_CAPTURE);
      }
      else if (pin == BTN_TOGGLE) {
        // Toggle video state and LED
        videoOn = !videoOn;
        digitalWrite(LED_VIDEO, videoOn ? HIGH : LOW);
      }
    }

    // Button released → allow next press
    if (reading == HIGH) {
      alreadySent = false;
    }
  }

  lastState = reading;
}

// Blink a given LED pin for BLINK_DURATION ms
void blinkLED(uint8_t ledPin) {
  digitalWrite(ledPin, HIGH);
  delay(BLINK_DURATION);
  digitalWrite(ledPin, LOW);
}

# Arduino
## Learning Objectives
For this project, I had to use my programming knowledge to code in C family language I didn't know, C++, to make an arduino function. I was able to become more comfortable with breadboards, integrating various components, and troubleshooting circuits that didn't work via software and hardware. I was able to use temperature and humidity sensors and interfaces like a joystick and push buttons for control. TinkerCAD was useful for testing if the sketches and wiring would work in the first place, like with the RGB LED.

## RGB LED
To start, I hooked up a simple RGB LED to the arduino. Later, I put in a joystick to control which colours it outputted.

<div style="position: relative; width: 100%; padding-top: 56.25%;">
  <video
    src="https://github.com/normalday843812/engineering-portfolio/raw/refs/heads/main/projects/arduino/videos/rgb-led-testing.mp4"
    style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border-radius: 16px;"
    controls
  ></video>
</div>

## Data Display
I was able to design a working temperature and humidity display that you could toggle between metric and imperial units using 4x7 segment displays.

<div style="position: relative; width: 100%; padding-top: 56.25%;">
  <video
    src="https://github.com/normalday843812/engineering-portfolio/raw/refs/heads/main/projects/arduino/videos/data-display-testing.mp4"
    style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border-radius: 16px;"
    controls
  ></video>
</div>

## Song Player
Using the arduino, an IR sensor, a transistor, and a passive buzzer, I was able to make a music player. I have a passion for music which is the main reason why I did this project. First, I made a Python program that could convert a midi file into a single track in a format that the arduino could understand (.h file). Then I wrote a .ino script that interpreted that file and used a custom tone function to play it based on the durations and frequencies. I also was able to integrate remote control to pause, resume, and play a different song using the IR sensor. The transistor and resistor were just used to power the passive speaker, as just the digital pin header wasn't enough to have an audible volume.

<div style="position: relative; width: 100%; padding-top: 56.25%;">
  <video
    src="https://github.com/normalday843812/engineering-portfolio/raw/refs/heads/main/projects/arduino/videos/song-player-testing.mp4"
    style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border-radius: 16px;"
    controls
  ></video>
</div>

Song Player repo: <a href="https://github.com/normalday843812/buzzer-arduino" target="_blank" rel="noopener noreferrer" aria-label="GitHub"><i class="bi bi-github"></i></a> <br>
Data display repo: <a href="https://github.com/normalday843812/data-display-arduino" target="_blank" rel="noopener noreferrer" aria-label="GitHub"><i class="bi bi-github"></i></a><br>
RGB LED code:
```C++
/* Setting pin numbers */
const int joyStickX = A1; 
const int joyStickY = A0;
const int joyStickButton = 2;

void setup() {
  Serial.begin(9600); // Begins serial output that can be read on a computer
  /* Set pins to output to RGB LED */
  pinMode(11, OUTPUT);
  pinMode(10, OUTPUT);
  pinMode(9, OUTPUT);

  pinMode(joyStickButton, INPUT_PULLUP); // Sets digital pin 2 to an input, turns on pull-up resistor so button isn't unreliable
}

void loop() {
  int xValue = analogRead(joyStickX); // Reads pin A1 (joyStickX) outputs between 0 to 1023
  int yValue = analogRead(joyStickY); // Reads pin A0 (joyStickY) outputs between 0 to 1023
  int buttonState = digitalRead(joyStickButton); // HIGH or LOW output

  float redValue = static_cast<float>(xValue) / 4.0f; // Casts to a float and normalises to 0 to 256
  float blueValue = static_cast<float>(yValue) / 4.0f; // Casts to a float and normalises to 0 to 256
  int greenValue = buttonState ? LOW : 255; // If HIGH, set greenValue to 0, if LOW, set greenValue to 255

  /* Output on pins connected to RGB LED to change colour */
  analogWrite(11, redValue);
  analogWrite(10, greenValue);
  analogWrite(9, blueValue);

  /* Telemetry to be read on the computer */
  Serial.print("X: ");
  Serial.print(xValue);
  Serial.print(" | Y: ");
  Serial.print(yValue);
  Serial.print(" | Button: ");
  Serial.println(buttonState);
  delay(150); // A little delay to ensure stability
}
```
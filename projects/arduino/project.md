# Arduino
## Learning Objectives
For this project, I had to use my programming knowledge to code in C family language I didn't know, C++, to make an arduino function. I was able to become more comfortable with breadboards, integrating various components, and troubleshooting circuits that didn't work via software and hardware. I was able to use temperature and humidity sensors and interfaces like a joystick and push buttons for control. 

## Data Display
I was able to design a working temperature and humidity display that you could toggle between metric and imperial units using 4x7 segment displays.

## Song Player
Using the arduino, an IR sensor, a transistor, and a passive buzzer, I was able to make a music player. First, I made a Python program that could convert a midi file into a single track in a format that the arduino could understand (.h file). Then I wrote a .ino script that interpreted that file and used a custom tone function to play it based on the durations and frequencies. I also was able to integrate remote control to pause, resume, and play a different song using the IR sensor. The transistor and resistor were just used to power the passive speaker, as just the digital pin header wasn't enough to have an audible volume..
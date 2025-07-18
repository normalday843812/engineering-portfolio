# Independent Project
Using the arduino, an IR sensor, a transistor, and a passive buzzer, I was able to make a music player. I have a passion for music which is the main reason why I did this project. First, I made a Python program that could convert a midi file into a single track in a format that the arduino could understand. The Python program used the mido library to process the .mid files and simply formatted it and outputted it to a .h file. Then I wrote a .ino script that interpreted that file and used a custom tone function to play it based on the durations and frequencies. I also was able to integrate remote control to pause, resume, and play a different song using the IR sensor. The transistor and resistor were just used to power the passive speaker, as just the digital pin header wasn't enough to have an audible volume.

<div style="position: relative; width: 100%; padding-top: 56.25%;">
  <video
    src="https://github.com/normalday843812/engineering-portfolio/raw/refs/heads/main/projects/arduino/videos/song-player-testing.mp4"
    style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border-radius: 16px;"
    controls
  ></video>
</div>

Repo: <a href="https://github.com/normalday843812/buzzer-arduino" target="_blank" rel="noopener noreferrer" aria-label="GitHub"><i class="bi bi-github"></i></a> <br>
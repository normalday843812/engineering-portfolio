# Robot

## Project

For this project, we had to build an FTC style robot to:
1. Navigate in autonomous mode around a U shaped track
2. Turn to teleop mode and bring the robot around a corner
3. Pick up a heavy wooden block with a handle on the top
4. Navigate on a ramp to a hole and deposit the wooden block
5. Deposit a ball into a circular hole in the ramp

We also had a battlebots tournament at the end where we had to push other bots off of a platform.

## Strategy

### Autonomous
For the autonomous stage, we saw that there was black and white tape strips on the ground. We decided that it would be best if we used these stripes along with color sensors to keep the robot on the track. Later, we realised we could also use distance sensors to detect these large wooden blocks and use them to turn.

### Teleop
For the teleop, we decided upon a claw for the brick and the ball. However, we ended up using small containment claws at the bottom to guide the ball so that we could use the claw for the brick and speed up our time.

## How the robot performed

We were able to get 1st place in both the normal competition and the battlebots tournament. The robot did consistently very well in teleop and in the first two rounds of autonomous. 

We added weights for the battle bots tournament, had a good centre of mass, and lots of torque in our motors which allowed us to push the other bots off.

## Challenges

Our challenges mainly involved improving our driving skills and fixing some of the jank with the robot hardware, like wobbling wheels. For code, the main problem we had was with the very ending of the autonomous period. We used sensors for every part except the end where we just ended up hardcoding the time the motors would run. It worked until I changed it to use the sensors, where it failed in the third round of the normal competition. This did not affect our placing, though.

<div style="position: relative; width: 100%; padding-top: 56.25%;">
  <video
    src="https://github.com/normalday843812/engineering-portfolio/raw/refs/heads/main/projects/robotics/videos/robot-operating.mp4"
    style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border-radius: 16px;"
    controls
  ></video>
</div>
Here is a video of our robot working in autonomous mode
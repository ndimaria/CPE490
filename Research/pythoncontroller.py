import subprocess
import select
import time

class Joystick:
    def __init__(self,refreshRate = 30):
        self.proc = subprocess.Popen(['xboxdrv','--no-uinput','--detach-kernel-driver'], stdout=subprocess.PIPE, bufsize=0)
        self.pipe = self.proc.stdout
        self.connectStatus = False
        self.reading = '0' * 140
        self.refreshTime = 0
        self.refreshDelay = 1.0 / refreshRate
        found = False
        waitTime = time.time() + 2
        while waitTime > time.time() and not found:
            readable, writeable, exception = select.select([self.pipe],[],[],0)
            if readable:
                response = self.pipe.readline()
                if response[0:7] == b'No Xbox':
                    raise IOError('No Xbox controller/receiver found')
                if response[0:12].lower() == b'press ctrl-c':
                    found = True
                if len(response) == 140:
                    found = True
                    self.connectStatus = True
                    self.reading = response
        if not found:
            self.close()
            raise IOError('Unable to detect Xbox controller/receiver - Run python as sudo')

    def refresh(self):
        if self.refreshTime < time.time():
            self.refreshTime = time.time() + self.refreshDelay
            readable, writeable, exception = select.select([self.pipe],[],[],0)
            if readable:
                while readable:
                    response = self.pipe.readline()
                    if len(response) == 0:
                        raise IOError('Xbox controller disconnected from USB')
                    readable, writeable, exception = select.select([self.pipe],[],[],0)
                if len(response) == 140:
                    self.connectStatus = True
                    self.reading = response
                else:
                    self.connectStatus = False

    def connected(self):
        self.refresh()
        return self.connectStatus

    # Left stick X axis value scaled between -1.0 (left) and 1.0 (right) with deadzone tolerance correction
    def leftX(self,deadzone=4000):
        self.refresh()
        raw = int(self.reading[3:9])
        return self.axisScale(raw,deadzone)

    # Left stick Y axis value scaled between -1.0 (down) and 1.0 (up)
    def leftY(self,deadzone=4000):
        self.refresh()
        raw = int(self.reading[13:19])
        return self.axisScale(raw,deadzone)

    # Right stick X axis value scaled between -1.0 (left) and 1.0 (right)
    def rightX(self,deadzone=4000):
        self.refresh()
        raw = int(self.reading[24:30])
        return self.axisScale(raw,deadzone)

    # Right stick Y axis value scaled between -1.0 (down) and 1.0 (up)
    def rightY(self,deadzone=4000):
        self.refresh()
        raw = int(self.reading[34:40])
        return self.axisScale(raw,deadzone)

    # Scale raw (-32768 to +32767) axis with deadzone correcion
    # Deadzone is +/- range of values to consider to be center stick (ie. 0.0)
    def axisScale(self,raw,deadzone):
        if abs(raw) < deadzone:
            return 0.0
        else:
            if raw < 0:
                return (raw + deadzone) / (32768.0 - deadzone)
            else:
                return (raw - deadzone) / (32767.0 - deadzone)

    # Dpad Up status - returns 1 (pressed) or 0 (not pressed)
###########DPAD##############
#    def dpadUp(self):
#        self.refresh()
#        return int(self.reading[45:46])

#    def dpadDown(self):
#        self.refresh()
#        return int(self.reading[50:51])

#    def dpadLeft(self):
#        self.refresh()
#        return int(self.reading[55:56])

#    def dpadRight(self):
#        self.refresh()
#        return int(self.reading[60:61])

#    def Back(self):
#        self.refresh()
#        return int(self.reading[68:69])

#    def Guide(self):
#        self.refresh()
#        return int(self.reading[76:77])

#    def Start(self):
#        self.refresh()
#        return int(self.reading[84:85])

########ThumbStick#################
    def leftThumbstick(self):
        self.refresh()
        return int(self.reading[90:91])

    def rightThumbstick(self):
        self.refresh()
        return int(self.reading[95:96])

##########Buttons################
    def A(self):
        self.refresh()
        return int(self.reading[100:101])

    def B(self):
        self.refresh()
        return int(self.reading[104:105])

    def X(self):
        self.refresh()
        return int(self.reading[108:109])

    def Y(self):
        self.refresh()
        return int(self.reading[112:113])
        
#########Bumpers#################
    def leftBumper(self):
        self.refresh()
        return int(self.reading[118:119])

    def rightBumper(self):
        self.refresh()
        return int(self.reading[123:124])

##########Triggers###############
    def leftTrigger(self):
        self.refresh()
        return int(self.reading[129:132]) / 255.0

    def rightTrigger(self):
        self.refresh()
        return int(self.reading[136:139]) / 255.0

##########StickDeadZone############
    def leftStick(self,deadzone=4000):
        self.refresh()
        return (self.leftX(deadzone),self.leftY(deadzone))

    def rightStick(self,deadzone=4000):
        self.refresh()
        return (self.rightX(deadzone),self.rightY(deadzone))

    def close(self):
        self.proc.kill()

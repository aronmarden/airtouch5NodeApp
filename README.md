Information that can be queried:

Zone Status (Message Type 0x21):

Zone power state (On, Off, Turbo)
Zone number
Control method (temperature control or percentage control)
Current open percentage setting
Setpoint temperature
Sensor availability
Current temperature
Spill active/inactive status
Low battery status
AC Status (Message Type 0x23):

AC power state (On, Off, Away, Sleep)
AC number
AC mode (auto, heat, dry, fan, cool, auto heat, auto cool)
AC fan speed (auto, quiet, low, medium, high, powerful, turbo, intelligent auto)
Setpoint temperature
Turbo, Bypass, and Spill status
Timer status
Current temperature
Error code
AC Ability (Message Type 0xFF 0x11):

AC number
AC Name
Start zone number and zone count
Supported modes (cool, fan, dry, heat, auto)
Supported fan speeds (intelligent auto, turbo, powerful, high, medium, low, quiet, auto)
Minimum and maximum setpoint for cool and heat modes
AC Error Information (Message Type 0xFF 0x10):

AC number
Error information length
Error information (string)
Zone Name (Message Type 0xFF 0x13):

Zone number
Zone name length
Zone name
Console Version (Message Type 0xFF 0x30):

Update sign (indicates if the latest version is being used)
Version string length
Version details
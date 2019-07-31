These codes are returned with an action
# User Moderation
## 1000 - Kick
`p1`: user id\
`p2`: reason\
`p3`: *
## 1001 - Ban
`p1`: user id\
`p2`: reason\
`p3`: *
# Role Management
## 2000 - Add role
`p1`: role name\
`p2`: *
`p3`: *
## 2001 - Set role permission to 'allow'
`p1`: role id\
`p2`: role permission\
`p3`: *
## 2002 - Set role permission to 'prohibit'
`p1`: role id\
`p2`: role permission\
`p3`: *
## 2003 - Turn role setting on
`p1`: role id\
`p2`: role setting\
`p3`: *
## 2004 - Turn role setting off
`p1`: role id\
`p2`: role setting\
`p3`: *
## 2005 - Move role position
`p1`: role id\
`p2`: position
`p3`: *
## 2006 - Remove role
`p1`: role id\
`p2`: *\
`p3`: *
## 2007 - Add user to role
`p1`: role id\
`p2`: user id\
`p3`: *
## 2008 - Remove user from role
`p1`: role id\
`p2`: user id\
`p3`: *
# Channel Mangement
## 3000 - Add channel
`p1`: channel name\
`p2`: *
`p3`: *
## 3001 - Remove channel
`p1`: channel id\
`p2`: *\
`p3`: *
## 3002 - Set channel override 'prohibit'
`p1`: channel id\
`p2`: role id\
`p3`: channel permission\
## 3003 - Set channel override 'role default'
`p1`: channel id\
`p2`: role id\
`p3`: channel permission\
## 3004 - Set channel override 'allow'
`p1`: channel id\
`p2`: role id\
`p3`: channel permission\
## 3005 - Move channel override's position
`p1`: channel id\
`p2`: role id\
`p3`: position
## 3006 - Remove channel override
`Format`: CPV
`p1`: channel id\
`p2`: role id\
`p3`: *
## 3007 - Modify channel settings
`Format`: CSV
`p1`: channel id\
`p2`: channel setting\
`p3`: new value
# Server Management
## 4000 - Change server setting
`Format`: SV
`p1`: server setting\
`p2`: new value\
`p3`: *


# Parameter formats
* User, String - US
* Role, String - RS
* Role, Perm, PermValue - RPV
* Role, RoleSetting, RoleSettingValue - RSV
* Role - R
* Role, User - RU
* Channel, String - CS
* Channel - C
* Channel, Perm, PermValue - CPV
* Channel, ChannelSetting, ChannelSettingValue - CSV
* ServerSetting, ServerSettingValue - SV
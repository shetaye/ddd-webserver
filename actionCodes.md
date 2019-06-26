These codes are returned with an action
# User Moderation
## 1000 - Kick
`Format`: US
`p1`: user id\
`p2`: reason\
`p3`: *
## 1001 - Ban
`Format`: US
`p1`: user id\
`p2`: reason\
`p3`: *
# Role Management
## 2000 - Add role
`Format`: RS
`p1`: role name\
`p2`: *
`p3`: *
## 2001 - Modify role permissions
`Format`: RPV
`p1`: role id\
`p2`: role permission\
`p3`: new value
## 2002 - Modify role settings
`Format`: RSV
`p1`: role id\
`p2`: role setting\
`p3`: new value
## 2003 - Remove role
`Format`: R
`p1`: role id\
`p2`: *\
`p3`: *
## 2004 - Add user to role
`Format`: RU
`p1`: role id\
`p2`: user id\
`p3`: *
## 2005 - Remove user from role
`Format`: RU
`p1`: role id\
`p2`: user id\
`p3`: *
# Channel Mangement
## 3000 - Add channel
`Format`: CS
`p1`: channel name\
`p2`: *
`p3`: *
## 3001 - Remove channel
`Format`: C
`p1`: channel id\
`p2`: *\
`p3`: *
## 3002 - Modify channel permissions
`Format`: CPV
`p1`: channel id\
`p2`: channel permission\
`p3`: new value
## 3003 - Modify channel settings
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
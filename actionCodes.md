These codes are returned with an action
# User Moderation
## 1000 - Kick
`p1`: user name\
`p2`: reason\
`p3`: *
## 1001 - Ban
`p1`: user name\
`p2`: reason\
`p3`: *
# Role Management
## 2000 - Add role
`p1`: role name\
`p2`: *\
`p3`: *
## 2001 - Modify role permissions
`p1`: role name\
`p2`: role permission\
`p3`: new value
## 2002 - Modify role settings
`p1`: role name\
`p2`: role setting\
`p3`: new value
## 2003 - Remove role
`p1`: role name\
`p2`: *\
`p3`: *
## 2004 - Add user to role
`p1`: role name\
`p2`: user name\
`p3`: *
## 2005 - Remove user from role
`p1`: role name\
`p2`: user name\
`p3`: *
# Channel Mangement
## 3000 - Add channel
`p1`: channel name\
`p2`: *\
`p3`: *
## 3001 - Remove channel
`p1`: channel name\
`p2`: *\
`p3`: *
## 3002 - Modify channel permissions
`p1`: channel name\
`p2`: channel permission\
`p3`: new value
## 3003 - Modify channel settings
`p1`: channel name\
`p2`: channel setting\
`p3`: new value
# Server Management
## 4000 - Change server setting
`p1`: server setting\
`p2`: new value\
`p3`: *
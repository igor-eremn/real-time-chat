# Real Time Chat

## User:
- ID: ObjectID
- username
- name
- password: hashed
- created: Date

### user-model:
- createUser
- deleteUser
- findUserByEmail
- findUserById
- findUserByUsername
- updateUser
- updatePassword
- verifyPassword(findUserById + compare)
- findAllUsers
- searchUsers(name & username)
- getUserCount

### route-user:
- Middleware - verify if user exists
- Create new user
- Get user by ID
- Update user
- Delete user
- Change password
- Search users
- Get all users

## Chat:
- ID: ObjectID
- name
- description
- participants
- createdBy
- createdAt
- updatedAt
- isGroupChat

### chat-model:
- createChat
- getChatById
- updateChat
- deleteChat
- getUserChats
- addParticipant
- removeParticipant
- searchChats
- isUserInChat

### route-chat:
- Middleware - verify if chat exists
- Create new chat
- Get chat by ID
- Update chat
- Delete chat
- Get user's data
- Add participant to chat
- Remove participant from chat
- Search chats
- Check if user is in chat
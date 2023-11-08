# Authentication


## Usage

* `@Auth` - `Authtication require`
```js
@Patch('/:id')
  @Auth()
  async updateProfile(
```

* `@Roles` - `Role Require with Authen`
```js
@Patch('/:id')
  @Roles(Role.ADMIN)
  async updateProfile(
```

* `@CurrentUser` - `Get user info from Auth (User together with Role | Auth otherwise not working)`
```js
@Patch('/:id')
  @Roles(Role.ADMIN)
  async updateProfile(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateDto: UpdateMemberDto,
    @CurrentUser() userInfo,
```

* `@CurrentUser['id_member']` - `Get user info from Auth (User together with Role | Auth otherwise not working)`
  

```js
@Patch('/:id')
  @Roles(Role.ADMIN)
  async updateProfile(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateDto: UpdateMemberDto,
    @CurrentUser('id_member') userInfo,
```
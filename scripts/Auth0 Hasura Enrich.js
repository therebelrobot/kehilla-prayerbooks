function (user, context, callback) {

  const userId = user.user_id;
  console.log(user)

  const roles = (context.authorization || {}).roles;

  const namespace = "https://hasura.io/jwt/claims";
  context.accessToken[namespace] =
    {
      'x-hasura-default-role': 
        roles.includes('Admin') ? 
          'Admin' :
          roles.includes('Editor') ? 
            'Editor' :
            'User',
      'x-hasura-allowed-roles': roles,
      'x-hasura-user-id': user.user_id
    };
  callback(null, user, context);

}
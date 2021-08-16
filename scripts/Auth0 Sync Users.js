function (user, context, callback) {

  const userId = user.user_id;

  const roles = (context.authorization || {}).roles;
  
  const url = "https://kehilla.h4x.sh/v1/graphql";
  const upsertUserQuery = `
    mutation($userId: String!, $name: String!, $email: String!, $roles: jsonb, $picture: String!){
      insert_users(objects: [{ id: $userId, email: $email, roles: $roles, name: $name, picture: $picture }], on_conflict: { constraint: users_pkey, update_columns: [roles, name, email, picture] }) {
        affected_rows
      }
    }`;
  const graphqlReq = {
    query: upsertUserQuery,
    variables: {
      userId,
      email: user.email,
      roles: roles.length ? roles : ['User'],
      name: user.name,
      picture: user.picture
    }
  };

  request.post({
      headers: {
        'content-type' : 'application/json',
        'x-hasura-admin-secret': configuration.HASURA_ADMIN_SECRET
      },
      url:   url,
      body:  JSON.stringify(graphqlReq)
  }, function(error, response, body){
        console.log(body);
        callback(null, user, context);
  });
}
function (user, context, callback) {
  const userId = user.user_id;
  console.log(user)
  request.get({
    headers: {
      'content-type': 'application/json',
      'Authorization': `Bearer ${configuration.ADMIN_SECRET}`,
    },
    url: 'https://kehilla.us.auth0.com/api/v2/roles'
  }, (err1, res1, body1) => {
    const roles = JSON.parse(body1)
    const roleUsers = roles.map(r => new Promise((resolve, reject) =>{
      request.get({
        headers: {
          'content-type': 'application/json',
          'Authorization': `Bearer ${configuration.ADMIN_SECRET}`,
        },
        url: `https://kehilla.us.auth0.com/api/v2/roles/${encodeURIComponent(r.id)}/users`
      }, (err2, res2, body2) => {
        if (err2) return reject(err2)
        const roleUser = JSON.parse(body2)
        const userIsInRole = roleUser.some(ru => ru.user_id === userId)
        resolve(userIsInRole ? r.name : null)
      })
    }))
    Promise.all(roleUsers).then((results) => {
      console.log({results})
      const roles = results.filter(Boolean)
      
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
          roles: roles.length || 'User',
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
    })
  })
  
}
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
    })
  })
}
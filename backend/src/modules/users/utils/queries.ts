export const CreateUserQuery = `
    insert into users (name, email, password) values($1, $2, $3) returning id;
`
export const getUserInfoByEmail = `
    select id, name, email, password, is_active from users u where u.email = $1 
`

export const searchUsers = `
    select id, name, email, is_active from users u where 1 = 1 
`